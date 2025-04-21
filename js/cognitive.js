class CognitiveTrainer {
    constructor() {
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        this.timeLimit = 2000;
        this.isPlaying = false;
        this.isLevelingUp = false;
        this.achievements = new Set();
        
        // 定义颜色映射
        this.colorMap = {
            '深红': '#D32F2F',
            '深蓝': '#1976D2',
            '深绿': '#388E3C',
            '紫色': '#7B1FA2',
            '橙色': '#F57C00'
        };
        
        this.shapes = ['★', '●', '◆', '■', '▲'];
        this.words = Object.keys(this.colorMap); // 使用颜色名称作为文字选项
        
        this.stimulus = document.getElementById('stimulus');
        this.timerProgress = document.getElementById('timerProgress');
        this.startButton = document.getElementById('startButton');
        
        this.initEventListeners();
        this.initAudio();
        
        // 添加规则按钮和返回按钮的事件监听
        document.getElementById('rulesButton').addEventListener('click', () => {
            document.getElementById('gameRules').classList.add('active');
        });
        
        document.getElementById('rulesClose').addEventListener('click', () => {
            document.getElementById('gameRules').classList.remove('active');
        });
        
        document.getElementById('backButton').addEventListener('click', () => {
            window.history.back();
        });
    }

    initEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        document.getElementById('correctBtn').addEventListener('click', () => this.checkAnswer(true));
        document.getElementById('wrongBtn').addEventListener('click', () => this.checkAnswer(false));
        
        this.timerProgress.addEventListener('animationend', () => {
            if (this.isPlaying && !this.isLevelingUp) {
                this.handleTimeout();
            }
        });
    }

    initAudio() {
        this.sounds = {
            correct: new Audio('../assets/correct.mp3'),
            wrong: new Audio('../assets/wrong.mp3'),
            levelUp: new Audio('../assets/levelup.mp3'),
            combo: new Audio('../assets/combo.mp3')
        };
    }

    startGame() {
        this.isPlaying = true;
        this.isLevelingUp = false;
        this.startButton.style.display = 'none';
        this.stimulus.classList.add('active');
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
        this.resetTimer();
        this.displayChallenge();
    }

    resetTimer() {
        // 移除之前的动画
        this.timerProgress.classList.remove('active');
        // 强制重排以重置动画
        void this.timerProgress.offsetWidth;
        // 添加新的动画
        this.timerProgress.classList.add('active');
    }

    displayChallenge() {
        const shapeElement = this.stimulus.querySelector('.stimulus-shape');
        const wordElement = this.stimulus.querySelector('.stimulus-word');
        
        // 设置形状的样式
        shapeElement.style.color = this.currentChallenge.color;
        shapeElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.2)';
        shapeElement.textContent = this.currentChallenge.shape;
        
        // 设置文字的样式
        wordElement.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.15)';
        // 为浅色文字添加描边效果
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
        
        this.timerProgress.classList.remove('active');
        const correctAnswer = !this.currentChallenge.hasConflict;
        
        if (userAnswer === correctAnswer) {
            const baseScore = 100;
            const comboBonus = this.combo * 50;
            const totalScore = baseScore + comboBonus;
            
            this.score += totalScore;
            this.combo++;
            
            // 同时显示分数和连击效果
            const effectsContainer = document.getElementById('effectsContainer');
            effectsContainer.innerHTML = ''; // 清空之前的特效
            
            if (this.combo > 1) {
                this.showComboEffect();
            }
            this.showScorePopup(totalScore);
            
            this.sounds.correct.play();
            
            if (this.combo % 5 === 0) {
                this.levelUp();
                return; // 升级时不立即开始新回合
            }
            
            this.checkAchievements();
        } else {
            this.combo = 0;
            this.sounds.wrong.play();
            this.stimulus.classList.add('shake');
            setTimeout(() => this.stimulus.classList.remove('shake'), 500);
        }
        
        this.updateDisplay();
        setTimeout(() => this.newRound(), 300);
    }

    showScorePopup(score) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${score}`;
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
        this.isLevelingUp = true; // 标记开始升级
        this.level++;
        this.timeLimit = Math.max(500, 2000 - (this.level-1)*150);
        
        // 隐藏游戏元素
        this.stimulus.style.opacity = '0';
        
        // 创建升级效果
        const effect = document.createElement('div');
        effect.className = 'level-up-effect';
        effect.innerHTML = `
            <div class="level-up-text">Level Up!</div>
            <div class="level-up-text">Level ${this.level}</div>
        `;
        document.getElementById('effectsContainer').appendChild(effect);
        
        this.sounds.levelUp.play();
        
        // 等待动画完成后继续游戏
        setTimeout(() => {
            effect.remove();
            this.stimulus.style.opacity = '1';
            this.isLevelingUp = false; // 标记升级结束
            this.newRound(); // 开始新回合
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
        if (this.combo >= 20) {
            comboCard.style.background = 'linear-gradient(135deg, var(--combo-color-5), var(--combo-color-4))';
        } else if (this.combo >= 15) {
            comboCard.style.background = 'linear-gradient(135deg, var(--combo-color-4), var(--combo-color-3))';
        } else if (this.combo >= 10) {
            comboCard.style.background = 'linear-gradient(135deg, var(--combo-color-3), var(--combo-color-2))';
        } else if (this.combo >= 5) {
            comboCard.style.background = 'linear-gradient(135deg, var(--combo-color-2), var(--combo-color-1))';
        } else {
            comboCard.style.background = '';
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
        
        this.combo = 0;
        this.updateDisplay();
        this.newRound();
    }
}

// 启动游戏
new CognitiveTrainer(); 