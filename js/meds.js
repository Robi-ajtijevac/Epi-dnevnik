// Lijekovi
const MK="dnevnikSimptoma.meds";
const meds=()=>{const m=rd(MK,"{}");m.list=m.list||[];m.d=m.d||{};return m};
const takenDays=m=>Object.keys(m.d).filter(k=>Object.values(m.d[k]).some(r=>r.m||r.e)).sort();
function medStat(k){const m=meds(),d=m.d[k]||{},act=m.list.filter(x=>x.f<=k);let g=0;act.forEach(x=>{const r=d[x.n]||{};g+=(r.m?1:0)+(r.e?1:0)});return{t:act.length*2,g}}
function medColor(k){const{t,g}=medStat(k);if(!t)return{};if(g>0)return{c:g===t?"g":"y"};const f=takenDays(meds())[0];return f&&k>=f&&k<todayK()?{c:"r"}:{}}
let mday=todayK();
const mcal=mkCal($("#mcal"),medColor,k=>{mday=k;renderMeds();return k});

function renderMeds(){
  const m=meds(),sel=$("#msel"),cur=sel.value;mcal.st.sel=mday;mcal.draw();
  $("#mday").textContent=new Date(mday+"T12:00").toLocaleDateString("hr-HR",{weekday:"long",day:"numeric",month:"long"});
  sel.innerHTML=m.list.map(x=>`<option>${esc(x.n)}</option>`).join("");
  if(m.list.some(x=>x.n===cur))sel.value=cur;
  $("#mhas").classList.toggle("hide",!m.list.length);$("#mnone").classList.toggle("hide",!!m.list.length);
  const r=(m.d[mday]||{})[sel.value]||{};
  $("#bm").setAttribute("aria-pressed",r.m?"true":"false");$("#be").setAttribute("aria-pressed",r.e?"true":"false");
  $("#mlist").innerHTML=m.list.filter(x=>x.f<=mday).map(x=>{const q=(m.d[mday]||{})[x.n]||{};
    return `<div class="entry" style="border-color:var(--green)"><b>${esc(x.n)}</b><span>Jutro: ${q.m?"✓ uzeto":"✗ nije"} · Večer: ${q.e?"✓ uzeto":"✗ nije"}</span></div>`}).join("");
}
function setDose(names,w,v){const m=meds(),d=m.d[mday]=m.d[mday]||{};if(v)m.list.forEach(x=>{if(names.includes(x.n)&&x.f>mday)x.f=mday});names.forEach(n=>{const r=d[n]=d[n]||{};if(w==="a"){r.m=v;r.e=v}else r[w]=v});wr(MK,m)}
const actNames=()=>meds().list.map(x=>x.n);
$("#msel").onchange=renderMeds;
[["m","#bm"],["e","#be"]].forEach(([w,id])=>$(id).onclick=()=>{const n=$("#msel").value;if(!n)return;
  const r=(meds().d[mday]||{})[n]||{};setDose([n],w,r[w]?0:1);renderMeds();if(!r[w])toast("Zabilježeno")});
$("#ball").onclick=()=>{setDose(actNames(),"a",1);renderMeds();toast("Sve uzeto za taj dan")};
$("#ballm").onclick=()=>{setDose(actNames(),"m",1);renderMeds()};
$("#balle").onclick=()=>{setDose(actNames(),"e",1);renderMeds()};
$("#bclr").onclick=()=>{if(confirm("Očistiti sve zapise lijekova za taj dan?")){setDose(actNames(),"a",0);renderMeds()}};
$("#madd").onclick=()=>{const v=(prompt("Naziv lijeka:")||"").trim();if(!v)return;const m=meds();
  if(!m.list.some(x=>x.n===v))m.list.push({n:v,f:mday<todayK()?mday:todayK()});wr(MK,m);renderMeds();$("#msel").value=v;renderMeds()};
$("#mdel").onclick=()=>{const n=$("#msel").value;if(!n||!confirm("Ukloniti lijek „"+n+"”? Već zabilježene doze ostaju u izvozu."))return;
  const m=meds();m.list=m.list.filter(x=>x.n!==n);wr(MK,m);renderMeds()};

