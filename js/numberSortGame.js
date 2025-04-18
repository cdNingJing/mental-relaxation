class NumberSortGame {
    constructor() {
        this.currentLevel = 1;
        this.currentNumber = 1;
        this.maxNumber = 9;
        this.startTime = null;
        this.numbers = [];
        this.isProcessingClick = false;
        this.bestTimes = {};
        this.currentGridRows = 3;
        this.currentGridCols = 3;
        
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
            currentGridRows: this.currentGridRows,
            currentGridCols: this.currentGridCols
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
            this.currentGridRows = gameState.currentGridRows;
            this.currentGridCols = gameState.currentGridCols;
            this.maxNumber = this.currentGridRows * this.currentGridCols;
        }
    }

    // 继续游戏
    continueGame() {
        // 从本地存储加载游戏状态
        this.loadGameState();
        // 设置当前关卡的数字数量
        this.maxNumber = this.currentGridRows * this.currentGridCols;
        // 开始游戏，不重置状态
        this.startGame(false);
    }

    // 计算下一关的网格布局和数字数量
    calculateNextLevelGrid() {
        const containerWidth = this.numContainer.clientWidth;
        const containerHeight = this.numContainer.clientHeight;
        const minButtonSize = 50; // 最小按钮大小（包括间距）
        const aspectRatio = containerWidth / containerHeight;
        
        // 计算当前每个按钮的实际大小
        const currentButtonWidth = containerWidth / this.currentGridCols;
        const currentButtonHeight = containerHeight / this.currentGridRows;

        // 尝试增加列数
        const nextColButtonWidth = containerWidth / (this.currentGridCols + 1);
        // 尝试增加行数
        const nextRowButtonHeight = containerHeight / (this.currentGridRows + 1);

        // 如果按钮会变得太小，考虑改变布局策略
        if (nextColButtonWidth < minButtonSize && nextRowButtonHeight < minButtonSize) {
            // 如果当前是方形布局，选择更合适的布局
            if (this.currentGridRows === this.currentGridCols) {
                // 根据容器的宽高比决定是增加行还是列
                if (aspectRatio > 1) {
                    this.currentGridCols++;
                } else {
                    this.currentGridRows++;
                }
            } else {
                // 如果当前不是方形，尝试变成方形
                const newSize = Math.max(this.currentGridRows, this.currentGridCols);
                this.currentGridRows = newSize;
                this.currentGridCols = newSize;
            }
        } else {
            // 选择减少幅度较小的方向
            if (nextColButtonWidth > nextRowButtonHeight) {
                this.currentGridCols++;
            } else {
                this.currentGridRows++;
            }
        }

        return this.currentGridRows * this.currentGridCols;
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
                levelComment = `\n${level}关还能这么快，看来我确实小看你了！`;
            } else if (time > baseTime * 2.5) {
                levelComment = `\n${level}关了还这么慢，你是来搞笑的吧？`;
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
        const timeText = `完成用时: ${time}秒${isNewRecord ? ' 🎉 新纪录!' : ''}`;
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
        this.numContainer.style.gridTemplateColumns = `repeat(${this.currentGridCols}, 1fr)`;
        this.numContainer.style.gridTemplateRows = `repeat(${this.currentGridRows}, 1fr)`;
        
        // 根据网格大小调整按钮样式
        const totalCells = this.currentGridRows * this.currentGridCols;
        if (totalCells > 20) {
            this.numContainer.className = 'grid-large';
        } else if (totalCells > 12) {
            this.numContainer.className = 'grid-medium';
        } else {
            this.numContainer.className = 'grid-small';
        }
    }

    // 开始游戏
    startGame(isNewGame = false) {
        if (isNewGame) {
            // 如果是新游戏，重置所有状态
            this.currentLevel = 1;
            this.currentGridRows = 3;
            this.currentGridCols = 3;
            this.maxNumber = this.currentGridRows * this.currentGridCols;
            this.bestTimes = {};
            this.saveGameState(); // 保存重置后的状态
        }
        
        this.currentNumber = 1;
        this.numbers = Array.from({length: this.maxNumber}, (_, i) => i + 1);
        this.shuffleArray(this.numbers);
        this.updateGridLayout();
        this.renderNumbers();
        this.startTime = Date.now();
        this.hideResultModal();
    }

    // 重置游戏
    resetGame() {
        this.currentLevel = 1;
        this.currentGridRows = 3;
        this.currentGridCols = 3;
        this.maxNumber = this.currentGridRows * this.currentGridCols;
        this.bestTimes = {};
        this.numContainer.innerHTML = '';
        this.hideResultModal();
        this.updateGridLayout();
        this.saveGameState(); // 保存重置后的状态
    }

    // 渲染数字
    renderNumbers() {
        this.numContainer.innerHTML = '';
        this.numbers.forEach(num => {
            const button = document.createElement('button');
            button.className = 'num-btn';
            button.textContent = num;
            button.dataset.number = num;
            button.addEventListener('click', (e) => this.handleNumberClick(e), { passive: true });
            this.numContainer.appendChild(button);
        });
    }

    // 处理数字点击
    handleNumberClick(event) {
        const button = event.currentTarget;
        const num = parseInt(button.dataset.number);
        
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
        this.maxNumber = this.calculateNextLevelGrid();
        this.startGame();
        this.saveGameState(); // 保存新关卡状态
    }
}

// 导出游戏类
window.NumberSortGame = NumberSortGame; 