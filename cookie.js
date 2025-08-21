(function(){
  const $ = (sel) => document.querySelector(sel);

  const LANG_KEY = 'cookie.lang.v1';
  const SAVE_KEY = 'cookie.save.v1';
  const VERSION = 2;

  const i18n = {
    en: {
      title: 'Cookie Clicker',
      language: 'Language',
      store: 'Store',
      export: 'Export save',
      import: 'Import save',
      reset: 'Reset',
      cookies: (n) => `${format(n)} cookies`,
      cps: (n) => `CPS: ${format(n, 2)}`,
      items: {
        cursor: { name: 'Cursor', desc: 'Clicks for you', baseCost: 15, cps: 0.1 },
        grandma: { name: 'Grandma', desc: 'A nice grandma to bake cookies', baseCost: 100, cps: 1 },
        farm: { name: 'Farm', desc: 'Grows cookie plants', baseCost: 1100, cps: 8 },
        factory: { name: 'Factory', desc: 'Mass-produces cookies', baseCost: 12000, cps: 47 },
        bank: { name: 'Bank', desc: 'Cookie interest', baseCost: 140000, cps: 260 },
        temple: { name: 'Temple', desc: 'Prays for cookie blessings', baseCost: 2000000, cps: 1400 },
        portal: { name: 'Portal', desc: 'Opens to the Cookieverse', baseCost: 10000000, cps: 6666 },
      }
    },
    et: {
      title: 'Küpsiseklõpsija',
      language: 'Keel',
      store: 'Pood',
      export: 'Ekspordi salvestus',
      import: 'Impordi salvestus',
      reset: 'Lähtesta',
      cookies: (n) => `${format(n)} küpsist`,
      cps: (n) => `KPS: ${format(n, 2)}`,
      items: {
        cursor: { name: 'Kursor', desc: 'Klikib sinu eest', baseCost: 15, cps: 0.1 },
        grandma: { name: 'Vanaema', desc: 'Küpsetab küpsiseid', baseCost: 100, cps: 1 },
        farm: { name: 'Talu', desc: 'Kasvatab küpsisetaimi', baseCost: 1100, cps: 8 },
        factory: { name: 'Tehas', desc: 'Toodab hulgi küpsiseid', baseCost: 12000, cps: 47 },
        bank: { name: 'Pank', desc: 'Küpsiseintress', baseCost: 140000, cps: 260 },
        temple: { name: 'Tempel', desc: 'Palvetab küpsisõnnistuste eest', baseCost: 2000000, cps: 1400 },
        portal: { name: 'Portaal', desc: 'Avab tee Küpsisuniversumisse', baseCost: 10000000, cps: 6666 },
      }
    },
    de: {
      title: 'Cookie-Klicker',
      language: 'Sprache',
      store: 'Laden',
      export: 'Speicher exportieren',
      import: 'Speicher importieren',
      reset: 'Zurücksetzen',
      cookies: (n) => `${format(n)} Kekse`,
      cps: (n) => `KPS: ${format(n, 2)}`,
      items: {
        cursor: { name: 'Mauszeiger', desc: 'Klickt für dich', baseCost: 15, cps: 0.1 },
        grandma: { name: 'Oma', desc: 'Backt Kekse', baseCost: 100, cps: 1 },
        farm: { name: 'Bauernhof', desc: 'Züchtet Keks-Pflanzen', baseCost: 1100, cps: 8 },
        factory: { name: 'Fabrik', desc: 'Produziert massenhaft Kekse', baseCost: 12000, cps: 47 },
        bank: { name: 'Bank', desc: 'Kekszinsen', baseCost: 140000, cps: 260 },
        temple: { name: 'Tempel', desc: 'Bittet um Kekssegen', baseCost: 2000000, cps: 1400 },
        portal: { name: 'Portal', desc: 'Öffnet ins Keksuniversum', baseCost: 10000000, cps: 6666 },
      }
    },
    es: {
      title: 'Cookie Clicker',
      language: 'Idioma',
      store: 'Tienda',
      export: 'Exportar guardado',
      import: 'Importar guardado',
      reset: 'Reiniciar',
      cookies: (n) => `${format(n)} galletas`,
      cps: (n) => `CPS: ${format(n, 2)}`,
      items: {
        cursor: { name: 'Cursor', desc: 'Hace clic por ti', baseCost: 15, cps: 0.1 },
        grandma: { name: 'Abuela', desc: 'Hornea galletas', baseCost: 100, cps: 1 },
        farm: { name: 'Granja', desc: 'Cultiva plantas de galletas', baseCost: 1100, cps: 8 },
        factory: { name: 'Fábrica', desc: 'Produce galletas en masa', baseCost: 12000, cps: 47 },
        bank: { name: 'Banco', desc: 'Interés de galletas', baseCost: 140000, cps: 260 },
        temple: { name: 'Templo', desc: 'Ruega bendiciones galletosas', baseCost: 2000000, cps: 1400 },
        portal: { name: 'Portal', desc: 'Abre al Cookieverso', baseCost: 10000000, cps: 6666 },
      }
    }
  };

  function readLang(){
    const fromStorage = localStorage.getItem(LANG_KEY);
    const nav = navigator.language?.slice(0,2) || 'en';
    return fromStorage || (['en','et','de','es'].includes(nav) ? nav : 'en');
  }

  function format(n, fixed){
    const digits = fixed ?? (n < 10 ? 2 : n < 100 ? 1 : 0);
    if (n >= 1e12) return (n/1e12).toFixed(3)+'T';
    if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
    if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
    if (n >= 1e3) return (n/1e3).toFixed(1)+'k';
    return n.toFixed(digits);
  }

  const state = {
    lang: readLang(),
    cookies: 0,
    totalCookies: 0,
    items: {
      cursor: { owned: 0 },
      grandma: { owned: 0 },
      farm: { owned: 0 },
      factory: { owned: 0 },
      bank: { owned: 0 },
      temple: { owned: 0 },
      portal: { owned: 0 }
    },
    upgrades: {},
    achievements: {},
    frenzyUntil: 0,
    lastTick: performance.now(),
  };

  const cookieBtn = $('#cookieButton');
  const cookieCountEl = $('#cookieCount');
  const cpsEl = $('#cpsLabel');
  const storeList = $('#storeList');
  const langSelect = $('#langSelect');
  const exportBtn = $('#exportBtn');
  const importBtn = $('#importBtn');
  const resetBtn = $('#resetBtn');

  function getLangPack(){ return i18n[state.lang]; }

  function currentCps(){
    const itemsPack = getLangPack().items;
    let cps = 0;
    cps += state.items.cursor.owned * itemsPack.cursor.cps;
    cps += state.items.grandma.owned * itemsPack.grandma.cps;
    cps += state.items.farm.owned * itemsPack.farm.cps;
    cps += state.items.factory.owned * itemsPack.factory.cps;
    cps += state.items.bank.owned * itemsPack.bank.cps;
    if (itemsPack.temple) cps += state.items.temple.owned * (itemsPack.temple.cps || 1400);
    if (itemsPack.portal) cps += state.items.portal.owned * (itemsPack.portal.cps || 6666);
    // Upgrades multipliers
    cps *= upgradeMultiplier();
    // Frenzy
    if (performance.now() < state.frenzyUntil) cps *= 7;
    return cps;
  }

  function itemCost(key){
    const base = getLangPack().items[key].baseCost;
    const owned = state.items[key].owned;
    return Math.floor(base * Math.pow(1.15, owned));
  }

  function updateStats(){
    cookieCountEl.textContent = getLangPack().cookies(state.cookies);
    cpsEl.textContent = getLangPack().cps(currentCps());
    document.title = `${format(state.cookies)} 🍪 - ${getLangPack().title}`;
  }

  function renderStore(){
    const pack = getLangPack();
    const order = itemOrder();
    storeList.innerHTML = '';
    for(const key of order){
      const data = pack.items[key];
      const owned = state.items[key].owned;
      const cost = itemCost(key);
      const canBuy = state.cookies >= cost;
      const el = document.createElement('div');
      el.className = 'item';
      el.innerHTML = `
        <div class="meta">
          <div class="name">${data.name}</div>
          <div class="desc">${data.desc}</div>
          <div class="owned">x${owned} • +${data.cps}/s</div>
        </div>
        <button class="buy" data-key="${key}" ${canBuy? '': 'disabled'}>
          ${format(cost)} 🍪
        </button>
      `;
      storeList.appendChild(el);
    }
  }

  function itemOrder(){
    const base = ['cursor','grandma','farm','factory','bank','temple','portal'];
    const visible = [];
    for(const k of base){
      const req = unlockThreshold(k);
      if (req === 0 || state.totalCookies >= req || state.items[k]?.owned > 0) visible.push(k);
    }
    return visible;
  }

  function unlockThreshold(key){
    switch(key){
      case 'temple': return 1e5;
      case 'portal': return 1e6;
      default: return 0;
    }
  }

  // Upgrades
  const upgrades = [
    { id:'double-cursor', name:'Lubed Mouse', desc:'+100% Cursor CPS', cost:1000, requires:{cursor:10}, mult:{cursor:2} },
    { id:'better-grandma', name:'Baking Lessons', desc:'+100% Grandma CPS', cost:5000, requires:{grandma:10}, mult:{grandma:2} },
    { id:'steel-ovens', name:'Steel Ovens', desc:'+50% global CPS', cost:25000, requires:{factory:5}, global:1.5 },
  ];

  function upgradeMultiplier(){
    let mult = 1;
    for(const up of upgrades){
      if(!state.upgrades[up.id]) continue;
      if (up.global) mult *= up.global;
    }
    return mult;
  }

  const upgradeListEl = document.getElementById('upgradeList');
  function renderUpgrades(){
    upgradeListEl.innerHTML = '';
    for(const up of upgrades){
      if (state.upgrades[up.id]) continue;
      if (!meetsRequires(up.requires)) continue;
      const canBuy = state.cookies >= up.cost;
      const el = document.createElement('div');
      el.className = 'item';
      el.innerHTML = `
        <div class="meta">
          <div class="name">${up.name}</div>
          <div class="desc">${up.desc}</div>
        </div>
        <button class="buy upgrade" data-upgrade="${up.id}" ${canBuy? '': 'disabled'}>${format(up.cost)} 🍪</button>
      `;
      upgradeListEl.appendChild(el);
    }
  }

  function meetsRequires(req){
    if (!req) return true;
    for(const k of Object.keys(req)) if ((state.items[k]?.owned||0) < req[k]) return false;
    return true;
  }

  function toast(msg){
    let t = document.querySelector('.toast');
    if(!t){ t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._tid); toast._tid = setTimeout(()=>t.classList.remove('show'), 1400);
  }

  function tick(now){
    const dt = Math.min(2, (now - state.lastTick) / 1000); // seconds, clamp to 2s
    state.lastTick = now;
    state.cookies += currentCps() * dt;
    state.totalCookies += currentCps() * dt;
    updateStats();
    // Update affordability without full re-render
    updateAffordability();
    checkAchievements();
    requestAnimationFrame(tick);
  }

  function updateAffordability(){
    document.querySelectorAll('#storeList .item .buy').forEach(btn=>{
      const key = btn.getAttribute('data-key'); if (!key) return;
      const cost = itemCost(key);
      if (state.cookies >= cost) btn.removeAttribute('disabled'); else btn.setAttribute('disabled','');
      btn.textContent = `${format(cost)} 🍪`;
    });
    document.querySelectorAll('#upgradeList .item .buy').forEach(btn=>{
      const id = btn.getAttribute('data-upgrade'); if (!id) return;
      const up = upgrades.find(u=>u.id===id); if(!up) return;
      if (state.cookies >= up.cost) btn.removeAttribute('disabled'); else btn.setAttribute('disabled','');
      btn.textContent = `${format(up.cost)} 🍪`;
    });
  }

  function clickCookie(ev){
    const cpsNow = currentCps();
    const add = cpsNow > 0 ? cpsNow : 1; // fallback to 1 if no CPS yet
    state.cookies += add;
    state.totalCookies += add;
    const digits = add < 1 ? 2 : 0;
    spawnClickFloat(`+${format(add, digits)}`, ev);
    updateStats();
  }

  function spawnClickFloat(text, ev){
    const el = document.createElement('div');
    el.className = 'click-float';
    el.textContent = text;
    const rect = cookieBtn.getBoundingClientRect();
    const x = (ev?.clientX ?? rect.left + rect.width/2);
    const y = (ev?.clientY ?? rect.top + rect.height/2);
    el.style.left = (x - 10) + 'px';
    el.style.top = (y - 10) + 'px';
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 900);
  }

  function buy(key){
    const cost = itemCost(key);
    if (state.cookies < cost) { toast('Not enough cookies'); return; }
    state.cookies -= cost;
    state.items[key].owned += 1;
    renderStore();
    renderUpgrades();
    updateStats();
    scheduleSave();
  }

  function buyUpgrade(id){
    const up = upgrades.find(u=>u.id===id);
    if (!up) return;
    if (!meetsRequires(up.requires)) return;
    if (state.cookies < up.cost) { toast('Not enough cookies'); return; }
    state.cookies -= up.cost;
    state.upgrades[id] = true;
    renderUpgrades();
    updateStats();
    scheduleSave();
  }

  function applyI18n(){
    const pack = getLangPack();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (typeof pack[k] === 'string') el.textContent = pack[k];
    });
    $('#title').textContent = pack.title;
    updateStats();
    renderStore();
    renderUpgrades();
  }

  function scheduleSave(){
    clearTimeout(scheduleSave._tid);
    scheduleSave._tid = setTimeout(save, 300);
  }

  function save(){
    const payload = {
      v: VERSION,
      lang: state.lang,
      cookies: state.cookies,
      totalCookies: state.totalCookies,
      items: state.items,
      upgrades: state.upgrades,
      achievements: state.achievements,
      frenzyUntil: state.frenzyUntil,
      t: Date.now()
    };
    localStorage.setItem(SAVE_KEY, btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
  }

  function load(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return;
      const data = JSON.parse(decodeURIComponent(escape(atob(raw))));
      if ((data.v||1) > VERSION) return;
      state.lang = data.lang || state.lang;
      state.cookies = data.cookies || 0;
      state.totalCookies = data.totalCookies || 0;
      if (data.items) {
        for (const k of Object.keys(state.items)) {
          state.items[k].owned = Math.max(0, Math.floor(data.items[k]?.owned || 0));
        }
      }
      if (data.upgrades) state.upgrades = data.upgrades;
      if (data.achievements) state.achievements = data.achievements;
      if (data.frenzyUntil) state.frenzyUntil = data.frenzyUntil;
    }catch(e){ console.warn('Failed to load save', e); }
  }

  function exportSave(){
    save();
    const data = localStorage.getItem(SAVE_KEY) || '';
    navigator.clipboard?.writeText(data).then(()=> toast('Copied save to clipboard')).catch(()=>{
      prompt('Copy your save code:', data);
    });
  }

  function importSave(){
    const code = prompt('Paste your save code:');
    if (!code) return;
    try{
      localStorage.setItem(SAVE_KEY, code);
      load();
      localStorage.setItem(LANG_KEY, state.lang);
      langSelect.value = state.lang;
      applyI18n();
      updateStats();
      renderStore();
      toast('Save imported');
    }catch(e){ toast('Invalid save'); }
  }

  function reset(){
    if (!confirm('Reset all progress?')) return;
    state.cookies = 0; state.totalCookies = 0;
    for(const k of Object.keys(state.items)) state.items[k].owned = 0;
    state.upgrades = {}; state.achievements = {}; state.frenzyUntil = 0;
    save();
    renderStore();
    renderUpgrades();
    updateStats();
  }

  // Event wiring
  cookieBtn.addEventListener('click', (e)=> clickCookie(e));
  storeList.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.buy');
    if (!btn) return;
    buy(btn.getAttribute('data-key'));
  });
  upgradeListEl.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.buy.upgrade');
    if (!btn) return;
    buyUpgrade(btn.getAttribute('data-upgrade'));
  });
  exportBtn.addEventListener('click', exportSave);
  importBtn.addEventListener('click', importSave);
  resetBtn.addEventListener('click', reset);
  langSelect.addEventListener('change', ()=>{
    state.lang = langSelect.value; localStorage.setItem(LANG_KEY, state.lang); applyI18n(); save();
  });

  // Golden cookie
  const goldenEl = document.getElementById('goldenCookie');
  function spawnGolden(){
    if (Math.random() < 0.5) return; // 50% chance to skip
    goldenEl.style.display = 'block';
    const x = 20 + Math.random()* (window.innerWidth - 100);
    const y = 20 + Math.random()* (window.innerHeight - 200);
    goldenEl.style.left = x+'px';
    goldenEl.style.top = y+'px';
    clearTimeout(spawnGolden._despawn);
    spawnGolden._despawn = setTimeout(()=>{ goldenEl.style.display='none';}, 7000);
  }
  goldenEl.addEventListener('click', ()=>{
    goldenEl.style.display='none';
    // 20% instant cookies, 80% frenzy 7x for 77s
    if (Math.random() < 0.2){
      const reward = Math.max(13, currentCps()*60*7);
      state.cookies += reward;
      toast(`+${format(reward)} 🍪`);
    }else{
      state.frenzyUntil = performance.now() + 77000;
      toast('Frenzy! x7 CPS');
    }
    scheduleSave();
  });
  setInterval(()=>{ if (document.hidden) return; if (Math.random()<0.08) spawnGolden(); }, 15000);

  // Achievements (simple examples)
  const achievementDefs = [
    { id:'first-cookie', name:'First Bite', cond:()=>state.totalCookies>=1 },
    { id:'hundred-cookies', name:'Sweet Century', cond:()=>state.totalCookies>=100 },
    { id:'first-grandma', name:'Family Help', cond:()=>state.items.grandma.owned>=1 },
  ];
  function checkAchievements(){
    for(const a of achievementDefs){
      if (state.achievements[a.id]) continue;
      if (a.cond()){ state.achievements[a.id]=true; toast(`Achievement: ${a.name}`); scheduleSave(); }
    }
  }

  // Init
  try{ langSelect.value = state.lang; }catch{}
  load();
  applyI18n();
  updateStats();
  renderStore();
  renderUpgrades();
  requestAnimationFrame((t)=>{ state.lastTick = t; requestAnimationFrame(tick); });
})();


