const TAU = Math.PI * 2;
const WORLD = { w: 2400, h: 1500, margin: 72 };
const WEAPONS = {
  pistol: { id:'pistol', name:'PISTOL', damage:18, fireRate:7, mag:12, reserve:48, reload:0.9, speed:980, spread:0.018, pellets:1, color:'#69e9ff', cost:0 },
  burst: { id:'burst', name:'BURST RIFLE', damage:14, fireRate:13, mag:24, reserve:96, reload:1.35, speed:1120, spread:0.03, pellets:1, color:'#9e8cff', cost:75 },
  scatter: { id:'scatter', name:'SCATTER', damage:9, fireRate:2.2, mag:7, reserve:35, reload:1.5, speed:880, spread:0.15, pellets:7, color:'#ffc857', cost:110 },
  rail: { id:'rail', name:'RAIL SNIPER', damage:62, fireRate:1.1, mag:5, reserve:20, reload:1.8, speed:1600, spread:0.005, pellets:1, color:'#ff6f92', cost:180 }
};
const SHOP = [
  { id:'burst', title:'BURST RIFLE', text:'Fast controlled fire', cost:75 },
  { id:'scatter', title:'SCATTER', text:'Close-range multi-pellet', cost:110 },
  { id:'rail', title:'RAIL SNIPER', text:'Heavy precision shot', cost:180 },
  { id:'armor', title:'ARMOR PLATE', text:'+25 max armor now', cost:60 },
  { id:'med', title:'MED GEL', text:'+35 health', cost:45 },
  { id:'ammo', title:'AMMO CACHE', text:'+60 reserve ammo', cost:30 }
];
const walls = [
  {x:310,y:210,w:430,h:70},{x:310,y:1220,w:430,h:70},{x:1660,y:210,w:430,h:70},{x:1660,y:1220,w:430,h:70},
  {x:940,y:300,w:150,h:330},{x:1310,y:870,w:150,h:330},{x:1110,y:650,w:180,h:200},
  {x:430,y:620,w:240,h:115},{x:1730,y:765,w:240,h:115},{x:780,y:900,w:190,h:120},{x:1430,y:480,w:190,h:120}
];
const SPAWNS = [{x:170,y:750},{x:2230,y:750},{x:760,y:200},{x:1660,y:1300}];

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const angleTo=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const circleRect=(cx,cy,r,rect)=>{const x=clamp(cx,rect.x,rect.x+rect.w);const y=clamp(cy,rect.y,rect.y+rect.h);return Math.hypot(cx-x,cy-y)<r;};
const moveCircle=(actor,dx,dy)=>{
  actor.x+=dx; for(const wall of walls) if(circleRect(actor.x,actor.y,actor.r,wall)){actor.x-=dx;break;}
  actor.y+=dy; for(const wall of walls) if(circleRect(actor.x,actor.y,actor.r,wall)){actor.y-=dy;break;}
  actor.x=clamp(actor.x,WORLD.margin,WORLD.w-WORLD.margin); actor.y=clamp(actor.y,WORLD.margin,WORLD.h-WORLD.margin);
};

function makeWeapon(id){const w=WEAPONS[id];return {id,mag:w.mag,reserve:w.reserve,reloading:0,cooldown:0,accuracy:1};}
function createParticle(x,y,color,life=.35,size=3,dx=0,dy=0){return {x,y,color,life,maxLife:life,size,vx:dx,vy:dy};}
function createBot(id,x,y){return {id,name:['VEX','NYX','RIFT','ECHO'][id%4],x,y,r:25,hp:100,maxHp:100,armor:25,maxArmor:25,angle:0,speed:140,fire:0,state:'patrol',think:0,targetLost:0,wander:Math.random()*TAU,respawn:0,flash:0,kills:0};}

export function createGameState(seed=Date.now()){
  const player={id:'player',name:'PLAYER',x:WORLD.w/2,y:WORLD.h/2,r:26,hp:100,maxHp:100,armor:50,maxArmor:50,speed:235,sprint:1.55,angle:0,weapon:'pistol',weapons:{pistol:makeWeapon('pistol')},coins:35,kills:0,deaths:0,streak:0,fireHeld:false,aiming:false,flash:0};
  const state={seed,world:{...WORLD},player,bots:[],projectiles:[],particles:[],pickups:[],feed:[],score:0,time:600,matchOver:false,paused:false,shopOpen:false,shake:0,lastTime:0,killBanner:0,spawnClock:0,version:1};
  SPAWNS.slice(1).forEach((s,i)=>state.bots.push(createBot(i,...Object.values(s))));
  state.pickups.push({type:'health',x:1180,y:160,r:18,value:30,phase:0},{type:'armor',x:1180,y:1340,r:18,value:25,phase:1},{type:'ammo',x:180,y:180,r:18,value:30,phase:2},{type:'coins',x:2220,y:1320,r:18,value:20,phase:3});
  return state;
}

export function damageActor(target,amount){
  const absorbed=Math.min(target.armor,amount*.55); target.armor=Math.max(0,target.armor-absorbed); target.hp=Math.max(0,target.hp-(amount-absorbed)); target.flash=.11; return amount-absorbed;
}
function resetBot(state,bot){const s=SPAWNS[1+(bot.id%3)]; bot.x=s.x;bot.y=s.y;bot.hp=bot.maxHp;bot.armor=bot.maxArmor;bot.respawn=0;bot.state='patrol';bot.targetLost=0;}
export function respawnBot(state,bot){resetBot(state,bot);}
function addFeed(state,text){state.feed.unshift(text);state.feed=state.feed.slice(0,6);}
function burst(state,x,y,color,count=8,power=160){for(let i=0;i<count;i++){const a=Math.random()*TAU,s=power*(.3+Math.random());state.particles.push(createParticle(x,y,color,.2+.35*Math.random(),1+Math.random()*3,Math.cos(a)*s,Math.sin(a)*s));}}
function muzzle(state,actor,weapon){const a=actor.angle;const x=actor.x+Math.cos(a)*35,y=actor.y+Math.sin(a)*35;burst(state,x,y,weapon.color,6,100);state.particles.push(createParticle(x,y,weapon.color,.12,8,0,0));state.shake=Math.max(state.shake,weapon.id==='rail'?10:4);}
export function fireWeapon(state,owner,weaponId,angle){
  const gun=owner.weapons?.[weaponId]; if(!gun||gun.reloading>0||gun.cooldown>0||gun.mag<=0)return false;
  const w=WEAPONS[weaponId]; gun.mag--; gun.cooldown=1/w.fireRate;
  owner.angle=angle; muzzle(state,owner,w);
  for(let i=0;i<w.pellets;i++){const spread=(Math.random()-.5)*w.spread;const a=angle+spread;state.projectiles.push({x:owner.x+Math.cos(a)*35,y:owner.y+Math.sin(a)*35,vx:Math.cos(a)*w.speed,vy:Math.sin(a)*w.speed,r:3,life:1.35,damage:w.damage,owner:owner.id,color:w.color,trail:[]});}
  return true;
}
function addWeapon(player,id){if(!player.weapons[id])player.weapons[id]=makeWeapon(id);player.weapon=id;}
function reloadWeapon(player){const gun=player.weapons[player.weapon],w=WEAPONS[player.weapon];if(gun&&!gun.reloading&&gun.mag<w.mag&&gun.reserve>0)gun.reloading=w.reload;}
function finishReload(player){const gun=player.weapons[player.weapon],w=WEAPONS[player.weapon];if(!gun)return;const need=w.mag-gun.mag;const take=Math.min(need,gun.reserve);gun.mag+=take;gun.reserve-=take;gun.reloading=0;}
function nearestFreeSpawn(){return SPAWNS[Math.floor(Math.random()*SPAWNS.length)];}
function lineClear(a,b){const steps=Math.ceil(dist(a,b)/25);for(let i=1;i<steps;i++){const t=i/steps,x=lerp(a.x,b.x,t),y=lerp(a.y,b.y,t);for(const wall of walls)if(x>wall.x&&x<wall.x+wall.w&&y>wall.y&&y<wall.y+wall.h)return false;}return true;}

export function updateGame(state,input,dt){
  if(state.matchOver||state.paused)return;
  dt=Math.min(dt,.033); state.time=Math.max(0,state.time-dt); if(state.time<=0){state.matchOver=true;return;}
  const p=state.player;
  for(const key of Object.keys(p.weapons)){const gun=p.weapons[key];gun.cooldown=Math.max(0,gun.cooldown-dt);if(gun.reloading>0){gun.reloading=Math.max(0,gun.reloading-dt);if(gun.reloading===0){const old=p.weapon;p.weapon=key;finishReload(p);p.weapon=old;}}}
  const sx=(input.right?1:0)-(input.left?1:0),sy=(input.down?1:0)-(input.up?1:0),len=Math.hypot(sx,sy)||1;
  const speed=p.speed*(input.sprint? p.sprint:1)*(p.aiming?.64:1); moveCircle(p,sx/len*speed*dt,sy/len*speed*dt); p.angle=input.mouseAngle;p.aiming=input.aiming;p.flash=Math.max(0,p.flash-dt);
  if(input.reload)reloadWeapon(p);
  if(input.fire&&p.weapons[p.weapon].mag===0)reloadWeapon(p);
  if(input.fire)fireWeapon(state,p,p.weapon,p.angle);
  for(const bot of state.bots) updateBot(state,bot,dt);
  updateProjectiles(state,dt); updatePickups(state,dt); updateParticles(state,dt); state.shake=Math.max(0,state.shake-dt*32); state.killBanner=Math.max(0,state.killBanner-dt);
  const gun=p.weapons[p.weapon]; if(gun?.reloading<=0&&input.reload&&gun.mag<WEAPONS[p.weapon].mag)reloadWeapon(p);
}

function updateBot(state,bot,dt){
  if(bot.respawn>0){bot.respawn-=dt;if(bot.respawn<=0)resetBot(state,bot);return;}
  bot.fire=Math.max(0,bot.fire-dt);bot.think-=dt;bot.flash=Math.max(0,bot.flash-dt);
  const p=state.player,d=dist(bot,p);const visible=d<720&&lineClear(bot,p);
  if(visible){bot.targetLost=0;bot.state=d<260&&bot.hp<35?'retreat':'engage';}else{bot.targetLost+=dt;if(bot.targetLost>2)bot.state='patrol';}
  let dx=0,dy=0;
  if(bot.state==='engage'){bot.angle=angleTo(bot,p);if(d>360){dx=Math.cos(bot.angle);dy=Math.sin(bot.angle);}else if(d<210){dx=-Math.cos(bot.angle);dy=-Math.sin(bot.angle);}else{dx=Math.cos(bot.angle+Math.PI/2);dy=Math.sin(bot.angle+Math.PI/2);} if(visible&&bot.fire<=0){bot.fire=.2+Math.random()*.25;const w={id:'bot',damage:10,fireRate:1,mag:999,reload:0,speed:700,spread:.055,pellets:1,color:'#ff667f'};const a=bot.angle+(Math.random()-.5)*w.spread;state.projectiles.push({x:bot.x+Math.cos(a)*32,y:bot.y+Math.sin(a)*32,vx:Math.cos(a)*w.speed,vy:Math.sin(a)*w.speed,r:3,life:1.5,damage:w.damage,owner:bot.id+':bot',color:w.color,trail:[]});burst(state,bot.x+Math.cos(a)*30,bot.y+Math.sin(a)*30,w.color,3,60);}}
  else {if(bot.think<=0){bot.think=1+Math.random()*2;bot.wander+=(Math.random()-.5)*1.8;}dx=Math.cos(bot.wander);dy=Math.sin(bot.wander);if(Math.random()<.01)bot.wander=angleTo(bot,p);}
  const l=Math.hypot(dx,dy)||1;moveCircle(bot,dx/l*bot.speed*dt,dy/l*bot.speed*dt);
}

function projectileHitsWall(pr){return walls.some(w=>{if(pr.x>w.x&&pr.x<w.x+w.w&&pr.y>w.y&&pr.y<w.y+w.h)return true;return false;});}
function updateProjectiles(state,dt){
  for(let i=state.projectiles.length-1;i>=0;i--){const pr=state.projectiles[i];pr.life-=dt;pr.trail.push({x:pr.x,y:pr.y});if(pr.trail.length>8)pr.trail.shift();pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;
    if(pr.life<=0||pr.x<0||pr.x>WORLD.w||pr.y<0||pr.y>WORLD.h||projectileHitsWall(pr)){burst(state,pr.x,pr.y,pr.color,4,80);state.projectiles.splice(i,1);continue;}
    if(pr.owner==='player'){let hit=false;for(const bot of state.bots){if(bot.respawn>0)continue;if(Math.hypot(pr.x-bot.x,pr.y-bot.y)<bot.r+pr.r){damageActor(bot,pr.damage);burst(state,bot.x,bot.y,'#ff6986',9,130);hit=true;if(bot.hp<=0){state.score+=100;state.player.kills++;state.player.streak++;state.player.coins+=15;state.killBanner=1.4;addFeed(state,`PLAYER eliminated ${bot.name} +100`);bot.respawn=1.5;}}if(hit)break;}
    }else if(Math.hypot(pr.x-state.player.x,pr.y-state.player.y)<state.player.r+pr.r){damageActor(state.player,pr.damage);burst(state,state.player.x,state.player.y,'#ff667f',8,110);state.shake=Math.max(state.shake,7);state.player.streak=0;if(state.player.hp<=0){state.player.deaths++;state.player.x=nearestFreeSpawn().x;state.player.y=nearestFreeSpawn().y;state.player.hp=state.player.maxHp;state.player.armor=state.player.maxArmor*.6;state.player.coins=Math.max(0,state.player.coins-10);addFeed(state,'PLAYER respawned');}}
    if(pr.owner!=='player'&&Math.hypot(pr.x-state.player.x,pr.y-state.player.y)<state.player.r+pr.r){state.projectiles.splice(i,1);}
  }
}
function updatePickups(state,dt){for(const item of state.pickups){item.phase+=dt*2;if(Math.hypot(item.x-state.player.x,item.y-state.player.y)<36){if(item.type==='health')state.player.hp=Math.min(state.player.maxHp,state.player.hp+item.value);if(item.type==='armor')state.player.armor=Math.min(state.player.maxArmor,state.player.armor+item.value);if(item.type==='ammo')state.player.weapons[state.player.weapon].reserve+=item.value;if(item.type==='coins')state.player.coins+=item.value;addFeed(state,`Supply collected: ${item.type.toUpperCase()}`);const s=nearestFreeSpawn();item.x=s.x;item.y=s.y;burst(state,item.x,item.y,'#5dffa7',10,100);}}}
function updateParticles(state,dt){for(let i=state.particles.length-1;i>=0;i--){const q=state.particles[i];q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.94;q.vy*=.94;if(q.life<=0)state.particles.splice(i,1);}}

export function purchase(state,itemId){const item=SHOP.find(x=>x.id===itemId);if(!item||state.player.coins<item.cost)return false;state.player.coins-=item.cost;if(item.id==='armor')state.player.maxArmor+=25,state.player.armor=state.player.maxArmor;if(item.id==='med')state.player.hp=Math.min(state.player.maxHp,state.player.hp+35);else if(item.id==='ammo')Object.values(state.player.weapons).forEach(w=>w.reserve+=60);else addWeapon(state.player,item.id);addFeed(state,`Purchased ${item.title}`);return true;}

function drawGlowCircle(ctx,x,y,r,color,alpha=.2){ctx.save();ctx.globalAlpha=alpha;ctx.shadowBlur=r;ctx.shadowColor=color;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r*.42,0,TAU);ctx.fill();ctx.restore();}
function roundedRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):(ctx.rect(x,y,w,h));}
function drawActor(ctx,a,isPlayer=false){const color=isPlayer?'#53e7ff':'#ff667f';ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.angle);ctx.shadowBlur=18;ctx.shadowColor=color;ctx.fillStyle='rgba(8,12,18,.95)';ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,a.r,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,a.r*.48,0,TAU);ctx.fill();ctx.fillStyle='#071019';ctx.beginPath();ctx.arc(a.r*.05,0,a.r*.18,0,TAU);ctx.fill();ctx.fillStyle='#ccdce7';ctx.fillRect(17,-4,isPlayer?34:30,8);ctx.fillStyle=color;ctx.fillRect(23,-2,isPlayer?27:23,4);ctx.restore();
  const hp=Math.max(0,a.hp/a.maxHp);ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(a.x-a.r,a.y-a.r-13,a.r*2,4);ctx.fillStyle=isPlayer?'#57e7a4':'#ff667f';ctx.fillRect(a.x-a.r,a.y-a.r-13,a.r*2*hp,4);
}
function drawWorld(ctx,state,view){ctx.save();ctx.translate(view.cx,view.cy);ctx.scale(view.zoom,view.zoom);ctx.translate(-state.player.x,-state.player.y);ctx.fillStyle='#090d14';ctx.fillRect(0,0,WORLD.w,WORLD.h);
  ctx.strokeStyle='rgba(82,230,255,.055)';ctx.lineWidth=1;for(let x=0;x<WORLD.w;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,WORLD.h);ctx.stroke();}for(let y=0;y<WORLD.h;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD.w,y);ctx.stroke();}
  ctx.strokeStyle='rgba(82,230,255,.35)';ctx.lineWidth=5;ctx.shadowBlur=18;ctx.shadowColor='#1ac4df';ctx.strokeRect(WORLD.margin,WORLD.margin,WORLD.w-WORLD.margin*2,WORLD.h-WORLD.margin*2);ctx.shadowBlur=0;
  for(const wall of walls){ctx.fillStyle='#111a26';ctx.strokeStyle='rgba(126,177,205,.2)';ctx.lineWidth=2;roundedRect(ctx,wall.x,wall.y,wall.w,wall.h,10);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(82,230,255,.04)';for(let x=wall.x+15;x<wall.x+wall.w;x+=30)ctx.fillRect(x,wall.y+10,2,wall.h-20);}
  for(const item of state.pickups){const colors={health:'#5dffa7',armor:'#52e6ff',ammo:'#ffc857',coins:'#af8cff'};const c=colors[item.type];drawGlowCircle(ctx,item.x,item.y,28+Math.sin(item.phase)*3,c,.22);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.arc(item.x,item.y,15+Math.sin(item.phase)*2,0,TAU);ctx.stroke();ctx.fillStyle=c;ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText(item.type[0].toUpperCase(),item.x,item.y+4);}
  for(const pr of state.projectiles){for(let j=1;j<pr.trail.length;j++){const a=pr.trail[j-1],b=pr.trail[j];ctx.globalAlpha=j/pr.trail.length*.36;ctx.strokeStyle=pr.color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.globalAlpha=1;drawGlowCircle(ctx,pr.x,pr.y,12,pr.color,.25);ctx.fillStyle=pr.color;ctx.beginPath();ctx.arc(pr.x,pr.y,pr.r,0,TAU);ctx.fill();}
  for(const bot of state.bots)if(bot.respawn<=0)drawActor(ctx,bot,false);drawActor(ctx,state.player,true);
  for(const q of state.particles){ctx.globalAlpha=Math.max(0,q.life/q.maxLife);ctx.fillStyle=q.color;ctx.beginPath();ctx.arc(q.x,q.y,q.size,0,TAU);ctx.fill();}ctx.globalAlpha=1;ctx.restore();}

function drawMinimap(canvas,state){const ctx=canvas.getContext('2d');if(!ctx)return;const sx=canvas.width/WORLD.w,sy=canvas.height/WORLD.h;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='rgba(8,12,19,.9)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='rgba(82,230,255,.28)';ctx.strokeRect(1,1,canvas.width-2,canvas.height-2);ctx.fillStyle='#131e2a';for(const w of walls)ctx.fillRect(w.x*sx,w.y*sy,w.w*sx,w.h*sy);for(const b of state.bots)if(b.respawn<=0){ctx.fillStyle='#ff667f';ctx.fillRect(b.x*sx-2,b.y*sy-2,4,4);}ctx.fillStyle='#52e6ff';ctx.beginPath();ctx.arc(state.player.x*sx,state.player.y*sy,4,0,TAU);ctx.fill();}

export function renderGame(state,ctx,viewport){const w=ctx.canvas.width,h=ctx.canvas.height;ctx.clearRect(0,0,w,h);const zoom=Math.min(w/1050,h/680);const shake=(state.shake||0);const view={cx:w/2+(Math.random()-.5)*shake,cy:h/2+(Math.random()-.5)*shake,zoom};drawWorld(ctx,state,view);const g=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.12,w/2,h/2,Math.max(w,h)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.43)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}

function formatTime(t){const m=Math.floor(t/60),s=Math.floor(t%60);return `${m}:${String(s).padStart(2,'0')}`;}

export function createInput(canvas){const keys=new Set();const pointer={x:canvas.clientWidth/2,y:canvas.clientHeight/2,down:false,aim:false};let reload=false,shop=false;
  const keyMap={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',ShiftLeft:'sprint',ShiftRight:'sprint'};
  window.addEventListener('keydown',e=>{keys.add(e.code);if(e.code==='KeyR')reload=true;if(e.code==='KeyE')shop=true;if(e.code==='Escape')canvas.dispatchEvent(new CustomEvent('nexus-pause'));});
  window.addEventListener('keyup',e=>keys.delete(e.code));
  canvas.addEventListener('mousemove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;});
  canvas.addEventListener('mousedown',e=>{if(e.button===0)pointer.down=true;if(e.button===2)pointer.aim=true;canvas.requestPointerLock?.();});
  window.addEventListener('mouseup',e=>{if(e.button===0)pointer.down=false;if(e.button===2)pointer.aim=false;});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  const read=state=>{const rect=canvas.getBoundingClientRect();const mx=pointer.x-rect.left,my=pointer.y-rect.top;const dx=mx-rect.width/2,dy=my-rect.height/2;const angle=Math.atan2(dy,dx);const i={up:keys.has('KeyW')||keys.has('ArrowUp'),down:keys.has('KeyS')||keys.has('ArrowDown'),left:keys.has('KeyA')||keys.has('ArrowLeft'),right:keys.has('KeyD')||keys.has('ArrowRight'),sprint:keys.has('ShiftLeft')||keys.has('ShiftRight'),fire:pointer.down,aim:pointer.aim,mouseAngle:angle,reload,shop};reload=false;shop=false;return i;};
  return read;
}

function boot(){const canvas=document.getElementById('gameCanvas');const mini=document.getElementById('minimap');if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx){document.body.innerHTML='<main style="padding:40px;font-family:system-ui;color:#fff;background:#070910">Canvas 2D is unavailable in this browser. Enable hardware acceleration or use a modern browser.</main>';return;}
  const launcher=document.getElementById('launcher'),game=document.getElementById('game'),play=document.getElementById('playButton'),exit=document.getElementById('exitButton'),help=document.getElementById('helpButton'),helpPlay=document.getElementById('helpPlay'),dialog=document.getElementById('helpDialog'),closeHelp=document.getElementById('closeHelp');const pause=document.getElementById('pauseOverlay'),resume=document.getElementById('resumeButton'),shop=document.getElementById('shop'),closeShop=document.getElementById('closeShop');const state=createGameState();const input=createInput(canvas);let running=false,last=performance.now();
  const $=id=>document.getElementById(id);function resize(){const dpr=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.floor(r.width*dpr);canvas.height=Math.floor(r.height*dpr);ctx.setTransform(1,0,0,1,0,0);ctx.scale(dpr,dpr);}window.addEventListener('resize',resize);
  function showToast(text){const t=$('toast');t.textContent=text;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),1400);}
  function renderUI(){const p=state.player,gun=p.weapons[p.weapon],w=WEAPONS[p.weapon];$('hpValue').textContent=Math.ceil(p.hp);$('armorValue').textContent=Math.ceil(p.armor);$('hpBar').style.width=`${p.hp/p.maxHp*100}%`;$('armorBar').style.width=`${p.armor/p.maxArmor*100}%`;$('weaponName').textContent=w.name;$('ammoValue').textContent=gun.reloading>0?'…':gun.mag;$('reserveValue').textContent=gun.reserve;$('timeValue').textContent=formatTime(state.time);$('killValue').textContent=`${p.kills} KILLS`;$('scoreValue').textContent=`${state.score} PTS`;$('crosshair').classList.toggle('aim',p.aiming);$('coinValue').textContent=`${p.coins}¢`;const f=$('feed');f.innerHTML=state.feed.map((x,i)=>`<div class="score-entry"><span>${x}</span><b>#${i+1}</b></div>`).join('');drawMinimap(mini,state);}
  function populateShop(){const host=$('shopItems');host.innerHTML=SHOP.map(item=>`<div class="shop-item"><div><strong>${item.title}</strong><small>${item.text} · ${item.cost}¢</small></div><button class="buy" data-buy="${item.id}">BUY</button></div>`).join('');host.querySelectorAll('[data-buy]').forEach(btn=>btn.addEventListener('click',()=>{if(purchase(state,btn.dataset.buy))showToast('PURCHASE COMPLETE');else showToast('NOT ENOUGH COINS');renderUI();}));}
  function begin(){launcher.classList.add('hidden');game.classList.remove('hidden');running=true;resize();canvas.focus();canvas.requestPointerLock?.();last=performance.now();requestAnimationFrame(loop);}
  function end(){running=false;document.exitPointerLock?.();game.classList.add('hidden');launcher.classList.remove('hidden');}
  function togglePause(){state.paused=!state.paused;pause.classList.toggle('hidden',!state.paused);}
  canvas.addEventListener('nexus-pause',togglePause);resume.addEventListener('click',togglePause);closeShop.addEventListener('click',()=>{state.shopOpen=false;shop.classList.add('hidden');});
  play.addEventListener('click',begin);helpPlay.addEventListener('click',()=>{dialog.close();begin();});help.addEventListener('click',()=>dialog.showModal());closeHelp.addEventListener('click',()=>dialog.close());exit.addEventListener('click',end);populateShop();
  function loop(now){if(!running)return;const dt=(now-last)/1000;last=now;const inp=input(state);if(inp.shop){state.shopOpen=!state.shopOpen;shop.classList.toggle('hidden',!state.shopOpen);}updateGame(state,state.shopOpen?{up:false,down:false,left:false,right:false,sprint:false,fire:false,aim:state.player.aiming,mouseAngle:state.player.angle,reload:false,shop:false}:inp,dt);renderGame(state,ctx,{w:canvas.clientWidth,h:canvas.clientHeight});renderUI();if(state.matchOver){$('matchStatus').textContent='MATCH COMPLETE';$('centerMessage').textContent=`MATCH COMPLETE · ${state.score} PTS`;$('centerMessage').classList.remove('hidden');}else if(state.killBanner>0){$('centerMessage').textContent='TARGET DOWN +100';$('centerMessage').classList.remove('hidden');}else $('centerMessage').classList.add('hidden');requestAnimationFrame(loop);}
  resize();
}
if(typeof document!=='undefined')window.addEventListener('DOMContentLoaded',boot);
