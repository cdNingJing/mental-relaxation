document.addEventListener('DOMContentLoaded', () => {
    const moodCards = document.querySelectorAll('.mood-option-card');
    
    moodCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            console.log(`选择了${title}功能`);
            // 这里可以添加跳转到具体功能页面的逻辑
        });
    });
}); 