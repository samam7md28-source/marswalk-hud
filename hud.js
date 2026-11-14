(function(){
const $=s=>document.querySelector(s), hud=$('#hud');

window.MISSION_STATE = window.MISSION_STATE || {
  waypoints: [],
  oxygen: 100,
  battery: 100,
  comms: 100,
  radiation: 0
};

let tick=0, heading=91, sec=7*3600+28*60+35, scanning=false, scanIdx=0, txtTimer;

window.HUD={
  set(k,v){ MISSION_STATE[k] = Math.max(0, Math.min(100, v)); updateHUD(); },
  log: say,
  open(id){ const t = SCENE_DATA.targets.find(x => x.id === id); if(t) openCard(t); },
  close: closeCard
};

// Exposed globally so logic_3.js can trigger it on waypoint clicks
window.updateHUD = function() {
  render();
};

function say(m){
  const el = $('#scanTxt');
  if (!el) return;
  el.classList.remove('active');
  el.textContent = m;
  clearTimeout(txtTimer);
  txtTimer = setTimeout(()=>{ if(!scanning) el.textContent='SCANNING / IDLE'; }, 2500);
}

function render(){
  document.querySelectorAll('.row').forEach(r=>{
    const k = r.dataset.k; 
    const keyMap = { o2: 'oxygen', bat: 'battery', com: 'comms', rad: 'radiation' };
    const stateKey = keyMap[k] || k;

    const v = Math.round(MISSION_STATE[stateKey] || 0);
    const fillEl = r.querySelector('.fill');
    const valEl = r.querySelector('.v');
    
    if (fillEl) fillEl.style.width = v + '%';
    if (valEl) valEl.textContent = v + '%';
    
    r.classList.toggle('crit', stateKey === 'radiation' ? v > 70 : v < 20);
  });

  const a = MISSION_STATE.radiation > 70;
  document.body.classList.toggle('alert', a);
  
  const cLbl = $('#cLbl');
  const cVal = $('#cVal');
  if (cLbl) cLbl.textContent = a ? 'RADIATION:' : 'DUST ACTIVITY:';
  if (cVal) cVal.textContent = a ? 'HIGH' : 'MODERATE';
}

// Radar blips — one per target in SCENE_DATA
if (typeof SCENE_DATA !== 'undefined' && SCENE_DATA.targets) {
  SCENE_DATA.targets.forEach(t=>{
    const a = t.bearing * Math.PI / 180, r = Math.min(t.dist / 120, 1) * 44;
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','blip');
    g.innerHTML='<circle cx="'+(70+Math.sin(a)*r)+'" cy="'+(52-Math.cos(a)*r)+'" r="2.6"/>';
    g.onclick = () => openCard(t);
    const blipsEl = $('#blips');
    if (blipsEl) blipsEl.appendChild(g);
  });
}

function openCard(t){
  $('#cType').textContent = t.mineral;
  $('#cName').textContent = t.label;
  $('#cDl').innerHTML = [['ID', t.id],['Distance', t.dist+' m'],['Bearing', t.bearing+'°'],['Mass', t.mass],['Surface temp', t.temp]]
    .map(r=>'<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>').join('');
  $('#cComp').innerHTML = '<div class="lbl" style="margin-bottom:4px">Composition</div>' + t.comp
    .map(c=>'<div class="comp"><span>'+c[0]+'</span><i style="--w:'+(c[1]/100)+'"></i><span style="text-align:right">'+c[1]+'%</span></div>').join('');
  $('#cNote').textContent = t.briefing;
  const c = $('#card');
  c.classList.remove('open');
  void c.offsetWidth;
  c.classList.add('open');
  c.setAttribute('aria-hidden','false');
  say('TARGET '+t.id+' LOCKED');
  $('#close').focus({preventScroll:true});
}

function closeCard(){
  const card = $('#card');
  if (card) {
    card.classList.remove('open');
    card.setAttribute('aria-hidden','true');
  }
}

const closeBtn = $('#close');
if (closeBtn) closeBtn.onclick = closeCard;

const scanBtn = $('#scanBtn');
if (scanBtn) {
  scanBtn.onclick = () => {
    if(scanning) return;
    scanning = true;
    closeCard();
    const el = $('#scanTxt');
    el.textContent = 'SCANNING / ACTIVE';
    el.classList.add('active');
    setTimeout(()=>{
      scanning = false;
      el.classList.remove('active');
      el.textContent = 'SCANNING / IDLE';
      openCard(SCENE_DATA.targets[scanIdx++ % SCENE_DATA.targets.length]);
    }, 2000);
  };
}

addEventListener('keydown', e => {
  if(e.key === 'Escape') closeCard();
});

// Clock ticker
setInterval(()=>{
  sec++;
  const p = n => String(n).padStart(2,'0');
  const clockEl = $('#clock');
  if (clockEl) {
    clockEl.textContent = p(sec/3600%24|0) + ':' + p(sec/60%60|0) + ':' + p(sec%60);
  }
}, 1000);

// Boot sequence
const BOOT = [['01','VISOR DISPLAY','ONLINE'],['02','LIFE SUPPORT','ONLINE'],['03','TERRAIN SCANNER','CALIBRATING'],['04','UPLINK','CONNECTED']];
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
let i = 0;

function step(){
  if(i < BOOT.length){
    const b = BOOT[i++], li = document.createElement('li');
    li.innerHTML = '<span class="n">['+b[0]+']</span> ' + (b[1]+' ').padEnd(22,'.') + ' <span class="s">'+b[2]+'</span>';
    const bList = $('#bList');
    if (bList) bList.appendChild(li);
    const bFill = $('#bFill');
    if (bFill) bFill.style.width = (i / (BOOT.length + 1) * 100) + '%';
    setTimeout(step, reduce ? 0 : 380);
  } else {
    const thirdItem = $('#bList')?.children[2]?.querySelector('.s');
    if (thirdItem) thirdItem.textContent = 'ONLINE';
    const bFill = $('#bFill');
    if (bFill) bFill.style.width = '100%';
    setTimeout(() => {
      $('#boot')?.classList.add('done');
      $('#scan')?.classList.add('go');
      if (hud) hud.classList.add('on');
      render();
    }, reduce ? 0 : 600);
  }
}

render();

const beginButton = $('#beginEVA');
const briefingScreen = $('#briefing');

if (beginButton) {
  beginButton.addEventListener('click', () => {
    if (briefingScreen) {
      briefingScreen.classList.add('hidden');
    }

    step();
  });
}

})();