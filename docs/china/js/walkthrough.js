/* walkthrough.js — the master presentation controller.
   ONE authoritative clock. Scenes, map changes, subtitles, narration, music and the
   video segment are all derived from it, so nothing can drift apart. */
import {SCENES, ACTS, RUNTIME, cuesFor} from './data/script.js';
import * as Map from './mapview.js';
import * as Audio from './audio.js';
import {stageFor} from './stages.js';

const CUES = SCENES.flatMap(s => cuesFor(s).map(c => ({...c, scene:s.id})));

const fmt = t => `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;

export const WT = {
  running:false, paused:false, t:0,
  _raf:null, _t0:0, _acc:0, _scene:null, _cue:null, _spoken:new Set(),
  onExit:()=>{}, onSceneChange:()=>{}
};

let elWt, elAct, elScene, elBar, elTime, elSubs, elSubSpan, elVideo, elVideoWrap, elPaused, elSkip, elPlay;

let idleTimer=null;
function wake(){
  document.body.classList.remove('wt-idle');
  clearTimeout(idleTimer);
  if(WT.running && !WT.paused) idleTimer=setTimeout(()=>document.body.classList.add('wt-idle'), 2600);
}
export function mount(opts={}){
  window.__wt = WT;
  ['mousemove','pointerdown','keydown','wheel','touchstart'].forEach(ev=>
    document.addEventListener(ev, wake, {passive:true}));
  WT.onExit = opts.onExit || (()=>{});
  elWt=document.getElementById('wt'); elAct=document.getElementById('wt-act');
  elScene=document.getElementById('wt-scene'); elBar=document.getElementById('wt-bar');
  elTime=document.getElementById('wt-time'); elSubs=document.getElementById('subs');
  elSubSpan=elSubs.querySelector('span'); elVideo=document.getElementById('wt-video');
  elVideoWrap=document.getElementById('wt-video-wrap'); elPaused=document.getElementById('wt-paused');
  elSkip=document.querySelector('#wt-controls [data-a="skipv"]');
  elPlay=document.querySelector('#wt-controls [data-a="play"]');

  // scene ticks on the progress bar
  const ticks=document.getElementById('wt-ticks');
  ticks.innerHTML = ACTS.map(a=>`<i style="left:${(a.from/RUNTIME*100).toFixed(2)}%"></i>`).join('');

  document.getElementById('wt-progress').addEventListener('click', e=>{
    const r=e.currentTarget.getBoundingClientRect();
    seek(Math.max(0,Math.min(RUNTIME-0.1,(e.clientX-r.left)/r.width*RUNTIME)));
  });
  document.querySelectorAll('#wt-controls button').forEach(b=>{
    b.addEventListener('click',()=>action(b.dataset.a,b));
  });
  document.getElementById('wt-resume').addEventListener('click', ()=>{ hideExploreHold(); resume(); });
  elVideo.addEventListener('error', ()=>{ videoFallback(); });
  const ld=document.getElementById('wt-loading');
  const hideLoad=()=>{ if(ld) ld.classList.add('hidden'); };
  elVideo.addEventListener('canplay', hideLoad);
  elVideo.addEventListener('playing', hideLoad);
  elVideo.addEventListener('error', hideLoad);
  // start fetching the video as soon as the walkthrough is mounted, not when it is needed
  if(!elVideo.src) elVideo.src = 'media/shenzhen.mp4';
  document.addEventListener('keydown', e=>{
    if(!WT.running) return;
    if(e.key===' '){ e.preventDefault(); WT.paused?resume():pause(); }
    if(e.key==='ArrowRight') nextScene();
    if(e.key==='ArrowLeft') prevScene();
    if(e.key==='Escape') stop();
  });
}

function action(a,btn){
  if(a==='play'){ WT.paused?resume():pause(); }
  if(a==='prev') prevScene();
  if(a==='next') nextScene();
  if(a==='restart') seek(0);
  if(a==='exit') stop();
  if(a==='skipv') skipVideo();
  if(a==='subs'){ Audio.state.subtitles=!Audio.state.subtitles; btn.classList.toggle('on',Audio.state.subtitles);
    elSubs.classList.toggle('off',!Audio.state.subtitles); }
  if(a==='narr'){ Audio.setNarration(!Audio.state.narration); btn.classList.toggle('on',Audio.state.narration);
    if(!Audio.state.narration) Audio.pauseVO();
    else if(WT._scene) Audio.narrateScene(WT._scene.id, WT.t - WT._scene.t); }
  if(a==='music'){ Audio.setMusic(!Audio.state.music); btn.classList.toggle('on',Audio.state.music); }
}

const PREROLL = 3400;   // title card, before the master clock starts

export function start(){
  /* Audio must be unlocked inside the click gesture, so init and start the
     score here; the score plays under the title card and the narration begins
     with the first scene. */
  Audio.init(); Audio.resume(); Audio.pickVoice();
  Audio.setMusic(Audio.state.music); Audio.startMusic();

  WT.running=true; WT.paused=false; WT.pre=true;
  WT.t=0; WT._acc=0;
  WT._scene=null; WT._cue=null; WT._spoken.clear();
  elWt.classList.remove('hidden');
  document.body.classList.add('wt-on','wt-pre');
  document.getElementById('mode-pill').textContent='Automatic Walkthrough';

  const card = document.getElementById('wt-title');
  if(card){ card.style.animation='none'; void card.offsetWidth; card.style.animation=''; }

  clearTimeout(WT._pre);
  WT._pre = setTimeout(()=>{ if(WT.running && WT.pre) begin(); }, PREROLL);
}

function begin(){
  WT.pre=false;
  document.body.classList.remove('wt-pre');
  WT.t=0; WT._acc=0; WT._t0=performance.now();
  wake();
  loop();
}
export function stop(){
  WT.running=false; WT.pre=false; clearTimeout(WT._pre);
  document.body.classList.remove('wt-pre');
  cancelAnimationFrame(WT._raf);
  Audio.stopMusic(); Audio.stopVO(); Audio.shutUp(); hideVideo(); hideExploreHold();
  elWt.classList.add('hidden');
  clearTimeout(idleTimer);
  document.body.classList.remove('wt-on','wt-video','wt-idle');
  document.getElementById('scene-art').innerHTML='';
  document.getElementById('mode-pill').textContent='Explore Mode';
  WT.onExit();
}
export function pause(){
  if(!WT.running||WT.paused||WT.pre) return;
  WT.paused=true; WT._acc += performance.now()-WT._t0;
  clearTimeout(idleTimer); document.body.classList.remove('wt-idle');
  cancelAnimationFrame(WT._raf);
  Audio.pauseVO(); Audio.shutUp(); if(!elVideo.paused) elVideo.pause();
  elPlay.textContent='▶';
}
export function resume(){
  if(WT.pre) return;
  if(!WT.running||!WT.paused) return;
  WT.paused=false; WT._t0=performance.now();
  Audio.resume(); wake();
  if(WT._scene) Audio.narrateScene(WT._scene.id, WT.t - WT._scene.t);
  if(inVideo()) elVideo.play().catch(()=>{});
  elPlay.textContent='⏸';
  loop();
}
/* Exploring mid-presentation: hold position, show a resume affordance. */
export function holdForExplore(){
  if(!WT.running || WT.paused) return false;
  pause(); elPaused.classList.add('hidden'); return true;
}
export function showExploreHold(){ if(WT.running&&WT.paused) elPaused.classList.remove('hidden'); }
export function hideExploreHold(){ elPaused.classList.add('hidden'); }

export function seek(t){
  if(WT.pre) return;
  WT.t=Math.max(0,Math.min(RUNTIME,t));
  WT._acc=WT.t*1000; WT._t0=performance.now();
  WT._scene=null; WT._cue=null; WT._spoken.clear();
  Audio.stopVO(); Audio.shutUp(); hideVideo();
  if(WT.paused){ WT.paused=false; elPlay.textContent='⏸'; loop(); }
  render(WT.t);
}
export function nextScene(){
  const i=SCENES.findIndex(s=>s.id===(WT._scene&&WT._scene.id));
  seek(i<SCENES.length-1 ? SCENES[i+1].t : RUNTIME-0.2);
}
export function prevScene(){
  const i=SCENES.findIndex(s=>s.id===(WT._scene&&WT._scene.id));
  const cur=SCENES[i];
  // restart current scene if we're more than 2s into it, else go back one
  seek((WT.t-cur.t>2 || i<=0) ? cur.t : SCENES[i-1].t);
}

function loop(){
  if(!WT.running||WT.paused) return;
  WT.t = (WT._acc + (performance.now()-WT._t0))/1000;
  if(WT.t>=RUNTIME){ finish(); return; }
  render(WT.t);
  WT._raf=requestAnimationFrame(loop);
}

function render(t){
  // ---- scene ----
  let sc=SCENES[0];
  for(let i=SCENES.length-1;i>=0;i--) if(t>=SCENES[i].t){ sc=SCENES[i]; break; }
  if(!WT._scene || WT._scene.id!==sc.id) applyScene(sc);

  // ---- chrome ----
  elBar.style.width=(t/RUNTIME*100).toFixed(2)+'%';
  elTime.textContent=`${fmt(t)} / ${fmt(RUNTIME)}`;

  // ---- subtitles + narration ----
  let cue=null;
  for(const c of CUES) if(t>=c.t && t<c.t+c.d){ cue=c; break; }
  if(cue!==WT._cue){
    WT._cue=cue;
    elSubSpan.textContent = cue ? cue.text : '';
    elSubs.style.visibility = cue ? 'visible' : 'hidden';
    if(cue && !WT._spoken.has(cue.t+cue.text)){
      WT._spoken.add(cue.t+cue.text);
      Audio.speak(cue.text);
    }
  }
  // ---- video window ----
  if(inVideo()){ if(elVideoWrap.classList.contains('hidden')) showVideo(sc); }
  else if(!elVideoWrap.classList.contains('hidden')) hideVideo();
}

function applyScene(sc){
  WT._scene=sc;
  const act=ACTS.find(a=>a.id===sc.act);
  elAct.textContent=act?act.name:'';
  if(act&&act.c) document.documentElement.style.setProperty('--act', act.c);
  elScene.textContent=sc.title;
  Audio.setMood(sc.act);
  Audio.narrateScene(sc.id, WT.t - sc.t);
  Map.setPeriod(sc.period);
  if(sc.focus) Map.setCamera(sc.focus[0], sc.focus[1], sc.focus[2]);
  document.getElementById('scene-art').innerHTML = sc.stage ? stageFor(sc.stage) : '';
  elSkip.classList.toggle('hidden', !sc.video);
  WT.onSceneChange(sc);
}

/* ---------- video segment ---------- */
const videoScene = () => SCENES.find(s=>s.video);
function inVideo(){
  const v=videoScene();
  return v && WT.t>=v.t+1.6 && WT.t<v.t+v.d-1.2 && !WT._videoSkipped;
}
function showVideo(sc){
  elVideoWrap.classList.remove('hidden');
  document.body.classList.add('wt-video');
  const v=videoScene();
  if(!elVideo.src) elVideo.src='media/shenzhen.mp4';
  const into=Math.max(0, WT.t-(v.t+1.6));
  try{ if(Math.abs(elVideo.currentTime-into)>0.6) elVideo.currentTime=into; }catch(e){}
  elVideo.play().catch(()=>{ /* autoplay blocked: poster + subtitles still carry it */ });
}
function hideVideo(){ elVideoWrap.classList.add('hidden'); document.body.classList.remove('wt-video'); try{elVideo.pause();}catch(e){} }
function skipVideo(){
  const v=videoScene(); if(!v) return;
  WT._videoSkipped=true; hideVideo(); seek(v.t+v.d-1.0);
}
function videoFallback(){
  WT._videoSkipped=true; hideVideo();
  const art=document.getElementById('scene-art');
  art.innerHTML = stageFor('shenzhen-now');
}

function finish(){
  WT.running=false; cancelAnimationFrame(WT._raf);
  elBar.style.width='100%'; elTime.textContent=`${fmt(RUNTIME)} / ${fmt(RUNTIME)}`;
  Audio.stopVO(); Audio.shutUp(); Audio.stopMusic(); hideVideo();
  elSubSpan.textContent='';
  document.getElementById('scene-art').innerHTML = stageFor('finale');
  elScene.textContent='Complete — press ⟲ to replay, or Explore';
  elPlay.textContent='▶';
}
