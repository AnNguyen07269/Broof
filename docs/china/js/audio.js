/* audio.js — original synthesised score + narration.
   Music is generated live with the Web Audio API (nothing sampled, nothing licensed).
   Narration uses the browser speech engine, and will prefer a recorded MP3
   at media/vo/<sceneId>.mp3 if one is dropped in — see README. */

let ctx=null, master=null, musicGain=null, started=false;
export const state = { music:true, narration:true, subtitles:true, voice:null };

/* Recorded narration is present in media/vo/ (s01.mp3 … s26.mp3). */
export const USE_VO = true;
/* Set true after saving a licensed track to media/music/theme.mp3. */
export const USE_TRACK = false;


export function init(){
  if(ctx) return ctx;
  try{
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value=0.9; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value=0.0; musicGain.connect(master);
  }catch(e){ ctx=null; }
  return ctx;
}
export function resume(){ if(ctx && ctx.state==='suspended') ctx.resume(); }

/* ---------------- original score ----------------
   Written for this project. Slow yu (羽) pentatonic, bowed lead over a choir pad,
   with a low taiko pulse that builds and recedes across the acts — the shape that
   makes this kind of music feel large. It is an original composition, not an
   arrangement of any existing song.

   To use a track you have licensed instead: save it as media/music/theme.mp3 and
   set USE_TRACK = true below. */

const YU = [220.00, 261.63, 293.66, 329.63, 392.00];     // A C D E G
const hz = (deg, oct=0) => YU[((deg % 5) + 5) % 5] * Math.pow(2, oct + Math.floor(deg/5));

/* [degree, octave, beats] — the melody, in three phrases: ask, soar, settle. */
const MELODY = [
  // phrase A — low, questioning
  [0,0,2],[1,0,1],[2,0,1],   [3,0,3],[2,0,1],   [1,0,2],[0,0,2],   [4,-1,4],
  // phrase B — the lift
  [3,0,1],[4,0,1],[0,1,2],   [4,0,2],[3,0,2],   [2,0,3],[1,0,1],   [2,0,4],
  // phrase C — descent and rest
  [0,1,2],[4,0,2],           [3,0,2],[2,0,2],   [1,0,1],[2,0,1],[3,0,2],  [0,0,4]
];
const BEAT = 1.06;                                        // ~57 bpm
let mi = 0, nextAt = 0, bar = 0;

/* per-act colour: register, how much drum, how much choir */
const MOOD = {
  open:  {oct:0, drum:0.00, choir:0.30, bright:2200, lead:0.16},
  ancient:{oct:0, drum:0.35, choir:0.45, bright:2000, lead:0.19},
  change:{oct:0, drum:0.55, choir:0.60, bright:2400, lead:0.21},
  reform:{oct:0, drum:0.85, choir:0.70, bright:2900, lead:0.23},
  modern:{oct:1, drum:0.75, choir:0.65, bright:3300, lead:0.21},
  future:{oct:1, drum:0.30, choir:0.50, bright:3800, lead:0.18},
  end:   {oct:0, drum:0.45, choir:0.80, bright:2100, lead:0.22}
};
let mood = MOOD.open;

/* bowed sustained lead with a slow vibrato — the "erhu" voice */
function lead(t, f, gain, dur, bright){
  if(!ctx) return;
  const g=ctx.createGain(), lp=ctx.createBiquadFilter();
  lp.type='lowpass'; lp.frequency.setValueAtTime(bright*0.5,t);
  lp.frequency.linearRampToValueAtTime(bright, t+dur*0.3);
  lp.frequency.linearRampToValueAtTime(bright*0.45, t+dur);
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(gain, t+Math.min(0.5,dur*0.28));   // slow bow
  g.gain.setValueAtTime(gain, t+dur*0.68);
  g.gain.exponentialRampToValueAtTime(0.0008, t+dur);
  const vib=ctx.createOscillator(), vamp=ctx.createGain();
  vib.frequency.value=5.1; vamp.gain.value=f*0.006;
  vib.connect(vamp);
  [[0,'triangle',1],[0.07,'sine',0.5],[-0.07,'sine',0.4]].forEach(([det,type,lvl])=>{
    const o=ctx.createOscillator(), og=ctx.createGain();
    o.type=type; o.frequency.value=f; o.detune.value=det*100; og.gain.value=lvl;
    vamp.connect(o.frequency);
    o.connect(og); og.connect(lp); o.start(t); o.stop(t+dur+0.1);
  });
  vib.start(t); vib.stop(t+dur+0.1);
  lp.connect(g); g.connect(musicGain);
}
/* plucked string, for motion underneath the lead */
function pluck(t, f, gain=0.09, dur=2.2, bright=2600){
  if(!ctx) return;
  const o=ctx.createOscillator(), g=ctx.createGain(), lp=ctx.createBiquadFilter();
  o.type='triangle'; o.frequency.value=f;
  lp.type='lowpass'; lp.frequency.setValueAtTime(bright,t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(300,bright*0.22), t+dur);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(gain,t+0.007);
  g.gain.exponentialRampToValueAtTime(0.0005,t+dur);
  o.connect(lp); lp.connect(g); g.connect(musicGain);
  o.start(t); o.stop(t+dur+0.05);
}
/* wide choir-ish pad */
function choir(t, f, dur, level){
  if(!ctx || level<=0.01) return;
  const g=ctx.createGain(), lp=ctx.createBiquadFilter();
  lp.type='lowpass'; lp.frequency.setValueAtTime(500,t);
  lp.frequency.linearRampToValueAtTime(1150,t+dur*0.45);
  lp.frequency.linearRampToValueAtTime(460,t+dur);
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(0.052*level, t+dur*0.4);
  g.gain.linearRampToValueAtTime(0, t+dur);
  [[1,0],[1,-8],[1,11],[1.5,4],[2,-5]].forEach(([mult,det])=>{
    const o=ctx.createOscillator(); o.type='sawtooth';
    o.frequency.value=f*mult; o.detune.value=det;
    const og=ctx.createGain(); og.gain.value = mult===1?0.5:0.22;
    o.connect(og); og.connect(lp); o.start(t); o.stop(t+dur+0.12);
  });
  lp.connect(g); g.connect(musicGain);
}
/* low taiko-style hit: pitched thump plus a short noise transient */
function drum(t, level, deep=true){
  if(!ctx || level<=0.02) return;
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.type='sine';
  o.frequency.setValueAtTime(deep?104:150,t);
  o.frequency.exponentialRampToValueAtTime(deep?44:62, t+0.26);
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(0.30*level, t+0.006);
  g.gain.exponentialRampToValueAtTime(0.0008, t+0.5);
  o.connect(g); g.connect(musicGain); o.start(t); o.stop(t+0.56);
  const n=ctx.createBufferSource(), buf=ctx.createBuffer(1, 2400, ctx.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
  n.buffer=buf;
  const ng=ctx.createGain(); ng.gain.value=0.07*level;
  const hp=ctx.createBiquadFilter(); hp.type='bandpass'; hp.frequency.value=1600;
  n.connect(hp); hp.connect(ng); ng.connect(musicGain); n.start(t);
}
function schedule(){
  if(!ctx || !state.music || usingTrack) return;
  while(nextAt < ctx.currentTime + 1.0){
    const [deg, oct, beats] = MELODY[mi % MELODY.length];
    const dur = beats*BEAT;
    lead(nextAt, hz(deg, oct+mood.oct), mood.lead, dur*0.94, mood.bright);
    if(beats >= 2 && Math.random() < 0.5)
      pluck(nextAt + dur*0.5, hz(deg, oct+mood.oct-1), 0.05, 1.8, mood.bright*0.8);
    // chord bed changes every 8 beats
    if(bar % 8 === 0) choir(nextAt, hz(0, mood.oct-1), 8*BEAT, mood.choir);
    if(bar % 8 === 4) choir(nextAt, hz(2, mood.oct-1), 8*BEAT, mood.choir*0.85);
    // pulse: strong on 1, ghost on 3
    for(let b=0;b<beats;b++){
      const at = nextAt + b*BEAT, pos = (bar + b) % 4;
      if(pos===0) drum(at, mood.drum, true);
      else if(pos===2) drum(at, mood.drum*0.45, false);
    }
    nextAt += dur; mi++; bar += beats;
  }
}
let timer2=null, usingTrack=false, trackEl=null;
export function startMusic(){
  if(!ctx || started) return;
  started=true;
  if(USE_TRACK && !trackEl){
    trackEl = new Audio('media/music/theme.mp3');
    trackEl.loop = true; trackEl.volume = 0.0;
    trackEl.addEventListener('canplay', ()=>{ usingTrack = true; }, {once:true});
    trackEl.addEventListener('error', ()=>{ usingTrack = false; }, {once:true});
  }
  if(usingTrack){ trackEl.volume=0.34; trackEl.play().catch(()=>{}); return; }
  mi=0; bar=0; nextAt=ctx.currentTime+0.2;
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.setValueAtTime(0, ctx.currentTime);
  musicGain.gain.linearRampToValueAtTime(0.52, ctx.currentTime+4.0);
  timer2 = setInterval(schedule, 220);
}
export function stopMusic(){
  if(!ctx) return;
  clearInterval(timer2); timer2=null; started=false;
  if(trackEl){ try{ trackEl.pause(); }catch(e){} }
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.linearRampToValueAtTime(0, ctx.currentTime+1.2);
}
export function setMood(actId){ mood = MOOD[actId] || MOOD.open; }
export function duck(on){
  if(!ctx||!musicGain) return;
  if(usingTrack && trackEl){ trackEl.volume = on?0.10:0.34; return; }
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.linearRampToValueAtTime(on?0.14:0.52, ctx.currentTime+0.6);
}
export function setMusic(on){
  state.music=on;
  if(usingTrack && trackEl){ on? trackEl.play().catch(()=>{}) : trackEl.pause(); return; }
  if(!ctx) return;
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.linearRampToValueAtTime(on?0.52:0, ctx.currentTime+0.5);
}

export function pickVoice(){
  if(!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  if(!vs.length) return;
  const pref = ['Google UK English Male','Google UK English Female','Daniel','Google US English'];
  state.voice = vs.find(v=>pref.includes(v.name))
             || vs.find(v=>/en-GB/i.test(v.lang))
             || vs.find(v=>/^en/i.test(v.lang)) || vs[0];
}
if('speechSynthesis' in window){ speechSynthesis.onvoiceschanged = pickVoice; }

/* ---- recorded narration, driven by the master clock ----
   One clip per scene in media/vo/<sceneId>.mp3. The walkthrough tells us the scene
   and how far into it the clock is, so pause/resume/seek all stay in sync. */
let voEl=null, voScene=null, voFailed=new Set();
function voNode(){
  if(!voEl){
    voEl = new Audio();
    voEl.id = 'vo-player';
    try{ document.body.appendChild(voEl); }catch(e){}
    voEl.preload = 'auto';
    voEl.addEventListener('playing', ()=>duck(true));
    voEl.addEventListener('pause',   ()=>duck(false));
    voEl.addEventListener('ended',   ()=>duck(false));
    voEl.addEventListener('error',   ()=>{ if(voScene) voFailed.add(voScene); duck(false); });
  }
  return voEl;
}
/* Play (or re-seek) the clip for a scene. offset = seconds already elapsed in that scene. */
export function narrateScene(sceneId, offset=0){
  if(!USE_VO || !state.narration) return false;
  if(voFailed.has(sceneId)) return false;
  const el = voNode();
  try{
    if(voScene !== sceneId){
      voScene = sceneId;
      el.src = `media/vo/${sceneId}.mp3`;
      el.load();
    }
    const seek = Math.max(0, offset);
    const apply = ()=>{ try{ if(Math.abs(el.currentTime-seek)>0.25) el.currentTime=seek; }catch(e){} 
                        el.play().catch(()=>{}); };
    if(el.readyState >= 1) apply();
    else el.addEventListener('loadedmetadata', apply, {once:true});
    return true;
  }catch(e){ return false; }
}
export function pauseVO(){ if(voEl){ try{ voEl.pause(); }catch(e){} } duck(false); }
export function stopVO(){ if(voEl){ try{ voEl.pause(); voEl.currentTime=0; }catch(e){} } voScene=null; duck(false); }
export function voActive(){ return USE_VO && state.narration; }

/* Live speech synthesis — the fallback when no recorded clips are present. */
export function speak(text){
  if(USE_VO) return;                       // recorded narration is driving
  if(!state.narration || !('speechSynthesis' in window)) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if(state.voice) u.voice = state.voice;
    u.rate = 0.96; u.pitch = 1.0; u.volume = 1.0;
    u.onstart = ()=>duck(true);
    u.onend   = ()=>duck(false);
    speechSynthesis.speak(u);
  }catch(e){ /* subtitles carry the story */ }
}

export function shutUp(){
  if('speechSynthesis' in window){ try{ speechSynthesis.cancel(); }catch(e){} }
  stopVO(); duck(false);
}
export function setNarration(on){ state.narration=on; if(!on) shutUp(); }
export function narrationAvailable(){ return 'speechSynthesis' in window; }
