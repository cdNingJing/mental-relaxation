// 轮播图数据
const carouselData = [
    {
        id: 1,
        type: "冥想放松",
        title: "正念冥想",
        description: "让心灵平静下来",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        type: "音乐放松",
        title: "自然白噪音",
        description: "聆听大自然的声音",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        type: "运动放松",
        title: "瑜伽伸展",
        description: "舒缓身心的运动",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        type: "阅读放松",
        title: "心灵读物",
        description: "静心阅读时光",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    }
];

// 初始化轮播图
function initCarousel() {
    const carousel = document.querySelector('.featured-carousel');
    let currentIndex = 0;

    // 创建轮播图内容
    function createCarouselContent() {
        carousel.innerHTML = carouselData.map((item, index) => `
            <div class="featured-slide ${index === 0 ? 'active' : ''}" 
                 style="background-image: url('${item.image}')">
                <div class="featured-info">
                    <div class="text-sm text-blue-300 mb-1">${item.type}</div>
                    <h2 class="text-xl font-bold mb-2">${item.title}</h2>
                    <p class="text-sm text-gray-300">${item.description}</p>
                </div>
            </div>
        `).join('');

        // 添加指示器
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        indicators.innerHTML = carouselData.map((_, index) => `
            <span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
        `).join('');
        carousel.appendChild(indicators);
    }

    // 切换到下一张
    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselData.length;
        updateCarousel();
    }

    // 更新轮播图显示
    function updateCarousel() {
        const slides = carousel.querySelectorAll('.featured-slide');
        const indicators = carousel.querySelectorAll('.indicator');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // 初始化轮播图
    createCarouselContent();

    // 自动轮播
    setInterval(nextSlide, 5000);

    // 点击指示器切换
    carousel.addEventListener('click', (e) => {
        if (e.target.classList.contains('indicator')) {
            currentIndex = parseInt(e.target.dataset.index);
            updateCarousel();
        }
    });
}

// 页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', initCarousel); 