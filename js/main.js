// 功能区视图管理
class FunctionGridView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (this.container) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.container.addEventListener("click", (e) => {
            const categoryItem = e.target.closest(".category-item");
            if (!categoryItem) return;

            const categoryName = categoryItem.querySelector("span").textContent;
            this.handleCategoryClick(categoryName);
        });
    }

    handleCategoryClick(categoryName) {
        // 根据类别名称处理点击事件
        console.log(`Category clicked: ${categoryName}`);
        // 这里可以添加导航到对应页面的逻辑
    }
}

// 搜索功能
class SearchHandler {
    constructor() {
        this.searchInput = document.getElementById("searchInput");
        this.functionGrid = document.getElementById("functionGrid");
        this.init();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener("input", this.handleSearch.bind(this));
        }
    }

    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        const categoryItems = this.functionGrid.querySelectorAll(".category-item");

        categoryItems.forEach(item => {
            const categoryName = item.querySelector("span").textContent.toLowerCase();
            const isMatch = categoryName.includes(searchTerm);
            item.classList.toggle("hidden", !isMatch);
        });
    }
}

// 添加抖动动画的关键帧
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
}`;
document.head.appendChild(style);

// 初始化应用
document.addEventListener("DOMContentLoaded", () => {
    // 初始化功能区
    new FunctionGridView("functionGrid");
    // 初始化搜索功能
    new SearchHandler();
}); 