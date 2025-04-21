// 功能区视图管理
class FunctionGridView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        this.renderFunctions();
        this.bindEvents();
    }

    renderFunctions() {
        const html = functionData.map(item => this.createFunctionItemHTML(item)).join("");
        this.container.innerHTML = html;
    }

    createFunctionItemHTML(item) {
        const inactiveClass = !item.isActive ? 'inactive' : '';
        
        return `
            <div class="function-item ${inactiveClass}" id="${item.id}">
                <div class="function-icon" style="background: linear-gradient(135deg, ${item.gradient[0]} 0%, ${item.gradient[1]} 100%)">
                    <img src="${item.icon}" alt="${item.title}">
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
    }

    bindEvents() {
        this.container.addEventListener("click", (e) => {
            const functionItem = e.target.closest(".function-item");
            if (!functionItem) return;

            if (functionItem.classList.contains('inactive')) {
                // 如果功能未激活，显示提示信息
                this.showInactiveTip(functionItem);
                return;
            }

            this.handleFunctionClick(functionItem.id);
        });
    }

    showInactiveTip(element) {
        // 可以在这里添加更多的提示效果
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    handleFunctionClick(functionId) {
        const functionItem = functionData.find(item => item.id === functionId);
        if (functionItem && functionItem.isActive && functionItem.route) {
            window.location.href = functionItem.route;
        }
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
        const functionItems = this.functionGrid.querySelectorAll(".function-item");

        functionItems.forEach(item => {
            const title = item.querySelector("h3").textContent.toLowerCase();
            const description = item.querySelector("p").textContent.toLowerCase();
            const isMatch = title.includes(searchTerm) || description.includes(searchTerm);
            
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