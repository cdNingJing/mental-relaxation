class VisualTrackingGame {
    constructor() {
        this.visualTarget = null;
        this.visualScore = 0;
        this.gameContainer = document.getElementById('visual-game-container');
        this.exitButton = this.gameContainer.querySelector('.exit-fullscreen');
        this.helpButton = this.gameContainer.querySelector('.help-button');
        this.helpModal = this.gameContainer.querySelector('.help-modal');
        this.closeHelpButton = this.gameContainer.querySelector('.close-help');
        this.resultModal = this.gameContainer.querySelector('.result-modal');
        this.resultTime = this.gameContainer.querySelector('.result-time');
        this.resultComment = this.gameContainer.querySelector('.result-comment');
        this.retryButton = document.getElementById('retry-visual');
        this.nextButton = document.getElementById('next-visual');
        this.startButton = document.getElementById('start-visual');
        this.continueButton = document.getElementById('continue-visual');
        
        // 添加音效
        this.clickSound = new Audio('../sounds/mixkit-modern-technology-select-3124.wav');
        this.clickSound.volume = 0.3;
        
        this.currentLevel = 1;
        this.gameTime = 30; // 30秒游戏时间
        this.countdownTimer = null;
        this.targetSize = 40; // 增大初始目标点大小
        this.moveSpeed = 2000; // 初始移动速度（毫秒）
        this.isGameRunning = false;
        this.maxClicks = 10; // 每关需要点击的次数
        this.lastPosition = { x: 0, y: 0 }; // 记录上一次的位置
        
        // 从本地存储加载关卡记录
        this.loadProgress();
        
        // 检查是否有保存的关卡记录
        this.checkSavedProgress();
        
        this.init();
    }

    init() {
        // 确保按钮存在
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startNewGame());
        }
        
        if (this.continueButton) {
            this.continueButton.addEventListener('click', () => this.continueGame());
        }
        
        if (this.exitButton) {
            this.exitButton.addEventListener('click', () => this.exitFullscreen());
        }
        
        if (this.helpButton) {
            this.helpButton.addEventListener('click', () => this.showHelpModal());
        }
        
        if (this.closeHelpButton) {
            this.closeHelpButton.addEventListener('click', () => this.hideHelpModal());
        }
        
        if (this.retryButton) {
            this.retryButton.addEventListener('click', () => {
                this.hideResultModal();
                this.startGame();
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.hideResultModal();
                this.nextLevel();
            });
        }
        
        // 监听 ESC 键退出全屏
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && this.gameContainer.classList.contains('active')) {
                this.exitFullscreen();
            }
        });
    }

    loadProgress() {
        const savedLevel = localStorage.getItem('visualTrackingLevel');
        if (savedLevel) {
            this.currentLevel = parseInt(savedLevel);
            this.updateGameSettings();
        }
    }

    saveProgress() {
        localStorage.setItem('visualTrackingLevel', this.currentLevel.toString());
        this.checkSavedProgress(); // 更新按钮显示状态
    }

    updateGameSettings() {
        this.targetSize = Math.max(30, 40 - (this.currentLevel - 1) * 2);
        this.moveSpeed = Math.max(800, 2000 - (this.currentLevel - 1) * 200);
        this.gameTime = Math.max(15, 30 - (this.currentLevel - 1));
    }

    startGame() {
        this.enterFullscreen();
        this.visualScore = 0;
        this.isGameRunning = true;
        this.createTarget();
        this.startCountdown();
    }

    startCountdown() {
        // 移除可能存在的旧倒计时元素
        const oldCountdown = document.getElementById('countdown');
        if (oldCountdown) {
            oldCountdown.remove();
        }

        const countdownElement = document.createElement('div');
        countdownElement.id = 'countdown';
        countdownElement.style.position = 'absolute';
        countdownElement.style.top = '10px';
        countdownElement.style.left = '10px';
        countdownElement.style.fontSize = '20px';
        countdownElement.style.color = '#FFFFFF';
        countdownElement.style.display = 'flex';
        countdownElement.style.alignItems = 'center';
        countdownElement.style.gap = '10px';
        
        // 创建关卡显示元素
        const levelElement = document.createElement('span');
        levelElement.textContent = `第 ${this.currentLevel} 关`;
        
        // 创建时间显示元素
        const timeElement = document.createElement('span');
        timeElement.textContent = this.gameTime.toFixed(2);
        
        countdownElement.appendChild(levelElement);
        countdownElement.appendChild(timeElement);
        this.gameContainer.appendChild(countdownElement);

        let timeLeft = this.gameTime;
        timeElement.textContent = timeLeft.toFixed(2);

        this.countdownTimer = setInterval(() => {
            timeLeft -= 0.01;
            timeElement.textContent = timeLeft.toFixed(2);
            
            if (timeLeft <= 0) {
                this.endGame();
            }
        }, 10); // 每10毫秒更新一次，实现更流畅的倒计时
    }

    enterFullscreen() {
        this.gameContainer.classList.add('active');
        document.documentElement.requestFullscreen().catch(() => {
            console.log('Fullscreen request failed');
        });
    }

    exitFullscreen() {
        this.resetGame();
        this.gameContainer.classList.remove('active');
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {
                console.log('Exit fullscreen failed');
            });
        }
    }

    showHelpModal() {
        this.helpModal.innerHTML = `
            <button class="close-help">×</button>
            <h3>游戏规则</h3>
            <p>1. 游戏开始后，屏幕上会出现一个移动的目标点</p>
            <p>2. 您需要追踪并点击这个目标点</p>
            <p>3. 每关需要点击 ${this.maxClicks} 次目标点</p>
            <p>4. 每关难度会增加：目标变小、移动更快、时间更短</p>
            <p>5. 挑战自己，争取更快的完成时间！</p>
        `;
        this.helpModal.classList.add('active');
        this.gameContainer.querySelector('.modal-overlay').classList.add('active');
        
        // 重新绑定关闭按钮事件
        const closeButton = this.helpModal.querySelector('.close-help');
        closeButton.addEventListener('click', () => this.hideHelpModal());
    }

    hideHelpModal() {
        this.helpModal.classList.remove('active');
        this.gameContainer.querySelector('.modal-overlay').classList.remove('active');
    }

    createTarget() {
        const gameContent = this.gameContainer.querySelector('.game-content');
        gameContent.innerHTML = '';
        
        // 创建点击区域容器
        const clickArea = document.createElement('div');
        clickArea.style.position = 'absolute';
        clickArea.style.width = `${this.targetSize * 2}px`;
        clickArea.style.height = `${this.targetSize * 2}px`;
        clickArea.style.cursor = 'pointer';
        clickArea.style.display = 'flex';
        clickArea.style.alignItems = 'center';
        clickArea.style.justifyContent = 'center';
        
        // 创建目标点
        this.visualTarget = document.createElement('div');
        this.visualTarget.style.width = `${this.targetSize}px`;
        this.visualTarget.style.height = `${this.targetSize}px`;
        this.visualTarget.style.backgroundColor = '#FFFFFF';
        this.visualTarget.style.borderRadius = '50%';
        this.visualTarget.style.opacity = '1';
        this.visualTarget.style.pointerEvents = 'none';
        
        // 添加点击效果
        clickArea.addEventListener('click', (event) => {
            if (!this.isGameRunning) return;
            
            // 停止当前正在播放的音效
            this.clickSound.pause();
            this.clickSound.currentTime = 0;
            
            // 播放新的音效
            this.clickSound.play().catch(e => console.log('Audio play failed:', e));
            
            this.handleTargetClick();
        });
        
        clickArea.appendChild(this.visualTarget);
        gameContent.appendChild(clickArea);
        this.startAutoMove();
    }

    startAutoMove() {
        // 清除可能存在的旧计时器
        if (this.autoMoveTimer) {
            clearInterval(this.autoMoveTimer);
        }
        
        // 设置新的计时器
        this.autoMoveTimer = setInterval(() => {
            if (this.isGameRunning) {
                this.moveTarget();
            }
        }, this.moveSpeed);
    }

    moveTarget() {
        const gameContent = this.gameContainer.querySelector('.game-content');
        const maxX = gameContent.clientWidth - this.targetSize * 2;
        const maxY = gameContent.clientHeight - this.targetSize * 2;
        
        let newX, newY;
        let attempts = 0;
        const maxAttempts = 10;
        const minDistance = this.targetSize * 2;
        
        do {
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;
            attempts++;
            
            if (attempts >= maxAttempts) {
                break;
            }
            
            // 计算与上一次位置的距离
            const dx = newX - this.lastPosition.x;
            const dy = newY - this.lastPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果距离足够远，跳出循环
            if (distance >= minDistance) {
                break;
            }
        } while (true);
        
        // 更新位置
        this.lastPosition = { x: newX, y: newY };
        const clickArea = this.visualTarget.parentElement;
        clickArea.style.left = `${newX}px`;
        clickArea.style.top = `${newY}px`;
        this.visualTarget.style.opacity = '1';
    }

    handleTargetClick() {
        if (this.isGameRunning) {
            this.visualScore++;
            
            // 清除当前的自动移动计时器
            if (this.autoMoveTimer) {
                clearInterval(this.autoMoveTimer);
            }
            
            // 立即移动到新位置
            this.moveTarget();
            
            // 重新开始自动移动计时
            this.startAutoMove();
            
            // 检查是否达到目标点击次数
            if (this.visualScore >= this.maxClicks) {
                this.endGame();
            }
        }
    }

    endGame() {
        this.isGameRunning = false;
        clearInterval(this.countdownTimer);
        clearInterval(this.autoMoveTimer);
        
        // 计算实际使用时间
        const timeUsed = (this.gameTime - parseFloat(document.getElementById('countdown').querySelector('span:last-child').textContent)).toFixed(2);
        
        if (this.visualScore >= this.maxClicks) {
            // 成功完成
            this.resultTime.textContent = `第 ${this.currentLevel} 关完成！`;
            this.resultComment.textContent = `您用时 ${timeUsed} 秒完成了 ${this.maxClicks} 次点击。`;
            this.nextButton.style.display = 'block'; // 显示下一关按钮
        } else {
            // 挑战失败
            this.resultTime.textContent = `挑战失败！`;
            this.resultComment.textContent = `您只完成了 ${this.visualScore} 次点击，未达到目标 ${this.maxClicks} 次。`;
            this.nextButton.style.display = 'none'; // 隐藏下一关按钮
        }
        
        this.resultModal.classList.add('active');
        this.gameContainer.querySelector('.modal-overlay').classList.add('active');
        
        this.visualTarget.remove();
    }

    nextLevel() {
        // 检查本地存储中的最高关卡记录
        const savedMaxLevel = localStorage.getItem('visualTrackingLevel');
        const currentMaxLevel = savedMaxLevel ? parseInt(savedMaxLevel) : 0;
        
        // 进入下一关
        this.currentLevel++;
        this.updateGameSettings();
        
        // 如果当前关卡超过本地记录，则更新
        if (this.currentLevel > currentMaxLevel) {
            this.saveProgress(); // 保存新的关卡记录
        }
        
        this.hideResultModal();
        this.startGame();
    }

    resetGame() {
        this.updateGameSettings();
        this.isGameRunning = false;
        this.visualScore = 0;
        this.lastPosition = { x: 0, y: 0 };
        
        if (this.visualTarget) {
            this.visualTarget.remove();
        }
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
        if (this.autoMoveTimer) {
            clearInterval(this.autoMoveTimer);
        }
        
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.remove();
        }
        
        this.hideResultModal();
    }

    hideResultModal() {
        this.resultModal.classList.remove('active');
        this.gameContainer.querySelector('.modal-overlay').classList.remove('active');
    }

    // 检查保存的进度
    checkSavedProgress() {
        const savedLevel = localStorage.getItem('visualTrackingLevel');
        if (savedLevel && parseInt(savedLevel) > 1) {
            this.continueButton.classList.add('visible');
        } else {
            this.continueButton.classList.remove('visible');
        }
    }

    // 开始新游戏
    startNewGame() {
        this.currentLevel = 1;
        this.updateGameSettings();
        this.startGame();
    }

    // 继续游戏
    continueGame() {
        const savedLevel = localStorage.getItem('visualTrackingLevel');
        if (savedLevel) {
            this.currentLevel = parseInt(savedLevel);
            this.updateGameSettings();
            this.startGame();
        }
    }
}

// 当页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new VisualTrackingGame();
}); 