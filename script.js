const screens = {
  title: document.getElementById('titleScreen'),
  register: document.getElementById('registerScreen'),
  welcome: document.getElementById('welcomeScreen'),
  menu: document.getElementById('menuScreen'),
  category: document.getElementById('categoryScreen')
};

const audio = {
  bgm: document.getElementById('bgm'),
  cursor: document.getElementById('seCursor'),
  decide: document.getElementById('seDecide'),
  clear: document.getElementById('seClear')
};

const storageKey = 'otakubaGuildAdventurerName';

const titleMessage = document.getElementById('titleMessage');
const nameInput = document.getElementById('nameInput');
const welcomeText = document.getElementById('welcomeText');
const playerName = document.getElementById('playerName');
const categoryGrid = document.getElementById('categoryGrid');
const categoryTitle = document.getElementById('categoryTitle');
const itemList = document.getElementById('itemList');

const categories = [
  { id:'drink', label:'ドリンク' },
  { id:'alcohol', label:'アルコール' },
  { id:'food', label:'フード' },
  { id:'event', label:'イベント' }
];

const menuItems = {
  drink:[
    {name:'回復ポーション',desc:'ノンアル。冒険前の一杯に。',price:600},
    {name:'妖精のレモンソーダ',desc:'爽やかな炭酸ドリンク。',price:650}
  ],
  alcohol:[
    {name:'冒険者のエール',desc:'まずは一杯。定番ビール。',price:700},
    {name:'魔法使いのハイボール',desc:'すっきり飲める黄金炭酸。',price:800}
  ],
  food:[
    {name:'ドラゴン唐揚げ',desc:'外はカリッと、中は伝説級。',price:900},
    {name:'スライム枝豆',desc:'とりあえず召喚されがちな緑のやつ。',price:500}
  ],
  event:[
    {name:'記念撮影の儀',desc:'冒険の証を残すフォトクエスト。',price:500},
    {name:'推し布教クエスト',desc:'好きな作品を語る依頼。',price:0}
  ]
};

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function play(sound){
  const s = audio[sound];
  if(!s) return;
  try{
    s.currentTime = 0;
    s.play().catch(()=>{});
  }catch(e){}
}

function startBgm(){
  audio.bgm.volume = 0.55;
  audio.bgm.play().catch(()=>{});
}

function getName(){
  return localStorage.getItem(storageKey) || '';
}

function setName(name){
  localStorage.setItem(storageKey, name);
}

function openAfterTitle(){
  const savedName = getName();
  if(savedName){
    welcomeText.textContent = `おかえり、${savedName}！`;
    showScreen('welcome');
  }else{
    showScreen('register');
    setTimeout(()=>nameInput.focus(),150);
  }
}

document.querySelectorAll('.choice').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.choice').forEach(b=>b.classList.remove('selected'));
    button.classList.add('selected');

    const action = button.dataset.action;

    if(action === 'yes'){
      play('decide');
      setTimeout(openAfterTitle,180);
    }else{
      play('cursor');
      titleMessage.innerHTML = 'ギルドマスター<br>「冷やかしか？<br>さっさとメニューを開くんだ。」';
    }
  });
});

document.getElementById('registerButton').addEventListener('click',()=>{
  const name = nameInput.value.trim();
  if(!name){
    play('cursor');
    nameInput.focus();
    return;
  }

  play('decide');
  setName(name);
  welcomeText.textContent = `おかえり、${name}！`;
  showScreen('welcome');
});

nameInput.addEventListener('keydown', e=>{
  if(e.key === 'Enter'){
    document.getElementById('registerButton').click();
  }
});

document.getElementById('openMenuButton').addEventListener('click',()=>{
  play('decide');
  startBgm();
  renderCategories();
  playerName.textContent = getName() || '冒険者';
  showScreen('menu');
});

function renderCategories(){
  categoryGrid.innerHTML = categories
    .map(cat => `<button data-cat="${cat.id}">▶ ${cat.label}</button>`)
    .join('');

  categoryGrid.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      play('cursor');
      openCategory(btn.dataset.cat);
    });
  });
}

function openCategory(id){
  const cat = categories.find(c=>c.id===id);
  categoryTitle.textContent = cat ? cat.label : 'メニュー';

  const items = menuItems[id] || [];

  itemList.innerHTML = items.map(item=>`
    <article class="item-card">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="price-row">
        <span class="price">${Number(item.price).toLocaleString('ja-JP')}円</span>
        <button class="order-button">▶ 受注する</button>
      </div>
    </article>
  `).join('');

  itemList.querySelectorAll('.order-button').forEach(btn=>{
    btn.addEventListener('click',()=>play('decide'));
  });

  showScreen('category');
}

document.getElementById('backToCategories').addEventListener('click',()=>{
  play('cursor');
  showScreen('menu');
});