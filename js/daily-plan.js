// 每日计划数据
const dailyPlanData = {
    tasks: [
        {
            id: 1,
            title: "晨间冥想",
            duration: "10分钟",
            completed: false,
            icon: "fas fa-sun"
        },
        {
            id: 2,
            title: "午间休息",
            duration: "15分钟",
            completed: false,
            icon: "fas fa-coffee"
        },
        {
            id: 3,
            title: "晚间放松",
            duration: "20分钟",
            completed: false,
            icon: "fas fa-moon"
        }
    ],
    totalTasks: 3,
    completedTasks: 0
};

// 每日计划管理类
class DailyPlanManager {
    constructor() {
        this.planContainer = document.querySelector('.challenge-card');
        this.init();
    }

    init() {
        this.renderPlan();
        this.bindEvents();
    }

    renderPlan() {
        if (!this.planContainer) return;

        const progress = (dailyPlanData.completedTasks / dailyPlanData.totalTasks) * 100;
        
        this.planContainer.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h3 class="text-lg font-bold">今日放松计划</h3>
                    <p class="text-sm opacity-80">完成今天的放松目标</p>
                </div>
                <div class="bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-spa text-white"></i>
                </div>
            </div>
            <div class="mt-4">
                <div class="flex justify-between text-sm">
                    <span>完成度: ${dailyPlanData.completedTasks}/${dailyPlanData.totalTasks}</span>
                    <span class="progress-number">${Math.round(progress)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="mt-4 space-y-3">
                ${dailyPlanData.tasks.map(task => `
                    <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                        <div class="flex items-center">
                            <div class="task-icon">
                                <i class="${task.icon}"></i>
                            </div>
                            <div class="ml-3">
                                <h4 class="text-sm font-medium">${task.title}</h4>
                                <p class="text-xs opacity-70">${task.duration}</p>
                            </div>
                        </div>
                        <div class="task-checkbox">
                            <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    bindEvents() {
        if (!this.planContainer) return;

        this.planContainer.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const taskId = parseInt(taskItem.dataset.taskId);
            this.toggleTaskCompletion(taskId);
        });
    }

    toggleTaskCompletion(taskId) {
        const task = dailyPlanData.tasks.find(t => t.id === taskId);
        if (!task) return;

        // 保存当前进度值
        const currentProgress = (dailyPlanData.completedTasks / dailyPlanData.totalTasks) * 100;
        
        // 更新任务状态
        task.completed = !task.completed;
        dailyPlanData.completedTasks = dailyPlanData.tasks.filter(t => t.completed).length;
        
        // 计算新进度值
        const newProgress = (dailyPlanData.completedTasks / dailyPlanData.totalTasks) * 100;

        // 先更新UI，但不更新进度条
        this.updateUIWithoutProgress();
        
        // 然后平滑过渡进度条
        this.animateProgress(currentProgress, newProgress);
        
        this.showCompletionAnimation(taskId);
    }

    updateUIWithoutProgress() {
        if (!this.planContainer) return;

        const progress = (dailyPlanData.completedTasks / dailyPlanData.totalTasks) * 100;
        
        // 更新除进度条外的所有内容
        const header = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h3 class="text-lg font-bold">今日放松计划</h3>
                    <p class="text-sm opacity-80">完成今天的放松目标</p>
                </div>
                <div class="bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-spa text-white"></i>
                </div>
            </div>
        `;

        const progressInfo = `
            <div class="mt-4">
                <div class="flex justify-between text-sm">
                    <span>完成度: ${dailyPlanData.completedTasks}/${dailyPlanData.totalTasks}</span>
                    <span class="progress-number">${Math.round(progress)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;

        const tasks = `
            <div class="mt-4 space-y-3">
                ${dailyPlanData.tasks.map(task => `
                    <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                        <div class="flex items-center">
                            <div class="task-icon">
                                <i class="${task.icon}"></i>
                            </div>
                            <div class="ml-3">
                                <h4 class="text-sm font-medium">${task.title}</h4>
                                <p class="text-xs opacity-70">${task.duration}</p>
                            </div>
                        </div>
                        <div class="task-checkbox">
                            <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // 更新内容
        this.planContainer.innerHTML = header + progressInfo + tasks;
    }

    animateProgress(from, to) {
        const progressFill = this.planContainer.querySelector('.progress-fill');
        const progressNumber = this.planContainer.querySelector('.progress-number');
        if (!progressFill || !progressNumber) return;

        // 使用 GSAP 创建进度条动画
        gsap.to(progressFill, {
            width: `${to}%`,
            duration: 0.5,
            ease: "power1.out",
            onUpdate: () => {
                const currentWidth = progressFill.offsetWidth;
                const containerWidth = progressFill.parentElement.offsetWidth;
                const currentProgress = (currentWidth / containerWidth) * 100;
                progressNumber.textContent = `${Math.round(currentProgress)}%`;

                // 根据进度更新颜色
                if (Math.round(currentProgress) === 100) {
                    progressFill.classList.add('complete');
                } else {
                    progressFill.classList.remove('complete');
                }
            }
        });
    }

    triggerCompletionAnimation(progressFill) {
        // 使用 GSAP 创建完成动画
        gsap.timeline()
            .to(progressFill, {
                backgroundColor: "#4CD964",
                duration: 0.2
            });
    }

    showCompletionAnimation(taskId) {
        const taskItem = this.planContainer.querySelector(`[data-task-id="${taskId}"]`);
        if (!taskItem) return;

        taskItem.classList.add('animate-completion');
        setTimeout(() => {
            taskItem.classList.remove('animate-completion');
        }, 1000);
    }
}

// 页面加载完成后初始化每日计划
document.addEventListener('DOMContentLoaded', () => {
    new DailyPlanManager();
}); 