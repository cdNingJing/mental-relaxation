class CognitiveTrainer {
    constructor() {
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        this.timeLimit = 2000;
        this.isPlaying = false;
        this.isLevelingUp = false;
        this.achievements = new Set();
        this.timerAnimation = null;
        this.levelUpScore = 1000; // 升级所需分数
        this.comboThreshold = 0.7; // 连击判定阈值（70%）
        this.animationFrame = null;
        this.startTime = null;
        
        // 定义颜色映射
        this.colorMap = {
            '深红': '#D32F2F',
            '深蓝': '#1976D2',
            '深绿': '#388E3C',
            '紫色': '#7B1FA2',
            '橙色': '#F57C00'
        };
        
        this.shapes = ['★', '●', '◆', '■', '▲'];
        this.words = Object.keys(this.colorMap);
        
        // 初始化 DOM 元素
        this.initElements();
        this.initEventListeners();

        // 初始化游戏状态
        this.hideGameContainer();
    }

    initElements() {
        // 页面元素
        this.pageContainer = document.querySelector('.cognitive-page-container');
        this.gameContainer = document.getElementById('cognitive-game-container');
        
        // 游戏元素
        this.stimulus = document.getElementById('stimulus');
        this.timerProgress = document.getElementById('timerProgress');
        this.startButton = document.getElementById('startButton');
        this.continueButton = document.getElementById('continueButton');
        this.retryButton = document.getElementById('retryButton');
        this.nextButton = document.getElementById('nextButton');
        
        // 状态显示
        this.currentLevel = document.getElementById('currentLevel');
        this.currentCombo = document.getElementById('currentCombo');
        this.currentScore = document.getElementById('currentScore');
        
        // 弹窗元素
        this.helpModal = document.querySelector('.help-modal');
        this.closeHelp = document.querySelector('.close-help');
        this.helpButton = document.querySelector('.help-button');
        this.modalOverlay = document.querySelector('.modal-overlay');
        this.resultModal = document.querySelector('.result-modal');
        this.resultTime = document.querySelector('.result-time');
        this.resultComment = document.querySelector('.result-comment');
        
        // 全屏按钮
        this.exitFullscreen = document.querySelector('.exit-fullscreen');
    }

    hideGameContainer() {
        if (this.gameContainer) {
            this.gameContainer.style.display = 'none';
            this.gameContainer.classList.remove('active');
        }
        if (this.pageContainer) {
            this.pageContainer.style.display = 'block';
        }
    }

    showGameContainer() {
        if (this.pageContainer) {
            this.pageContainer.style.display = 'none';
        }
        if (this.gameContainer) {
            this.gameContainer.style.display = 'block';
            this.gameContainer.classList.add('active');
        }
    }

    initEventListeners() {
        // 开始游戏按钮
        this.startButton.addEventListener('click', () => this.startGame());
        this.continueButton.addEventListener('click', () => this.startGame());
        
        // 游戏控制按钮
        document.getElementById('correctBtn').addEventListener('click', () => this.checkAnswer(true));
        document.getElementById('wrongBtn').addEventListener('click', () => this.checkAnswer(false));
        
        // 计时器动画结束事件
        this.timerProgress.addEventListener('animationend', () => {
            if (this.isPlaying && !this.isLevelingUp) {
                this.handleTimeout();
            }
        });
        
        // 帮助弹窗
        this.helpButton.addEventListener('click', () => this.showHelp());
        this.closeHelp.addEventListener('click', () => this.hideHelp());
        
        // 结果弹窗按钮
        this.retryButton.addEventListener('click', () => this.retryGame());
        this.nextButton.addEventListener('click', () => this.nextLevel());
        
        // 退出按钮
        this.exitFullscreen.addEventListener('click', () => this.exitGame());
    }

    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await this.gameContainer.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error(`全屏切换错误: ${err.message}`);
        }
    }

    startGame() {
        this.isPlaying = true;
        this.isLevelingUp = false;
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        this.timeLimit = 2000; // 重置时间限制
        
        // 显示游戏容器
        this.showGameContainer();
        
        // 更新显示
        this.updateDisplay();
        
        // 开始新回合
        this.newRound();
        
        // 尝试进入全屏
        this.toggleFullscreen();
    }

    showHelp() {
        this.helpModal.style.display = 'block';
        this.modalOverlay.style.display = 'block';
    }

    hideHelp() {
        this.helpModal.style.display = 'none';
        this.modalOverlay.style.display = 'none';
    }

    showResult(time, comment) {
        this.resultTime.textContent = time;
        this.resultComment.textContent = comment;
        this.resultModal.style.display = 'block';
        this.modalOverlay.style.display = 'block';
    }

    hideResult() {
        this.resultModal.style.display = 'none';
        this.modalOverlay.style.display = 'none';
    }

    retryGame() {
        this.hideResult();
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        this.updateDisplay();
        this.newRound();
    }

    nextLevel() {
        this.hideResult();
        this.newRound();
    }

    generateChallenge() {
        // 随机选择一个颜色名称
        const colorNames = Object.keys(this.colorMap);
        const selectedColorName = colorNames[Math.floor(Math.random() * colorNames.length)];
        const selectedColor = this.colorMap[selectedColorName];
        
        // 随机选择一个形状
        const selectedShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        
        // 决定是否制造冲突
        const shouldCreateConflict = Math.random() > 0.5;
        let displayWord = selectedColorName;
        
        if (shouldCreateConflict) {
            // 选择一个不同的颜色名称作为显示文字
            const otherColorNames = colorNames.filter(name => name !== selectedColorName);
            displayWord = otherColorNames[Math.floor(Math.random() * otherColorNames.length)];
        }

        return {
            color: selectedColor,
            shape: selectedShape,
            word: displayWord,
            hasConflict: shouldCreateConflict
        };
    }

    newRound() {
        if (!this.isPlaying || this.isLevelingUp) return;
        
        this.currentChallenge = this.generateChallenge();
        this.displayChallenge();
        // 在显示新的挑战后重置计时器
        setTimeout(() => this.resetTimer(), 50);
    }

    displayChallenge() {
        const shapeElement = this.stimulus.querySelector('.stimulus-shape');
        const wordElement = this.stimulus.querySelector('.stimulus-word');
        
        // 先隐藏元素
        shapeElement.style.opacity = '0';
        wordElement.style.opacity = '0';
        
        // 设置形状的样式
        shapeElement.style.color = this.currentChallenge.color;
        shapeElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.2)';
        shapeElement.textContent = this.currentChallenge.shape;
        
        // 设置文字的样式
        wordElement.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.15)';
        const color = this.currentChallenge.color;
        const isLightColor = this.isLightColor(color);
        if (isLightColor) {
            wordElement.style.webkitTextStroke = '1px rgba(0, 0, 0, 0.3)';
            wordElement.style.textStroke = '1px rgba(0, 0, 0, 0.3)';
        } else {
            wordElement.style.webkitTextStroke = 'none';
            wordElement.style.textStroke = 'none';
        }
        wordElement.textContent = this.currentChallenge.word;
        
        // 使用 requestAnimationFrame 确保在下一帧显示元素
        requestAnimationFrame(() => {
            shapeElement.style.opacity = '1';
            wordElement.style.opacity = '1';
        });
    }

    resetTimer() {
        // 取消之前的动画帧
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // 重置进度条
        const progress = this.timerProgress;
        progress.style.width = '100%';
        
        // 记录开始时间
        this.startTime = performance.now();
        
        // 开始动画
        this.animateProgress();
        
        // 设置超时处理
        this.timerAnimation = setTimeout(() => {
            if (this.isPlaying && !this.isLevelingUp) {
                this.handleTimeout();
            }
        }, this.timeLimit);
    }

    animateProgress() {
        const progress = this.timerProgress;
        const elapsed = performance.now() - this.startTime;
        const progressRatio = 1 - (elapsed / this.timeLimit);
        
        if (progressRatio > 0) {
            progress.style.width = `${progressRatio * 100}%`;
            this.animationFrame = requestAnimationFrame(() => this.animateProgress());
        } else {
            progress.style.width = '0%';
        }
    }

    // 判断颜色是否为浅色
    isLightColor(color) {
        // 将颜色转换为RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // 计算亮度
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155; // 亮度阈值
    }

    checkAnswer(userAnswer) {
        if (!this.isPlaying || this.isLevelingUp) return;
        
        // 停止计时器和动画
        if (this.timerAnimation) {
            clearTimeout(this.timerAnimation);
            this.timerAnimation = null;
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        const progress = this.timerProgress;
        const correctAnswer = !this.currentChallenge.hasConflict;
        
        if (userAnswer === correctAnswer) {
            // 基于进度条计算基础分数（最高100分）
            const computedStyle = window.getComputedStyle(progress);
            const width = parseFloat(computedStyle.width);
            const progressRatio = width / 100;
            const baseScore = Math.round(progressRatio * 100);
            let totalScore = baseScore;
            
            // 只有在进度大于70%时才计入连击
            if (progressRatio >= this.comboThreshold) {
                this.combo++;
                const comboBonus = this.combo * 20; // 每次连击额外加20分
                totalScore += comboBonus;
                
                if (this.combo > 1) {
                    this.showComboEffect();
                }
            } else {
                this.combo = 0; // 进度低于70%重置连击
            }
            
            this.score += totalScore;
            this.showScorePopup(totalScore);
            
            // 检查是否达到升级分数
            if (this.score >= this.levelUpScore) {
                this.levelUp();
                return;
            }
            
            this.checkAchievements();
        } else {
            // 回答错误时减少50分
            this.score = Math.max(0, this.score - 50);
            this.combo = 0;
            
            // 显示错误效果和减少的分数
            this.stimulus.classList.add('shake');
            this.showScorePopup(-50);
            
            setTimeout(() => {
                this.stimulus.classList.remove('shake');
                // 生成新的挑战
                this.currentChallenge = this.generateChallenge();
                this.displayChallenge();
            }, 500);
        }
        
        // 重置进度条
        progress.style.width = '100%';
        
        // 更新显示
        this.updateDisplay();
        
        // 开始新回合
        setTimeout(() => {
            this.currentChallenge = this.generateChallenge();
            this.displayChallenge();
            this.resetTimer();
        }, 300);
    }

    showScorePopup(score) {
        const popup = document.createElement('div');
        popup.className = `score-popup ${score >= 0 ? 'positive' : 'negative'}`;
        popup.textContent = score >= 0 ? score : score;
        document.getElementById('effectsContainer').appendChild(popup);
        setTimeout(() => popup.remove(), 500);
    }

    showComboEffect() {
        const effect = document.createElement('div');
        effect.className = 'combo-effect';
        effect.textContent = `${this.combo} 连击！`;
        document.getElementById('effectsContainer').appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }

    levelUp() {
        this.isLevelingUp = true;
        this.level++;
        
        // 更新下一级所需分数
        this.levelUpScore = this.level * 1000;
        
        // 减少时间限制，但不低于500ms
        this.timeLimit = Math.max(500, 2000 - (this.level - 1) * 150);
        
        // 隐藏游戏元素
        this.stimulus.style.opacity = '0';
        
        // 创建升级效果
        const effect = document.createElement('div');
        effect.className = 'level-up-effect';
        effect.innerHTML = `
            <div class="level-up-text">Level Up!</div>
            <div class="level-up-text">Level ${this.level}</div>
            <div class="level-up-text">目标分数: ${this.levelUpScore}</div>
            <div class="level-up-text">时间限制: ${(this.timeLimit / 1000).toFixed(1)}秒</div>
        `;
        document.getElementById('effectsContainer').appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
            this.stimulus.style.opacity = '1';
            this.isLevelingUp = false;
            this.newRound();
        }, 1500);
    }

    updateDisplay() {
        document.getElementById('currentLevel').textContent = this.level;
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentCombo').textContent = this.combo;
        
        // 更新连击卡片状态
        const comboCard = document.querySelector('.combo-card');
        comboCard.setAttribute('data-combo', this.combo);
        
        // 根据连击数更新样式
        if (this.combo >= 10) {
            comboCard.style.background = 'var(--gradient-primary)';
            comboCard.querySelector('.status-value').style.color = 'white';
        } else if (this.combo >= 5) {
            comboCard.style.background = 'var(--primary-light)';
            comboCard.querySelector('.status-value').style.color = 'white';
        } else {
            comboCard.style.background = 'var(--bg-light)';
            comboCard.querySelector('.status-value').style.color = 'var(--primary-color)';
        }
        
        // 添加连击动画效果
        if (this.combo > 0) {
            const statusValue = comboCard.querySelector('.status-value');
            statusValue.style.animation = 'none';
            statusValue.offsetHeight; // 触发重排
            statusValue.style.animation = 'popIn 0.3s ease-out';
        }
    }

    checkAchievements() {
        const achievements = [
            { id: 'combo5', condition: () => this.combo >= 5, title: '连击大师', desc: '达成5连击' },
            { id: 'combo10', condition: () => this.combo >= 10, title: '完美操作', desc: '达成10连击' },
            { id: 'level5', condition: () => this.level >= 5, title: '升级专家', desc: '达到5级' },
            { id: 'score1000', condition: () => this.score >= 1000, title: '分数王者', desc: '获得1000分' }
        ];

        achievements.forEach(achievement => {
            if (!this.achievements.has(achievement.id) && achievement.condition()) {
                this.achievements.add(achievement.id);
                this.showAchievement(achievement);
            }
        });
    }

    showAchievement(achievement) {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        achievementElement.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;
        document.getElementById('effectsContainer').appendChild(achievementElement);
        setTimeout(() => achievementElement.remove(), 3000);
    }

    handleTimeout() {
        if (!this.isPlaying || this.isLevelingUp) return;
        
        // 取消动画帧
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // 重置进度条
        const progress = this.timerProgress;
        progress.style.width = '0%';
        
        this.combo = 0;
        this.updateDisplay();
        
        // 添加视觉反馈
        this.stimulus.classList.add('shake');
        setTimeout(() => this.stimulus.classList.remove('shake'), 500);
        
        // 开始新回合
        setTimeout(() => this.newRound(), 300);
    }

    async exitGame() {
        // 停止游戏
        this.isPlaying = false;
        
        // 清除计时器
        if (this.timerAnimation) {
            clearTimeout(this.timerAnimation);
            this.timerAnimation = null;
        }
        
        // 重置游戏状态
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        
        // 退出全屏
        if (document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch (err) {
                console.error('退出全屏失败:', err);
            }
        }
        
        // 隐藏游戏容器，显示主页
        this.hideGameContainer();
        
        // 重置显示
        this.updateDisplay();
        
        // 隐藏所有可能的弹窗
        this.hideHelp();
        this.hideResult();
        
        // 重置进度条
        this.timerProgress.classList.remove('active');
        this.timerProgress.style.animation = 'none';
    }

    // 添加调试方法
    toggleDebug() {
        const progress = this.timerProgress;
        progress.classList.toggle('debug');
        console.log('Debug mode:', progress.classList.contains('debug'));
        
        // 输出当前状态
        console.log('Timer state:', {
            timeLimit: this.timeLimit,
            isPlaying: this.isPlaying,
            isLevelingUp: this.isLevelingUp,
            hasActiveClass: progress.classList.contains('active'),
            animation: progress.style.animation,
            transform: progress.style.transform
        });
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new CognitiveTrainer();
}); 