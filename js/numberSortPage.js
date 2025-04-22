document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-focus');
    const continueButton = document.getElementById('continue-focus');
    const retryButton = document.getElementById('retry-focus');
    const nextButton = document.getElementById('next-focus');
    const exitButton = document.querySelector('.exit-fullscreen');
    const helpButton = document.querySelector('.help-button');
    const helpModal = document.querySelector('.help-modal');
    const closeHelpButton = document.querySelector('.close-help');
    const gameContainer = document.querySelector('.game-container');
    const numContainer = document.getElementById('num-container');
    const resultModal = document.querySelector('.result-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const resultTime = document.querySelector('.result-time');
    const resultComment = document.querySelector('.result-comment');

    // 初始化数字排序游戏
    const numberSortGame = new NumberSortGame();

    // 显示帮助弹窗
    function showHelpModal() {
        helpModal.classList.add('active');
        modalOverlay.classList.add('active');
    }

    // 隐藏帮助弹窗
    function hideHelpModal() {
        helpModal.classList.remove('active');
        if (!resultModal.classList.contains('active')) {
            modalOverlay.classList.remove('active');
        }
    }

    // 进入全屏模式
    function enterFullscreen() {
        gameContainer.classList.add('active');
        document.documentElement.requestFullscreen().catch(() => {
            console.log('Fullscreen request failed');
        });
        numberSortGame.startGame(true);
    }

    // 继续游戏
    function continueGame() {
        gameContainer.classList.add('active');
        document.documentElement.requestFullscreen().catch(() => {
            console.log('Fullscreen request failed');
        });
        numberSortGame.continueGame();
    }

    // 退出全屏模式
    function exitFullscreen() {
        numberSortGame.hideResultModal();
        hideHelpModal();
        gameContainer.classList.remove('active');
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {
                console.log('Exit fullscreen failed');
            });
        }
    }

    // 事件监听
    startButton.addEventListener('click', enterFullscreen);
    continueButton.addEventListener('click', continueGame);
    retryButton.addEventListener('click', () => {
        numberSortGame.hideResultModal();
        numberSortGame.startGame();
    });
    nextButton.addEventListener('click', () => {
        numberSortGame.hideResultModal();
        numberSortGame.nextLevel();
    });
    exitButton.addEventListener('click', exitFullscreen);
    helpButton.addEventListener('click', showHelpModal);
    closeHelpButton.addEventListener('click', hideHelpModal);

    // 监听屏幕方向变化
    window.addEventListener('orientationchange', () => {
        if (gameContainer.classList.contains('active')) {
            setTimeout(() => {
                numberSortGame.updateGridLayout();
                numberSortGame.renderNumbers();
            }, 100);
        }
    });

    // 监听 ESC 键退出全屏
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && gameContainer.classList.contains('active')) {
            exitFullscreen();
        }
    });
}); 