// 散文数据
const essayData = {
    title: "荷塘月色",
    author: "朱自清",
    source: "《背影》",
    content: "沿着荷塘，是一条{{input1}}的小煤屑路。这是一条幽僻的路；白天也少人走，夜晚更加寂寞。荷塘四面，长着许多树，{{input2}}的。路的一旁，是些杨柳，和一些不知道名字的树。没有月光的晚上，这路上阴森森的，有些怕人。今晚却很好，虽然月光也还是{{input3}}的。",
    answers: {
        input1: "曲折",
        input2: "蓊蓊郁郁",
        input3: "淡淡"
    }
};

// 初始化页面
function initEssayPage() {
    // 设置标题和作者信息
    document.querySelector('.essay-title').textContent = essayData.title;
    document.querySelector('.essay-author').textContent = essayData.author;
    document.querySelector('.essay-source').textContent = essayData.source;

    // 处理内容中的填空
    let content = essayData.content;
    content = content.replace(/{{input1}}/g, '<span class="input-word"><input type="text" maxlength="4"></span>');
    content = content.replace(/{{input2}}/g, '<span class="input-word"><input type="text" maxlength="4"></span>');
    content = content.replace(/{{input3}}/g, '<span class="input-word"><input type="text" maxlength="4"></span>');

    // 设置内容
    document.querySelector('.essay-body').innerHTML = `<p>${content}</p>`;

    // 添加输入框事件监听
    const inputs = document.querySelectorAll('.input-word input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            checkAnswer(this, index);
        });
    });

    // 添加提示图标点击事件
    const hintIcon = document.getElementById('hintIcon');
    const hintModal = document.getElementById('hintModal');
    const closeModal = document.getElementById('closeModal');
    const hintModalBody = document.getElementById('hintModalBody');

    // 设置原文内容（替换填空为答案）
    const originalContent = essayData.content
        .replace(/{{input1}}/g, essayData.answers.input1)
        .replace(/{{input2}}/g, essayData.answers.input2)
        .replace(/{{input3}}/g, essayData.answers.input3);
    
    hintModalBody.innerHTML = `<p>${originalContent}</p>`;

    // 显示弹出框
    hintIcon.addEventListener('click', () => {
        hintModal.classList.add('active');
    });

    // 关闭弹出框
    closeModal.addEventListener('click', () => {
        hintModal.classList.remove('active');
    });

    // 点击模态框外部关闭
    hintModal.addEventListener('click', (e) => {
        if (e.target === hintModal) {
            hintModal.classList.remove('active');
        }
    });
}

// 检查答案
function checkAnswer(input, index) {
    const answer = Object.values(essayData.answers)[index];
    if (input.value === answer) {
        input.classList.add('correct');
    } else {
        input.classList.remove('correct');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initEssayPage); 