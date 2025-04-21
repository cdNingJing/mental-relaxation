// 笑话数据
const essayData = [
    {
        id: 1,
        title: "动物叫声",
        author: "网络",
        source: "冷笑话集",
        content: "猫会喵喵叫。狗会汪汪叫。鸭会嘎嘎叫。鸡会什么？\n鸡会留给有准备的人。",
        type: "笑话",
        answers: {
            input1: "鸡会留给有准备的人"
        }
    },
    {
        id: 2,
        title: "晏子使楚",
        author: "网络",
        source: "冷笑话集",
        content: "晏子使楚，晏子被人羞辱后离开,\n有认识晏子的大臣一听，\n急忙去追，说\n晏子！晏子！没有你我可怎么活啊!",
        type: "笑话",
        answers: {
            input1: "晏子！晏子！没有你我可怎么活啊!"
        }
    },
    {
        id: 3,
        title: "虾和蚌",
        author: "网络",
        source: "冷笑话集",
        content: "虾和蚌同时考了一百分，\n老师问虾：'你抄谁的？'\n虾说：'我抄蚌的。'\n老师说：'你棒什么棒！'",
        type: "笑话",
        answers: {
            input1: "你棒什么棒！"
        }
    },
    {
        id: 4,
        title: "煎蛋的爱情",
        author: "网络",
        source: "冷笑话集",
        content: "煎蛋爱上了荷包蛋，\n它拿着吉他,\n走到荷包蛋楼下唱:\n'这是一首煎蛋的小情歌～'",
        type: "笑话",
        answers: {
            input1: "这是一首煎蛋的小情歌～"
        }
    },
    {
        id: 5,
        title: "法海的梦想",
        author: "网络",
        source: "冷笑话集",
        content: "法海永远都当不了rapper。因为他不会饶蛇。",
        type: "笑话",
        answers: {
            input1: "因为他不会饶蛇。"
        }
    },
    {
        id: 6,
        title: "追到会",
        author: "网络",
        source: "冷笑话集",
        content: "你来追我吧，\n要是追的到我。我就给你开个追到会。",
        type: "笑话",
        answers: {
            input1: "我就给你开个追到会。"
        }
    },
    {
        id: 7,
        title: "南瓜杏仁露",
        author: "网络",
        source: "冷笑话集",
        content: "你好，一杯南瓜杏仁露，\n不要瓜，不要杏，不要露，要南仁。",
        type: "笑话",
        answers: {
            input1: "不要瓜，不要杏，不要露，要南仁。"
        }
    },
    {
        id: 8,
        title: "反射狐",
        author: "网络",
        source: "冷笑话集",
        content: "一个猎人用猎枪打中了一只狐狸，\n结果死的却是猎人，\n原来这是反射狐。",
        type: "笑话",
        answers: {
            input1: "原来这是反射狐。"
        }
    },
    {
        id: 9,
        title: "敏感肌",
        author: "网络",
        source: "冷笑话集",
        content: "给了男朋友一巴掌，\n看着他脸上的巴掌印，\n我不禁感叹，\n他还是个敏感肌。",
        type: "笑话",
        answers: {
            input1: "他还是个敏感肌。"
        }
    },
    {
        id: 10,
        title: "阿姨的汗",
        author: "网络",
        source: "冷笑话集",
        content: "为什么阿姨从不流汗，\n因为阿姨怕留下姨汗。",
        type: "笑话",
        answers: {
            input1: "因为阿姨怕留下姨汗。"
        }
    },
    {
        id: 11,
        title: "钢琴里的妖怪",
        author: "网络",
        source: "冷笑话集",
        content: "你知道恐怖片里诡异的房子中，\n为什么总会有钢琴吗？\n因为...钢琴住了几个妖。",
        type: "笑话",
        answers: {
            input1: "因为...钢琴住了几个妖。"
        }
    },
    {
        id: 12,
        title: "一羊千洗",
        author: "网络",
        source: "冷笑话集",
        content: "一只羊洗一千次澡才能变帅，\n因为一羊千洗。",
        type: "笑话",
        answers: {
            input1: "因为一羊千洗。"
        }
    },
    {
        id: 13,
        title: "成语新解",
        author: "网络",
        source: "冷笑话集",
        content: "贪生 pass， star皆空，\nonce 不辞，hold载物，\nWord妈鸭。",
        type: "笑话",
        answers: {
            input1: "Word妈鸭。"
        }
    },
    {
        id: 14,
        title: "惊讶的工作",
        author: "网络",
        source: "冷笑话集",
        content: "我有一份让人惊讶的工作。\n什么工作？\n挖藕。",
        type: "笑话",
        answers: {
            input1: "挖藕。"
        }
    },
    {
        id: 15,
        title: "泉下有知",
        author: "网络",
        source: "冷笑话集",
        content: "知了掉进泉水淹SI，\n也算泉下有知了。",
        type: "笑话",
        answers: {
            input1: "也算泉下有知了。"
        }
    },
    {
        id: 16,
        title: "迪迦在东北",
        author: "网络",
        source: "冷笑话集",
        content: "迪迦是哪里的，东北的，\n因为我迪迦在东北。",
        type: "笑话",
        answers: {
            input1: "因为我迪迦在东北。"
        }
    },
    {
        id: 17,
        title: "星星的大小",
        author: "网络",
        source: "冷笑话集",
        content: "比天上的星星小一点的是什么？\n是鸿星。因为星八克，鸿星二克。",
        type: "笑话",
        answers: {
            input1: "因为星八克，鸿星二克。"
        }
    },
    {
        id: 18,
        title: "蚂蚁的对话",
        author: "网络",
        source: "冷笑话集",
        content: "一只迷路的蚂蚁问另一只蚂蚁：\n你都如何回蚁窝\n被问的蚂蚁：\n带着笑或是很沉默？",
        type: "笑话",
        answers: {
            input1: "带着笑或是很沉默？"
        }
    }
];

let currentLevel = -1;
let correctAnswers = 0;

// 保存进度到本地存储
function saveProgress() {
    localStorage.setItem('jokeProgress', JSON.stringify({
        currentLevel: currentLevel,
        correctAnswers: correctAnswers
    }));
}

// 从本地存储加载进度
function loadProgress() {
    const savedProgress = localStorage.getItem('jokeProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        currentLevel = progress.currentLevel;
        correctAnswers = progress.correctAnswers;
    }
}

// 处理填空内容
function processContentWithInputs(content, answers) {
    let processedContent = content;
    if (answers) {
        // 将答案对应的词替换为填空
        Object.entries(answers).forEach(([key, value]) => {
            processedContent = processedContent.replace(value, `{{${key}}}`);
        });
    }
    return processedContent;
}

// 格式化内容
function formatContent(content, answers = null) {
    // 在句号后添加换行
    content = content.replace(/。/g, '。\n');
    
    // 如果有答案，为答案添加下划虚线
    if (answers) {
        Object.values(answers).forEach(answer => {
            const regex = new RegExp(answer, 'g');
            content = content.replace(regex, `<span class="answer-underline">${answer}</span>`);
        });
    }
    
    // 将换行符转换为段落
    const paragraphs = content.split('\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${p}</p>`).join('');
}

// 获取下一关
function getNextLevel() {
    currentLevel = (currentLevel + 1) % essayData.length;
    saveProgress(); // 保存进度
    return essayData[currentLevel];
}

// 检查是否通关
function checkLevelComplete() {
    correctAnswers++;
    if (correctAnswers === 1) {
        correctAnswers = 0;
        setTimeout(() => {
            alert('恭喜通关！进入下一关！');
            loadNextLevel();
        }, 500);
    }
    saveProgress(); // 保存进度
}

// 加载下一关
function loadNextLevel() {
    const nextEssay = getNextLevel();
    initEssayPage(nextEssay);
}

// 检查答案
function checkAnswer(input, index, currentEssay) {
    if (currentEssay.answers) {
        const answer = Object.values(currentEssay.answers)[0];
        if (input.value === answer) {
            input.classList.add('correct');
            input.disabled = true;
            checkLevelComplete();
        } else {
            input.classList.remove('correct');
        }
    }
}

// 初始化页面
function initEssayPage(essay = null) {
    try {
        // 加载保存的进度
        loadProgress();
        
        // 获取当前文章
        const currentEssay = essay || getNextLevel();
        
        if (!currentEssay || !currentEssay.content) {
            console.error('文章数据无效');
            return;
        }

        // 设置标题和作者信息
        document.querySelector('.essay-title').textContent = currentEssay.title || '';
        document.querySelector('.essay-author').textContent = currentEssay.author || '';
        document.querySelector('.essay-source').textContent = currentEssay.source || '';

        // 处理内容，添加填空
        let content = processContentWithInputs(currentEssay.content, currentEssay.answers);
        content = content.replace(/{{input1}}/g, '<span class="input-word"><input type="text" maxlength="10"></span>');

        // 设置内容
        document.querySelector('.essay-body').innerHTML = formatContent(content);

        // 添加输入框事件监听
        const inputs = document.querySelectorAll('.input-word input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                checkAnswer(this, index, currentEssay);
            });
        });

        // 添加提示图标点击事件
        const hintIcon = document.getElementById('hintIcon');
        const hintModal = document.getElementById('hintModal');
        const closeModal = document.getElementById('closeModal');
        const hintModalBody = document.getElementById('hintModalBody');

        // 设置原文内容（使用相同的格式化函数，并传入答案）
        hintModalBody.innerHTML = formatContent(currentEssay.content, currentEssay.answers);

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
    } catch (error) {
        console.error('初始化页面时发生错误:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    try {
        initEssayPage();
    } catch (error) {
        console.error('页面加载时发生错误:', error);
    }
}); 