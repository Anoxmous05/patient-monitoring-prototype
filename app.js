// Patient Monitoring Prototype (Simulated)
// Config
const BREACH_SECONDS = 10; // trigger after sustained breach

// State
let thresholds = JSON.parse(localStorage.getItem('thresholds')||'{}');
let log = JSON.parse(localStorage.getItem('alertLog')||'[]');
let breachCounters = { hr:0, sbp:0, spo2:0, rr:0 };
let current = { hr:80, sbp:120, dbp:80, spo2:98, rr:16 };
let alertActive = false;
let alertMsg = '';
let ackBy = null;

// Elements
const hrVal = document.getElementById('hrVal');
const bpVal = document.getElementById('bpVal');
const spo2Val = document.getElementById('spo2Val');
const rrVal = document.getElementById('rrVal');
const pstatus = document.getElementById('pstatus');
const alertBar = document.getElementById('alertBar');
const alertMsgEl = document.getElementById('alertMsg');
const ackBtn = document.getElementById('ackBtn');
const logTblBody = document.querySelector('#logTbl tbody');

// Threshold form
const form = document.getElementById('thresholdForm');
['hrMin','hrMax','sbpMin','sbpMax','spo2Min','rrMax'].forEach(id=>{
  const el = document.getElementById(id);
  if(thresholds[id]!==undefined) el.value = thresholds[id];
});

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  ['hrMin','hrMax','sbpMin','sbpMax','spo2Min','rrMax'].forEach(id=>{
    thresholds[id] = Number(document.getElementById(id).value);
  });
  localStorage.setItem('thresholds', JSON.stringify(thresholds));
  toast('Thresholds saved');
});

// Simulate vitals (random walk with bounds)
function step(value, min, max, vol=2){
  let v = value + (Math.random()*2-1)*vol;
  return Math.max(min, Math.min(max, v));
}

function updateVitals(){
  current.hr = Math.round(step(current.hr, 40, 160, 4));
  current.dbp = Math.round(step(current.dbp, 50, 110, 3));
  current.sbp = Math.round(step(current.sbp, 80, 200, 4));
  current.spo2 = Math.round(step(current.spo2, 85, 100, 1.2));
  current.rr = Math.round(step(current.rr, 8, 36, 1.2));

  hrVal.textContent = current.hr;
  bpVal.textContent = current.sbp + '/' + current.dbp;
  spo2Val.textContent = current.spo2;
  rrVal.textContent = current.rr;

  checkBreach();
}

function checkBreach(){
  const t = thresholds;
  let breached = [];

  if(t.hrMin && current.hr < t.hrMin) { breachCounters.hr++; breached.push(`HR low (${current.hr})`); }
  else if(t.hrMax && current.hr > t.hrMax) { breachCounters.hr++; breached.push(`HR high (${current.hr})`); }
  else breachCounters.hr = 0;

  if(t.sbpMin && current.sbp < t.sbpMin) { breachCounters.sbp++; breached.push(`SBP low (${current.sbp})`); }
  else if(t.sbpMax && current.sbp > t.sbpMax) { breachCounters.sbp++; breached.push(`SBP high (${current.sbp})`); }
  else breachCounters.sbp = 0;

  if(t.spo2Min && current.spo2 < t.spo2Min) { breachCounters.spo2++; breached.push(`SpO₂ low (${current.spo2}%)`); }
  else breachCounters.spo2 = 0;

  if(t.rrMax && current.rr > t.rrMax) { breachCounters.rr++; breached.push(`RR high (${current.rr}/min)`); }
  else breachCounters.rr = 0;

  const anySustained = Object.values(breachCounters).some(c => c >= BREACH_SECONDS);
  if(anySustained){
    let which = Object.entries(breachCounters).filter(([k,v])=>v>=BREACH_SECONDS).map(([k])=>k).join(', ');
    triggerAlert(`Sustained threshold breach: ${which}. Latest: ${breached.join('; ')}`);
  } else if(!breached.length){
    clearAlert();
  }

  if(breached.length){
    pstatus.textContent = 'ALERT';
    pstatus.classList.remove('ok'); pstatus.classList.add('bad');
  } else {
    pstatus.textContent = 'OK';
    pstatus.classList.add('ok'); pstatus.classList.remove('bad');
  }
}

function triggerAlert(msg){
  if(alertActive && alertMsg===msg) return;
  alertActive = true;
  alertMsg = msg;
  alertMsgEl.textContent = msg;
  alertBar.classList.remove('hidden');
  beep();
  addLog('P-001','Demo Patient', msg);
}

function clearAlert(){
  alertActive = false;
  alertMsg = '';
  alertBar.classList.add('hidden');
}

ackBtn.addEventListener('click', ()=>{
  ackBy = prompt('Enter your name to acknowledge:');
  if(!ackBy) return;
  // Update last log entry ack field
  if(log.length>0){
    log[log.length-1].ackBy = ackBy;
    persistLog();
    renderLog();
  }
  clearAlert();
  toast('Alert acknowledged');
});

function addLog(pid, pname, message){
  const entry = {
    time: new Date().toISOString(),
    patient: `${pid} / ${pname}`,
    metric: 'threshold',
    value: `${current.hr}|${current.sbp}/${current.dbp}|${current.spo2}|${current.rr}`,
    message,
    ackBy: ''
  };
  log.push(entry);
  persistLog();
  renderLog();
}

function persistLog(){
  localStorage.setItem('alertLog', JSON.stringify(log));
}

function renderLog(){
  logTblBody.innerHTML = '';
  for(const e of log.slice(-200)){
    const tr = document.createElement('tr');
    const t = new Date(e.time);
    tr.innerHTML = `<td>${t.toLocaleString()}</td>
      <td>${e.patient}</td>
      <td>${e.metric}</td>
      <td>${e.value}</td>
      <td>${e.message}</td>
      <td>${e.ackBy||''}</td>`;
    logTblBody.appendChild(tr);
  }
}
renderLog();

// Simulate SMS/Email
document.getElementById('simulateSms').addEventListener('click', ()=>{
  toast('Simulated SMS sent to on-call nurse.');
});
document.getElementById('simulateEmail').addEventListener('click', ()=>{
  toast('Simulated Email sent to ward distribution list.');
});
document.getElementById('clearLog').addEventListener('click', ()=>{
  if(confirm('Clear local log?')){
    log = [];
    persistLog();
    renderLog();
  }
});

// Simple toast
let toastEl;
function toast(msg){
  if(!toastEl){
    toastEl = document.createElement('div');
    toastEl.style.position='fixed';
    toastEl.style.bottom='20px';
    toastEl.style.right='20px';
    toastEl.style.background='#1e293b';
    toastEl.style.border='1px solid #334155';
    toastEl.style.padding='10px 12px';
    toastEl.style.borderRadius='10px';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.style.opacity = 1;
  setTimeout(()=>toastEl.style.opacity=0, 1800);
}

// Beep using WebAudio API
function beep(){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type='sine'; o.frequency.value = 880;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    o.start();
    setTimeout(()=>{o.stop(); ctx.close();}, 600);
  }catch(e){/* ignore */}
}

// Run
setInterval(updateVitals, 1000);
updateVitals();
