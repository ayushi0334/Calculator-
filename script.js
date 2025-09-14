const display = document.getElementById('display');
const keys = document.getElementById('keys');

const allowed = /^[0-9+\-*/(). %]*$/; // basic safety

function set(val){ display.value = val; }
function append(txt){
  if(display.value === 'Error') set('');
  set(display.value + txt);
}
function clearAll(){ set(''); }
function back(){ set(display.value.slice(0, -1)); }

function calc(){
  try{
    let exp = display.value.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');
    if(!allowed.test(exp)) return set('Error');
    // avoid leading operators misuse
    if(/[*\/+.\-]{2,}/.test(exp)) exp = exp.replace(/([*\/+.\-]){2,}/g,'$1');
    const ans = Function(`"use strict"; return (${exp||0})`)();
    set(Number.isFinite(ans) ? String(ans) : 'Error');
  }catch{ set('Error'); }
}

// clicks
keys.addEventListener('click', e=>{
  const k = e.target.dataset.k;
  if(!k) return;
  if(k === 'C') return clearAll();
  if(k === 'BACK') return back();
  if(k === '=') return calc();
  append(k);
});

// keyboard
window.addEventListener('keydown', e=>{
  if(e.key === 'Enter') return calc();
  if(e.key === 'Escape') return clearAll();
  if(e.key === 'Backspace') return back();
  const map = {'x':'*','X':'*'};
  const k = map[e.key] ?? e.key;
  if(allowed.test(k)) append(k);
});
