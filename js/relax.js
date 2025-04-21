document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const timeDisplay = document.querySelector('.time');
    const breathCircle = document.querySelector('.breath-circle');
    const breathText = document.querySelector('.breath-text');
    const breathCount = document.querySelector('.breath-count');
    const breathGroup = document.querySelector('.breath-group');
    const startBtn = document.querySelector('.start-btn');
    const startTip = document.querySelector('.start-tip');
    const progressBar = document.querySelector('.progress-bar');
    const infoBtn = document.getElementById('infoBtn');
    const modal = document.getElementById('modeInfoModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modeList = document.querySelector('.mode-list');
    const controlSection = document.querySelector('.control-section');
    const pauseBtn = document.querySelector('.pause-btn');
    const stopBtn = document.querySelector('.stop-btn');
    const summaryModal = document.getElementById('summaryModal');
    const summaryCloseBtn = document.getElementById('summaryCloseBtn');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryGroups = document.getElementById('summaryGroups');
    const summaryBreaths = document.getElementById('summaryBreaths');
    const summaryTip = document.getElementById('summaryTip');

    // 检查必要的DOM元素是否存在
    if (!progressBar) {
        console.error('Progress bar element not found');
    }

    // 动画相关变量
    let animationFrame;
    let startTime;
    let currentScale = 0.8;
    let targetScale = 0.8;
    let isAnimating = false;
    let currentDuration;

    // 呼吸模式数据
    const breathingModes = [
        {
            id: '4-4-4-4',
            name: '方块呼吸法',
            time: '4-4-4-4',
            desc: '平静心绪的经典技巧',
            config: {
                inhale: 4,
                holdIn: 4,
                exhale: 4,
                holdOut: 4
            }
        },
        {
            id: '4-7-8',
            name: '放松呼吸法',
            time: '4-7-8',
            desc: '快速放松的天然镇静剂',
            config: {
                inhale: 4,
                holdIn: 7,
                exhale: 8,
                holdOut: 0
            }
        },
        {
            id: '5-5-5',
            name: '平衡呼吸法',
            time: '5-5-5',
            desc: '调节自律神经的平衡术',
            config: {
                inhale: 5,
                holdIn: 5,
                exhale: 5,
                holdOut: 0
            }
        }
    ];

    // 状态变量
    let isBreathing = false;
    let isPaused = false;
    let currentGroup = 1;
    let totalGroups = 5; // 默认5组
    let currentMode = breathingModes[0].id;
    let remainingTime = 300;
    let breathingInterval;
    let focusModeTimeout;
    let timerInterval;
    let currentPhaseTime;
    let currentPhase = 0;

    // 训练数据
    let trainingData = {
        startTime: null,
        duration: 0,
        completedGroups: 0,
        totalBreaths: 0
    };

    // 动画函数
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        
        if (isAnimating) {
            const progressRatio = Math.min(progress / (currentDuration * 1000), 1);
            
            // 使用线性插值实现匀速运动
            const newScale = currentScale + (targetScale - currentScale) * progressRatio;
            
            breathCircle.style.transform = `scale(${newScale})`;
            
            if (progressRatio < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                isAnimating = false;
                startTime = null;
            }
        }
    }

    // 缓动函数
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // 开始动画
    function startAnimation(newTargetScale, duration) {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        currentScale = parseFloat(breathCircle.style.transform.replace('scale(', '').replace(')', '')) || 0.8;
        targetScale = newTargetScale;
        currentDuration = duration;
        isAnimating = true;
        startTime = null;
        animationFrame = requestAnimationFrame(animate);
    }

    // 暂停动画
    function pauseAnimation() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        isAnimating = false;
    }

    // 渲染呼吸模式列表
    function renderModeList() {
        modeList.innerHTML = breathingModes.map(mode => `
            <div class="mode-item-select" data-mode="${mode.id}">
                <div class="mode-item-main">
                    <div class="mode-name">${mode.name}</div>
                    <div class="mode-time">${mode.time}</div>
                </div>
                <div class="mode-desc">${mode.desc}</div>
            </div>
        `).join('');

        // 绑定模式选择事件
        const modeItems = document.querySelectorAll('.mode-item-select');
        modeItems.forEach(item => {
            item.addEventListener('click', () => {
                if (!isBreathing) {
                    const mode = item.dataset.mode;
                    updateSelectedMode(mode);
                    closeModal();
                }
            });
        });
    }

    // 更新选中的呼吸模式
    function updateSelectedMode(modeId) {
        currentMode = modeId;
        const modeItems = document.querySelectorAll('.mode-item-select');
        modeItems.forEach(item => {
            if (item.dataset.mode === modeId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 获取当前模式的配置
    function getCurrentModeConfig() {
        return breathingModes.find(mode => mode.id === currentMode).config;
    }

    // 初始化
    renderModeList();
    updateSelectedMode(currentMode);

    // 弹出框控制
    if (infoBtn && modal && modalCloseBtn) {
        infoBtn.addEventListener('click', () => {
            modal.classList.add('show');
            if (isBreathing) {
                pauseAnimation();
            }
        });

        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    function closeModal() {
        modal.classList.remove('show');
        if (isBreathing) {
            pauseAnimation();
        }
    }

    // 呼吸引导
    function updatePhase() {
        const mode = getCurrentModeConfig();
        switch(currentPhase) {
            case 0: // 吸气
                breathText.textContent = '吸气';
                currentPhaseTime = mode.inhale;
                startAnimation(1.33, mode.inhale);
                break;
            case 1: // 屏息
                breathText.textContent = '屏息';
                currentPhaseTime = mode.holdIn;
                pauseAnimation();
                break;
            case 2: // 呼气
                breathText.textContent = '呼气';
                currentPhaseTime = mode.exhale;
                startAnimation(0.8, mode.exhale);
                break;
            case 3: // 屏息
                breathText.textContent = '屏息';
                currentPhaseTime = mode.holdOut;
                pauseAnimation();
                break;
        }
        breathCount.textContent = currentPhaseTime;
    }

    // 开始呼吸引导
    function startBreathing() {
        if (!progressBar) return;
        
        isBreathing = true;
        startBtn.style.display = 'none';
        startTip.style.display = 'none';
        controlSection.classList.add('show');
        
        // 记录开始时间
        trainingData.startTime = new Date();
        trainingData.duration = 0;
        trainingData.completedGroups = 0;
        trainingData.totalBreaths = 0;
        
        const mode = getCurrentModeConfig();
        currentPhase = 0;
        currentGroup = 1;
        updateGroupDisplay();
        
        // 开始计时器
        timerInterval = setInterval(() => {
            if (!isPaused) {
                remainingTime--;
                trainingData.duration++;
                updateTimeDisplay();
                if (progressBar) {
                    progressBar.style.setProperty('--progress', `${(remainingTime / 300) * 100}%`);
                }
                
                if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                    clearInterval(breathingInterval);
                    clearTimeout(focusModeTimeout);
                    exitFocusMode();
                    stopBreathing();
                }
            }
        }, 1000);

        updatePhase();
        breathingInterval = setInterval(updatePhaseTimer, 1000);

        // 3秒后进入专注模式
        focusModeTimeout = setTimeout(enterFocusMode, 3000);
    }

    // 暂停/继续呼吸
    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            pauseAnimation();
            clearInterval(breathingInterval);
            clearTimeout(focusModeTimeout);
            exitFocusMode();
        } else {
            updatePhase();
            breathingInterval = setInterval(updatePhaseTimer, 1000);
            focusModeTimeout = setTimeout(enterFocusMode, 3000);
        }
        pauseBtn.querySelector('img').src = isPaused ? '../assets/icons/play.svg' : '../assets/icons/pause.svg';
    }

    // 停止呼吸
    function stopBreathing() {
        if (!progressBar) return;
        
        isBreathing = false;
        isPaused = false;
        clearInterval(breathingInterval);
        clearInterval(timerInterval);
        clearTimeout(focusModeTimeout);
        pauseAnimation();
        breathCircle.style.transform = 'scale(0.8)';
        startBtn.style.display = 'flex';
        startTip.style.display = 'block';
        controlSection.classList.remove('show');
        remainingTime = 300;
        updateTimeDisplay();
        progressBar.style.setProperty('--progress', '0%');
        exitFocusMode();
        
        // 显示训练总结
        showTrainingSummary();
    }

    // 进入专注模式
    function enterFocusMode() {
        document.body.classList.add('focus-mode');
    }

    // 退出专注模式
    function exitFocusMode() {
        document.body.classList.remove('focus-mode');
    }

    // 更新时间显示
    function updateTimeDisplay() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // 更新组数显示
    function updateGroupDisplay() {
        breathGroup.textContent = `第 ${currentGroup} 组`;
    }

    // 显示训练总结
    function showTrainingSummary() {
        // 计算训练时长
        const minutes = Math.floor(trainingData.duration / 60);
        const seconds = trainingData.duration % 60;
        summaryDuration.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // 更新组数和呼吸次数
        summaryGroups.textContent = `${trainingData.completedGroups}组`;
        summaryBreaths.textContent = `${trainingData.totalBreaths}次`;
        
        // 根据训练时长给出建议
        if (trainingData.duration < 60) {
            summaryTip.textContent = '建议每天至少进行5分钟的训练，效果会更好。';
        } else if (trainingData.duration < 300) {
            summaryTip.textContent = '坚持训练可以帮助你更好地管理压力和情绪。';
        } else {
            summaryTip.textContent = '太棒了！继续保持这个训练强度，你会感受到明显的改善。';
        }
        
        // 显示弹窗
        summaryModal.classList.add('show');
    }

    // 关闭训练总结
    function closeSummaryModal() {
        summaryModal.classList.remove('show');
    }

    // 倒计时更新
    function updatePhaseTimer() {
        if (!isPaused) {
            if (currentPhaseTime > 1) {
                currentPhaseTime--;
                breathCount.textContent = currentPhaseTime;
            } else {
                currentPhase = (currentPhase + 1) % 4;
                if (currentPhase === 0) {
                    currentGroup++;
                    trainingData.completedGroups++;
                    trainingData.totalBreaths++;
                    if (currentGroup > totalGroups) {
                        stopBreathing();
                        return;
                    }
                    updateGroupDisplay();
                }
                updatePhase();
            }
        }
    }

    // 事件监听
    startBtn.addEventListener('click', () => {
        if (!isBreathing) {
            startBreathing();
        }
    });

    pauseBtn.addEventListener('click', togglePause);
    stopBtn.addEventListener('click', stopBreathing);

    // 监听用户交互以退出专注模式
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);

    function handleUserInteraction() {
        if (isBreathing) {
            clearTimeout(focusModeTimeout);
            exitFocusMode();
            focusModeTimeout = setTimeout(enterFocusMode, 3000);
        }
    }

    // 事件监听
    summaryCloseBtn.addEventListener('click', closeSummaryModal);
    summaryModal.addEventListener('click', (e) => {
        if (e.target === summaryModal) {
            closeSummaryModal();
        }
    });

    // 初始化
    updateTimeDisplay();
}); 