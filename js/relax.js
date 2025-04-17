document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const container = document.querySelector('.relax-container');
    const breathingCircle = document.querySelector('.breathing-circle');
    const breathingText = document.querySelector('.breathing-text');
    const cycleCount = document.getElementById('cycleCount');
    const continueBtn = document.getElementById('continueBtn');
    const stepItems = document.querySelectorAll('.step-item');
    const stepContents = document.querySelectorAll('.step-content');
    const meditationText = document.getElementById('meditationText');

    // 音乐播放器元素
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.querySelector('.progress');
    const musicTitle = document.querySelector('.music-title');
    const musicTime = document.querySelector('.music-time');

    // 添加呼吸次数计数器的显示/隐藏控制
    const breathingCount = document.querySelector('.breathing-count');

    // 状态变量
    let currentStep = 1;
    let breathingCycles = 0;
    let isPlaying = false;
    let currentTrack = 0;
    let currentBreathingState = 0;
    let breathingInterval;
    let animationStartTime = null;
    let animationFrame = null;
    let isFocusMode = false;
    let focusModeTimeout = null;
    let isMeditationComplete = false;

    // 音乐列表
    const tracks = [
        { title: '轻柔冥想', duration: '05:00' },
        { title: '自然之声', duration: '04:30' },
        { title: '深度放松', duration: '06:00' }
    ];

    // 呼吸引导文本
    const breathingStates = [
        { 
            text: '吸气', 
            duration: 4000, 
            startScale: 1, 
            endScale: 2
        },
        { 
            text: '屏息', 
            duration: 4000, 
            startScale: 2, 
            endScale: 2
        },
        { 
            text: '呼气', 
            duration: 4000, 
            startScale: 2, 
            endScale: 1
        },
        { 
            text: '屏息', 
            duration: 4000, 
            startScale: 1, 
            endScale: 1
        }
    ];

    // 冥想引导文本
    const meditationGuides = [
        "准备：保持呼吸的节奏，轻轻闭上眼睛。感受身体与地面接触。放松肩颈，下颌微松。",
        "继续跟随呼吸的节奏，不刻意控制，只观察空气进出鼻孔。",
        "你可能感到呼吸略微清凉进入，温暖离开。感受胸腹随之轻轻起伏。",
        "当思绪出现，温柔地对它们说：'我看见你了'，然后回到呼吸上。",
        "每一次将注意拉回呼吸，都是一次温柔的胜利。继续观察，放松。",
        "保持呼吸的节奏，感受此刻的身体状态是否更松弛。",
        "继续保持呼吸，微动手指脚趾，慢慢睁眼，带着这份宁静回到现实。"
    ];

    let meditationIndex = 0;

    function showAndSpeak(text) {
        if (!meditationText) return;
        
        meditationText.classList.remove('show');
        setTimeout(() => {
            meditationText.textContent = text;
            meditationText.classList.add('show');
            
            // 播放语音
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'zh-CN';
            speechSynthesis.speak(utter);

            // 最后一条时更新状态
            if (meditationIndex === meditationGuides.length - 1) {
                isMeditationComplete = true;
                if (continueBtn) {
                    continueBtn.textContent = '完成练习';
                }
            }
        }, 500);
    }

    function startCountdown(callback) {
        if (!breathingCircle || !breathingText) return;

        const numbers = [3, 2, 1];
        let currentIndex = 0;

        // 创建倒计时文本元素
        const countdownText = document.createElement('div');
        countdownText.className = 'countdown-text';
        breathingCircle.appendChild(countdownText);

        // 显示准备文案
        breathingText.style.display = 'block';
        breathingText.textContent = '';
        breathingText.style.opacity = '1';

        function showNumber() {
            if (currentIndex < numbers.length) {
                countdownText.textContent = numbers[currentIndex];
                countdownText.style.animation = 'none';
                void countdownText.offsetWidth;
                countdownText.style.animation = 'countdownAnimation 1s ease-out';
                
                currentIndex++;
                setTimeout(showNumber, 1000);
            } else {
                setTimeout(() => {
                    countdownText.remove();
                    callback();
                }, 1000);
            }
        }

        showNumber();
    }

    function animateBreathing(timestamp) {
        if (!animationStartTime) animationStartTime = timestamp;
        const elapsed = timestamp - animationStartTime;
        const state = breathingStates[currentBreathingState];
        const progress = Math.min(elapsed / state.duration, 1);

        // 计算当前状态
        const currentScale = state.startScale + (state.endScale - state.startScale) * progress;

        // 更新动画状态
        if (breathingCircle) {
            breathingCircle.style.transform = `scale(${currentScale})`;
        }

        if (progress < 1) {
            animationFrame = requestAnimationFrame(animateBreathing);
        } else {
            // 动画完成，进入下一个状态
            currentBreathingState = (currentBreathingState + 1) % breathingStates.length;
            if (currentBreathingState === 0) {
                breathingCycles++;
                if (cycleCount) {
                    cycleCount.textContent = breathingCycles + 1;
                }
                
                // 检查是否完成两组
                if (breathingCycles >= 2) {
                    if (continueBtn) {
                        continueBtn.style.display = 'flex';
                    }
                }
            }
            startNextBreathingState();
        }
    }

    function startNextBreathingState() {
        const state = breathingStates[currentBreathingState];
        if (breathingText) {
            breathingText.style.opacity = '0';
            setTimeout(() => {
                breathingText.textContent = state.text;
                breathingText.style.opacity = '1';
            }, 200);
        }
        animationStartTime = null;
        animationFrame = requestAnimationFrame(animateBreathing);
    }

    function startBreathing() {
        startNextBreathingState();
    }

    // 更新步骤显示
    function updateSteps(step) {
        stepItems.forEach((item, index) => {
            if (index + 1 < step) {
                item.classList.add('completed');
                item.classList.remove('active');
            } else if (index + 1 === step) {
                item.classList.add('active');
                item.classList.remove('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });

        stepContents.forEach((content, index) => {
            content.classList.toggle('active', index + 1 === step);
        });
    }

    // 重置专注模式计时器
    function resetFocusModeTimer() {
        if (!container) return;
        
        clearTimeout(focusModeTimeout);
        if (!isFocusMode) {
            focusModeTimeout = setTimeout(() => {
                enterFocusMode();
            }, 3000);
        }
    }

    // 进入专注模式
    function enterFocusMode() {
        if (!container) return;
        isFocusMode = true;
        container.classList.add('focus-mode');
    }

    // 退出专注模式
    function exitFocusMode() {
        if (!container) return;
        isFocusMode = false;
        container.classList.remove('focus-mode');
        resetFocusModeTimer();
        
        if (breathingCycles >= 2) {
            continueBtn.style.display = 'flex';
        }
    }

    // 监听用户交互
    if (container) {
        document.addEventListener('mousemove', () => {
            if (isFocusMode) {
                exitFocusMode();
            } else {
                resetFocusModeTimer();
            }
        });

        document.addEventListener('touchstart', () => {
            if (isFocusMode) {
                exitFocusMode();
            } else {
                resetFocusModeTimer();
            }
        });

        document.addEventListener('keydown', () => {
            if (isFocusMode) {
                exitFocusMode();
            } else {
                resetFocusModeTimer();
            }
        });
    }

    // 继续按钮点击处理
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (currentStep === 1) {
                currentStep++;
                updateSteps(currentStep);
                // 停止呼吸动画
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
                startMeditationGuide();
                // 更新按钮文本
                continueBtn.textContent = '完成练习';
            } else if (currentStep === 2 && isMeditationComplete) {
                // 完成所有练习
                window.location.href = 'index.html';
            }
            resetFocusModeTimer();
        });
    }

    // 修改音乐播放器控制，添加重置计时器
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.innerHTML = isPlaying 
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 4l14 8-14 8V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            
            if (isPlaying) {
                startProgressAnimation();
            } else {
                stopProgressAnimation();
            }
            resetFocusModeTimer();
        });
    }

    // 冥想引导
    function startMeditationGuide() {
        const MEDITATION_STEP_DURATION = 20; // 每个冥想步骤持续20秒
        let meditationIndex = 0;
        let countdownInterval;

        function showMeditationStep(index) {
            if (index >= meditationGuides.length) {
                // 所有步骤完成
                clearInterval(countdownInterval);
                continueBtn.style.display = 'flex';
                continueBtn.textContent = '完成练习';
                return;
            }

            let secondsLeft = MEDITATION_STEP_DURATION;
            let countdownElement = document.querySelector('.meditation-countdown');

            // 更新文本和倒计时
            meditationText.style.opacity = '0';
            setTimeout(() => {
                meditationText.textContent = meditationGuides[index];
                meditationText.style.opacity = '1';
                
                // 播放语音
                const utter = new SpeechSynthesisUtterance(meditationGuides[index]);
                utter.lang = 'zh-CN';
                speechSynthesis.speak(utter);

                // 开始倒计时
                clearInterval(countdownInterval);
                countdownInterval = setInterval(() => {
                    secondsLeft--;
                    if (countdownElement) {
                        countdownElement.textContent = `${secondsLeft}秒`;
                    }
                    
                    if (secondsLeft <= 0) {
                        clearInterval(countdownInterval);
                        showMeditationStep(index + 1);
                    }
                }, 1000);
            }, 500);
        }

        // 开始显示第一步
        setTimeout(() => {
            showMeditationStep(0);
        }, 300);
    }

    // 进度条动画
    let progressAnimation;

    function startProgressAnimation() {
        let progress = 0;
        progressBar.style.width = '0%';
        
        progressAnimation = setInterval(() => {
            progress += 0.1;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                nextBtn.click();
            }
        }, 300);
    }

    function stopProgressAnimation() {
        clearInterval(progressAnimation);
    }

    function showStep(stepNumber) {
        const steps = document.querySelectorAll(".step-content");
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add("active");
            }
        });
    }

    function startMeditation() {
        showStep(2);
        showAndSpeak(meditationGuides[0]);
    }

    function startBreathingExercise() {
        showStep(1);
        startCountdown(() => {
            startBreathing();
        });
    }

    // 初始化
    function init() {
        if (breathingCircle && breathingText && cycleCount) {
            updateSteps(currentStep);
            startCountdown(() => {
                startBreathing();
            });
            resetFocusModeTimer();
        }
    }

    // 更新CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .breathing-text {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // 双击呼吸次数计数器切换显示/隐藏状态
    breathingCount.addEventListener('dblclick', () => {
        breathingCount.classList.toggle('hidden');
    });

    init();
}); 