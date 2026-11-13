/* =====================================================================
   HUD CONTROLLER  — HANEEN's design, adapted by SAMA.
   - Renders the helmet HUD (boot sequence, resource bars, radar, cards).
   - Reads targets from SCENE_DATA (Fatema's file) instead of hardcoding.
   - Drives MISSION_STATE resources (Mariem's file) into the bars.
   - Exposes a small API for other modules:
       HUD.open(targetId)   — open a target's info card
       HUD.close()          — close the card
       HUD.set(key, value)  — set a resource (oxygen/battery/comms/radiation)
       HUD.log(message)     — flash a message in the scan-text field
===================================================================== */
(function(){
const $=s=>document.querySelector(s), hud=$('#hud');

const state={o2:86,bat:72,com:94,rad:18};
let tick=0,heading=91,sec=7*3600+28*60+35,scanning=false,scanIdx=0,txtTimer;

window.HUD={
 set(k,v){state[k]=Math.max(0,Math.min(100,v));render()},
 log:say,
 open(id){const t=SCENE_DATA.targets.find(x=>x.id===id);if(t)openCard(t)},
 close:closeCard
};

function say(m){const el=$('#scanTxt');el.classList.remove('active');el.textContent=m;
 clearTimeout(txtTimer);txtTimer=setTimeout(()=>{if(!scanning)el.textContent='SCANNING / IDLE'},2500)}

function render(){
 document.querySelectorAll('.row').forEach(r=>{
  const k=r.dataset.k,v=Math.round(state[k]);
  r.querySelector('.fill').style.width=v+'%';
  r.querySelector('.v').textContent=v+'%';
  r.classList.toggle('crit',k==='rad'?v>70:v<20);
 });
 const a=state.rad>70;
 document.body.classList.toggle('alert',a);
 $('#cLbl').textContent=a?'RADIATION:':'DUST ACTIVITY:';
 $('#cVal').textContent=a?'HIGH':'MODERATE';
}

// Radar blips — one per target in SCENE_DATA, positioned by bearing/distance.
SCENE_DATA.targets.forEach(t=>{
 const a=t.bearing*Math.PI/180,r=Math.min(t.dist/120,1)*44;
 const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','blip');
 g.innerHTML='<circle cx="'+(70+Math.sin(a)*r)+'" cy="'+(52-Math.cos(a)*r)+'" r="2.6"/>';
 g.onclick=()=>openCard(t);$('#blips').appendChild(g);
});

function openCard(t){
 $('#cType').textContent=t.mineral;$('#cName').textContent=t.label;
 $('#cDl').innerHTML=[['ID',t.id],['Distance',t.dist+' m'],['Bearing',t.bearing+'°'],['Mass',t.mass],['Surface temp',t.temp]]
  .map(r=>'<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>').join('');
 $('#cComp').innerHTML='<div class="lbl" style="margin-bottom:4px">Composition</div>'+t.comp
  .map(c=>'<div class="comp"><span>'+c[0]+'</span><i style="--w:'+(c[1]/100)+'"></i><span style="text-align:right">'+c[1]+'%</span></div>').join('');
 $('#cNote').textContent=t.briefing;
 const c=$('#card');c.classList.remove('open');void c.offsetWidth;c.classList.add('open');c.setAttribute('aria-hidden','false');
 say('TARGET '+t.id+' LOCKED');$('#close').focus({preventScroll:true});
}
function closeCard(){
 $('#card').classList.remove('open');$('#card').setAttribute('aria-hidden','true');
}
$('#close').onclick=closeCard;

$('#scanBtn').onclick=()=>{
 if(scanning)return;scanning=true;closeCard();
 const el=$('#scanTxt');el.textContent='SCANNING / ACTIVE';el.classList.add('active');
 setTimeout(()=>{scanning=false;el.classList.remove('active');el.textContent='SCANNING / IDLE';
  openCard(SCENE_DATA.targets[scanIdx++%SCENE_DATA.targets.length])},2000);
};

addEventListener('keydown',e=>{
 if(e.key==='Escape')closeCard();
});

// Clock + demo resource drain.
// NOTE: the drain below is placeholder demo behaviour. MARIEM will replace
// it with real route-based resource consumption in js/logic.js.
setInterval(()=>{
 sec++;tick++;const p=n=>String(n).padStart(2,'0');
 $('#clock').textContent=p(sec/3600%24|0)+':'+p(sec/60%60|0)+':'+p(sec%60);
 state.o2-=.03;state.bat-=.02;
 state.com=Math.max(40,Math.min(100,state.com+(Math.random()-.5)*4));
 state.rad=Math.max(5,Math.min(100,state.rad+(Math.random()-.45)*3));
 if(tick%40===0)state.rad=82;
 render();
},1000);

// Boot sequence — runs once on load, then reveals the HUD.
const BOOT=[['01','VISOR DISPLAY','ONLINE'],['02','LIFE SUPPORT','ONLINE'],['03','TERRAIN SCANNER','CALIBRATING'],['04','UPLINK','CONNECTED']];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let i=0;
function step(){
 if(i<BOOT.length){
  const b=BOOT[i++],li=document.createElement('li');
  li.innerHTML='<span class="n">['+b[0]+']</span> '+(b[1]+' ').padEnd(22,'.')+' <span class="s">'+b[2]+'</span>';
  $('#bList').appendChild(li);
  $('#bFill').style.width=(i/(BOOT.length+1)*100)+'%';
  setTimeout(step,reduce?0:380);
 }else{
  $('#bList').children[2].querySelector('.s').textContent='ONLINE';
  $('#bFill').style.width='100%';
  setTimeout(()=>{$('#boot').classList.add('done');$('#scan').classList.add('go');hud.classList.add('on');render()},reduce?0:600);
 }
}
render();step();
})();
