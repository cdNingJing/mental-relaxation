class NumberSortGame {
    constructor() {
        this.currentLevel = 1;
        this.currentNumber = 1;
        this.maxNumber = 9;
        this.startTime = null;
        this.numbers = [];
        this.isProcessingClick = false;
        this.bestTimes = {};
        this.currentGridSize = 3;
        
        // 从本地存储加载游戏状态
        this.loadGameState();
        
        // DOM 元素
        this.numContainer = document.getElementById('num-container');
        this.resultModal = document.querySelector('.result-modal');
        this.modalOverlay = document.querySelector('.modal-overlay');
        this.resultTime = document.querySelector('.result-time');
        this.resultComment = document.querySelector('.result-comment');
    }

    // 保存游戏状态到本地存储
    saveGameState() {
        const gameState = {
            currentLevel: this.currentLevel,
            bestTimes: this.bestTimes,
            currentGridSize: this.currentGridSize
        };
        localStorage.setItem('numberSortGameState', JSON.stringify(gameState));
    }

    // 从本地存储加载游戏状态
    loadGameState() {
        const savedState = localStorage.getItem('numberSortGameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.currentLevel = gameState.currentLevel;
            this.bestTimes = gameState.bestTimes;
            this.currentGridSize = gameState.currentGridSize;
            this.maxNumber = this.currentGridSize * this.currentGridSize;
        }
    }

    // 继续游戏
    continueGame() {
        // 从本地存储加载游戏状态
        this.loadGameState();
        // 设置当前关卡的数字数量
        this.maxNumber = this.currentGridSize * this.currentGridSize;
        // 开始游戏，不重置状态
        this.startGame(false);
    }

    // 计算当前关卡的网格大小
    calculateGridSize() {
        // 从3x3开始，每关增加一行一列
        return 2 + this.currentLevel;
    }

    // 获取评价
    getComment(time, level) {
        // 根据关卡和数字数量动态调整基准时间
        const baseTime = Math.max(this.maxNumber * 0.3, 2);  // 每个数字大约需要0.3秒
        const thresholds = [
            { threshold: baseTime * 0.5, text: "这速度简直神了！我愿称你为最强王者！" },
            { threshold: baseTime * 0.7, text: "这操作很强啊，看来你是个高手！" },
            { threshold: baseTime * 0.9, text: "手速不行啊，建议回炉重造" },
            { threshold: baseTime * 1.1, text: "就这？我奶茶都喝完了你还没打完" },
            { threshold: baseTime * 1.3, text: "你是在用意念点击吗？要不要我教你用手指？" },
            { threshold: baseTime * 1.5, text: "看你这速度，怕是在用脚趾头点击吧" },
            { threshold: baseTime * 1.8, text: "我家门口的乌龟都比你快，而且它还在倒着走" },
            { threshold: baseTime * 2.0, text: "你是来帮倒忙的吧？这也太慢了" },
            { threshold: baseTime * 2.5, text: "你这是在演示慢动作回放吗？" },
            { threshold: baseTime * 3.0, text: "俗话说得好：慢工出细活，但你这是在出废品啊" },
            { threshold: baseTime * 3.5, text: "要不你先去睡一觉？等你清醒了再来玩？" },
            { threshold: baseTime * 4.0, text: "我等你打完都能把我的头发等白了" },
            { threshold: Infinity, text: "你这速度，我建议你去养蜗牛，还能跟它们交流心得" }
        ];

        // 添加关卡相关的额外评论
        let levelComment = '';
        if (level > 10) {
            if (time <= baseTime * 0.7) {
                levelComment = `\n第${level}关还能这么快，太厉害了！`;
            } else if (time <= baseTime * 1.2) {
                levelComment = `\n能在第${level}关保持这样的水平很不错！`;
            } else if (time > baseTime * 2.5) {
                levelComment = `\n第${level}关了，别着急，慢慢来～`;
            }
        }

        // 找到对应的评价
        for (const comment of thresholds) {
            if (time <= comment.threshold) {
                return comment.text + levelComment;
            }
        }
        return thresholds[thresholds.length - 1].text + levelComment;
    }

    // 显示结果弹窗
    showResultModal(time) {
        const prevBestTime = this.bestTimes[this.currentLevel] || Infinity;
        const isNewRecord = time < prevBestTime;
        
        if (isNewRecord) {
            this.bestTimes[this.currentLevel] = time;
        }

        // 构建完成时间文本
        const gridSizeText = `${this.currentGridSize}×${this.currentGridSize}`;
        const timeText = `第 ${this.currentLevel} 关 (${gridSizeText})\n完成用时: ${time}秒${isNewRecord ? ' 🎉 新纪录!' : ''}`;
        const bestTimeText = !isNewRecord && prevBestTime !== Infinity ? `\n本关最佳: ${prevBestTime}秒` : '';
        this.resultTime.textContent = timeText + bestTimeText;

        // 获取评价文案并显示
        this.resultComment.textContent = this.getComment(time, this.currentLevel);

        this.modalOverlay.classList.add('active');
        this.resultModal.classList.add('active');
    }

    // 隐藏结果弹窗
    hideResultModal() {
        this.modalOverlay.classList.remove('active');
        this.resultModal.classList.remove('active');
    }

    // 更新网格布局
    updateGridLayout() {
        // 移除所有现有的网格类
        this.numContainer.className = '';
        // 添加新的网格类
        this.numContainer.classList.add(`grid-${this.currentGridSize}`);
        // 设置CSS变量以控制网格大小
        this.numContainer.style.setProperty('--grid-size', this.currentGridSize);
    }

    // 开始游戏
    startGame(isNewGame = false) {
        if (isNewGame) {
            // 如果是新游戏，重置所有状态
            this.currentLevel = 1;
            this.currentGridSize = 3;
            this.maxNumber = this.currentGridSize * this.currentGridSize;
            this.bestTimes = {};
        }
        
        // 根据当前关卡计算网格大小
        this.currentGridSize = this.calculateGridSize();
        this.maxNumber = this.currentGridSize * this.currentGridSize;
        
        // 重置当前数字和生成新的数字数组
        this.currentNumber = 1;
        this.numbers = Array.from({length: this.maxNumber}, (_, i) => i + 1);
        this.shuffleArray(this.numbers);
        
        // 渲染界面
        this.renderNumbers();
        
        // 设置开始时间
        this.startTime = Date.now();
        this.hideResultModal();

        // 更新关卡信息显示
        const levelInfo = document.querySelector('.level-info');
        if (levelInfo) {
            levelInfo.textContent = `第 ${this.currentLevel} 关 (${this.currentGridSize}×${this.currentGridSize})`;
        }

        // 添加调试信息
        console.log(`Starting game level ${this.currentLevel} with grid size ${this.currentGridSize}`);
    }

    // 渲染数字
    renderNumbers() {
        // 清空容器
        this.numContainer.innerHTML = '';
        
        // 创建并添加按钮
        this.numbers.forEach((num, index) => {
            const button = document.createElement('button');
            button.className = 'num-btn';
            button.textContent = num; // 直接使用原始数字
            button.dataset.number = num;
            button.dataset.index = index;
            
            // 添加点击事件监听器
            button.addEventListener('click', (e) => this.handleNumberClick(e), { passive: true });
            
            // 将按钮添加到容器
            this.numContainer.appendChild(button);
        });

        // 更新网格布局
        this.updateGridLayout();
        
        // 添加调试信息
        console.log(`Rendering grid ${this.currentGridSize}x${this.currentGridSize} with ${this.maxNumber} numbers`);
        console.log('Numbers array:', this.numbers);
    }

    // 处理数字点击
    handleNumberClick(event) {
        const button = event.currentTarget;
        const num = parseInt(button.dataset.number); // 使用原始数字值
        
        // 如果按钮已经被标记为正确，直接返回
        if (button.classList.contains('correct')) {
            return;
        }

        // 如果正在处理点击，将事件加入队列
        if (this.isProcessingClick) {
            requestAnimationFrame(() => this.handleNumberClick(event));
            return;
        }

        this.isProcessingClick = true;
        
        if (num === this.currentNumber) {
            button.classList.add('correct');
            this.currentNumber++;
            
            if (this.currentNumber > this.maxNumber) {
                const endTime = Date.now();
                const time = ((endTime - this.startTime) / 1000).toFixed(2);
                this.showResultModal(time);
            }
        } else {
            button.classList.add('wrong');
            setTimeout(() => {
                button.classList.remove('wrong');
            }, 500);
        }

        this.isProcessingClick = false;
    }

    // 数组随机排序
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 下一关
    nextLevel() {
        this.currentLevel++;
        // 更新网格大小
        this.currentGridSize = this.calculateGridSize();
        this.maxNumber = this.currentGridSize * this.currentGridSize;
        this.startGame();
        this.saveGameState();
    }

    // 显示完成所有关卡的消息
    showCompletionMessage() {
        this.resultTime.textContent = "恭喜完成所有关卡！";
        this.resultComment.textContent = "你已经是数字排序大师了！";
        this.resultModal.classList.add('active');
        this.modalOverlay.classList.add('active');
        // 隐藏"下一关"按钮
        document.getElementById('next-focus').style.display = 'none';
    }
}

// 导出游戏类
window.NumberSortGame = NumberSortGame; 