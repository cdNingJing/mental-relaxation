document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已经显示过入场动画
    const hasShownSplash = localStorage.getItem('hasShownSplash');
    
    if (!hasShownSplash) {
        // 首次进入，显示入场动画
        const splashScreen = document.querySelector('.splash-screen');
        splashScreen.style.display = 'flex';
        
        // 动画结束后保存状态
        setTimeout(() => {
            localStorage.setItem('hasShownSplash', 'true');
        }, 3500); // 动画总时长 3.5 秒
    } else {
        // 已经显示过动画，直接隐藏启动页并显示卡片
        const splashScreen = document.querySelector('.splash-screen');
        splashScreen.style.display = 'none';
        const appContainer = document.querySelector('.app-container');
        appContainer.style.opacity = '1';
        appContainer.style.transform = 'translateY(0)';
        
        // 立即显示所有卡片
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.animation = 'none';
        });
    }

    // 获取所有卡片元素
    const cards = document.querySelectorAll('.card');
    
    // 为每张卡片添加交互效果
    cards.forEach(card => {
        // 鼠标移动效果
        card.addEventListener('mousemove', handleMouseMove);
        // 鼠标离开效果
        card.addEventListener('mouseleave', handleMouseLeave);
        // 点击效果
        card.addEventListener('click', handleCardClick);
    });

    // 处理鼠标移动效果
    function handleMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 计算鼠标位置相对于卡片中心的偏移
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        // 应用3D转换效果
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    // 处理鼠标离开效果
    function handleMouseLeave(e) {
        const card = e.currentTarget;
        card.style.transform = '';
    }

    // 处理卡片点击
    function handleCardClick(e) {
        const card = e.currentTarget;
        const cardId = card.id;
        
        // 添加点击动画
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
            
            // 根据卡片ID跳转到对应页面
            switch(cardId) {
                case 'relaxCard':
                    window.location.href = 'pages/RelaxPage.html';
                    break;
                case 'focusCard':
                    window.location.href = 'pages/FocusPage.html';
                    break;
                case 'moodCard':
                    window.location.href = 'pages/moodReliefPage.html';
                    break;
            }
        }, 150);
    }

    // 开始恢复功能
    function startRecovery(type) {
        const typeMap = {
            'relax': {
                name: '放松',
                color: '#4CD964',
                message: '开始放松练习，让身心回归平静...'
            },
            'focus': {
                name: '专注力',
                color: '#5B9EE2',
                message: '开始专注力训练，提升注意力...'
            },
            'mood': {
                name: '情绪',
                color: '#FF9500',
                message: '开始情绪调节，找回内心平静...'
            }
        };

        const recovery = typeMap[type];
        console.log(`开始${recovery.name}恢复模式`);
        alert(recovery.message);
    }

    // 添加波浪动画效果
    function initWaveEffects() {
        cards.forEach(card => {
            const wave = card.querySelector('.card-wave');
            if (wave) {
                wave.style.opacity = '0.3';
            }
        });
    }

    // 初始化波浪效果
    initWaveEffects();
}); 