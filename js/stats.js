// 模拟数据
const mockData = {
    week: {
        timeData: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            values: [15, 25, 20, 30, 35, 40, 45]
        },
        radarData: {
            current: [85, 75, 90, 65, 80],
            previous: [80, 70, 85, 60, 75]
        },
        totalScore: 210,
        scoreChange: 15
    },
    month: {
        timeData: {
            labels: ['1', '5', '10', '15', '20', '25', '30'],
            values: [15, 25, 20, 30, 35, 40, 45]
        },
        radarData: {
            current: [85, 75, 90, 65, 80],
            previous: [75, 65, 80, 60, 70]
        },
        totalScore: 138,
        scoreChange: 23
    },
    year: {
        timeData: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            values: [120, 150, 180, 160, 200, 220, 240, 230, 250, 280, 300, 320]
        },
        radarData: {
            current: [85, 75, 90, 65, 80],
            previous: [70, 60, 75, 55, 65]
        },
        totalScore: 2450,
        scoreChange: 35
    },
    all: {
        timeData: {
            labels: ['2021', '2022', '2023', '2024'],
            values: [1500, 2800, 3200, 3800]
        },
        radarData: {
            current: [85, 75, 90, 65, 80],
            previous: [65, 55, 70, 50, 60]
        },
        totalScore: 11300,
        scoreChange: 45
    }
};

// 训练时长图表
const timeCtx = document.getElementById('timeChart').getContext('2d');
const timeChart = new Chart(timeCtx, {
    type: 'line',
    data: {
        labels: mockData.month.timeData.labels,
        datasets: [{
            label: '训练时长 (分钟)',
            data: mockData.month.timeData.values,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderColor: '#6366f1',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#6366f1',
            pointRadius: 3
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// 能力雷达图
const radarCtx = document.getElementById('radarChart').getContext('2d');
const radarChart = new Chart(radarCtx, {
    type: 'radar',
    data: {
        labels: ['记忆力', '专注力', '逻辑思维', '反应速度', '计算能力'],
        datasets: [{
            label: '当前能力',
            data: mockData.month.radarData.current,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: '#6366f1',
            borderWidth: 2,
            pointBackgroundColor: '#6366f1'
        }, {
            label: '上月能力',
            data: mockData.month.radarData.previous,
            backgroundColor: 'rgba(148, 163, 184, 0.2)',
            borderColor: '#94a3b8',
            borderWidth: 2,
            pointBackgroundColor: '#94a3b8'
        }]
    },
    options: {
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                },
                pointLabels: {
                    callback: function(label, index) {
                        const currentValue = mockData.month.radarData.current[index];
                        const previousValue = mockData.month.radarData.previous[index];
                        return `${label} (${currentValue}%)`;
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 10,
                    padding: 10,
                    font: {
                        size: 12
                    }
                }
            }
        }
    }
});

// 时间周期选择处理
const timeTabs = document.querySelectorAll('.time-tab');
const bigStatValue = document.querySelector('.big-stat-value');
const statChange = document.querySelector('.stat-change');

timeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 更新选中状态
        timeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 获取选中的时间周期
        const period = tab.textContent.trim();
        let data;
        switch(period) {
            case '周':
                data = mockData.week;
                break;
            case '月':
                data = mockData.month;
                break;
            case '年':
                data = mockData.year;
                break;
            case '全部':
                data = mockData.all;
                break;
        }

        // 更新总分数
        bigStatValue.textContent = data.totalScore;
        
        // 更新分数变化
        const changeText = statChange.querySelector('span');
        statChange.innerHTML = `<i class="fas fa-arrow-up mr-1"></i> ${data.scoreChange}% 相比上${period === '周' ? '周' : period === '月' ? '月' : period === '年' ? '年' : '期'}`;

        // 更新训练时长图表
        timeChart.data.labels = data.timeData.labels;
        timeChart.data.datasets[0].data = data.timeData.values;
        timeChart.update();

        // 更新雷达图
        radarChart.data.datasets[0].data = data.radarData.current;
        radarChart.data.datasets[1].data = data.radarData.previous;
        radarChart.update();
    });
});

// 添加模态框处理代码
const modal = document.getElementById('timeDetailModal');
const closeModal = document.getElementById('closeModal');
const timeSelectors = document.querySelectorAll('.time-selector');

// 打开模态框
timeSelectors.forEach(selector => {
    selector.addEventListener('click', (e) => {
        e.preventDefault(); // 防止默认行为
        modal.style.display = 'block'; // 显示模态框
        setTimeout(() => {
            modal.classList.add('show'); // 添加动画类
        }, 10);
        // 初始化详细图表
        initDetailChart();
    });
});

// 关闭模态框
closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // 等待动画完成
});

// 点击模态框外部关闭
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // 等待动画完成
    }
});

// 初始化详细图表
function initDetailChart() {
    const detailCtx = document.getElementById('detailTimeChart').getContext('2d');
    // 如果已经存在图表实例，先销毁它
    if (window.detailChart) {
        window.detailChart.destroy();
    }
    window.detailChart = new Chart(detailCtx, {
        type: 'bar',
        data: {
            labels: ['00:00-06:00', '06:00-12:00', '12:00-18:00', '18:00-24:00'],
            datasets: [{
                label: '训练时长分布',
                data: [5, 35, 25, 35],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.2)',
                    'rgba(99, 102, 241, 0.4)',
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(99, 102, 241, 0.8)'
                ],
                borderColor: '#6366f1',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
} 