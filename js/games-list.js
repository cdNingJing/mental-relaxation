// 已完成游戏数据
const finishedGames = [
  {
    title: '数字排序',
    badge: '热门',
    badgeClass: 'popular-badge',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
    alt: '数字排序',
    rating: 4.8,
    type: '提高专注力',
    category: '专注力',
    link: 'pages/FocusPage.html',
  },
  {
    title: '呼吸引导',
    badge: '新上线',
    badgeClass: 'new-badge',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=300&q=80',
    alt: '呼吸引导',
    rating: 4.7,
    type: '冥想放松训练',
    category: '专注力',
    link: 'pages/RelaxPage.html',
  },
  {
    title: '补全填空',
    badge: '',
    badgeClass: '',
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=300&q=80',
    alt: '补全填空',
    rating: 4.6,
    type: '文章补全训练',
    category: '语言',
    link: 'pages/essayReadingPage.html',
  },
  {
    title: '直觉判断',
    badge: '',
    badgeClass: '',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
    alt: '直觉判断',
    rating: 4.5,
    type: '快速认知训练',
    category: '逻辑',
    link: 'pages/cognitivePage.html',
  },
];

// 开发中游戏数据
const developingGames = [
  {
    title: '视觉追踪',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80',
    alt: '视觉追踪',
    type: '目光跟随训练',
    category: '专注力',
    link: '/visual.html',
  },
  {
    title: '数独挑战',
    img: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=300&q=80',
    alt: '数独挑战',
    type: '经典数字游戏',
    category: '逻辑',
    link: '/number.html',
  },
  {
    title: '记忆翻牌',
    img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=300&q=80',
    alt: '记忆翻牌',
    type: '掌握记忆力',
    category: '记忆力',
    link: '/memory.html',
  },
  {
    title: '连连看',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
    alt: '连连看',
    type: '趣味连连看',
    category: '多任务',
    link: '/focus.html',
  },
  {
    title: '直觉训练',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80',
    alt: '直觉训练',
    type: '增强直觉能力',
    category: '逻辑',
    link: '/intuition.html',
  },
  {
    title: '拼图游戏',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80',
    alt: '拼图游戏',
    type: '图片智力拼接',
    category: '多任务',
    link: '/puzzle.html',
  },
  {
    title: '反应测试',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=300&q=80',
    alt: '反应测试',
    type: '测试反应速度',
    category: '反应力',
    link: '/reaction.html',
  },
  {
    title: '星星消除',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
    alt: '星星消除',
    type: '经典消除游戏',
    category: '多任务',
    link: '/star.html',
  },
];

// 过滤和渲染逻辑
let currentCategory = '全部';
let currentKeyword = '';

function filterGames(games) {
  return games.filter(game => {
    const matchCategory = currentCategory === '全部' || game.category === currentCategory;
    const matchKeyword =
      !currentKeyword ||
      game.title.includes(currentKeyword) ||
      game.type.includes(currentKeyword);
    return matchCategory && matchKeyword;
  });
}

function renderFinishedGames() {
  const container = document.getElementById('finished-games-list');
  const filtered = filterGames(finishedGames);
  container.innerHTML = filtered.map(game => {
    const cardOpen = game.link ? `onclick=\"window.location.href='${game.link}'\" style=\"cursor:pointer\"` : '';
    return `
      <div class=\"game-card\" ${cardOpen}>
        ${game.badge ? `<div class=\"${game.badgeClass}\">${game.badge}</div>` : ''}
        <div class=\"game-cover\">
          <img src=\"${game.img}\" alt=\"${game.alt}\">
        </div>
        <div class=\"game-info\">
          <div class=\"game-title\">${game.title}</div>
          <div class=\"game-meta\">
            <div class=\"game-rating\">
              <i class=\"fas fa-star mr-1\"></i>
              <span>${game.rating}</span>
            </div>
            <span class=\"game-type\">${game.type}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderDevelopingGames() {
  const container = document.getElementById('developing-games-list');
  if (!container) return;
  const filtered = filterGames(developingGames);
  container.innerHTML = filtered.map(game => {
    // 不允许点击跳转
    return `
      <div class=\"game-card bg-gray-200 opacity-60 relative\">
        <div class=\"absolute top-2 left-2 bg-gray-400 text-white text-xs px-2 py-1 rounded\">开发中</div>
        <div class=\"game-cover\">
          <img src=\"${game.img}\" alt=\"${game.alt}\" class=\"opacity-60\">
        </div>
        <div class=\"game-info\">
          <div class=\"game-title text-gray-500\">${game.title}</div>
          <div class=\"game-meta\">
            <span class=\"game-type text-gray-400\">${game.type}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setCategory(category) {
  currentCategory = category;
  renderFinishedGames();
  renderDevelopingGames();
  // 更新类别高亮
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.classList.toggle('active', chip.textContent === category);
  });
}

function setKeyword(keyword) {
  currentKeyword = keyword.trim();
  renderFinishedGames();
  renderDevelopingGames();
}

document.addEventListener('DOMContentLoaded', function() {
  renderFinishedGames();
  renderDevelopingGames();
  // 类别选择器
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      setCategory(this.textContent);
    });
  });
  // 搜索栏
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      setKeyword(this.value);
    });
  }
}); 