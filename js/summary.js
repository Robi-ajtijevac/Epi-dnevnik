// Mjesečni sažetak
let sm=new Date(new Date().getFullYear(),new Date().getMonth(),1);
$("#sprev").onclick=()=>{sm=new Date(sm.getFullYear(),sm.getMonth()-1,1);renderSumm()};
$("#snext").onclick=()=>{sm=new Date(sm.getFullYear(),sm.getMonth()+1,1);renderSumm()};
function topList(title,arr){if(!arr.length)return"";const mx=arr[0][1];
  return `<label class="f">${title}</label>`+arr.map(([n,v])=>`<div class="hb"><span>${esc(n)}</span><div><i style="width:${v/mx*100}%"></i></div><b>${v}</b></div>`).join("")}
function renderSumm(){
  const y=sm.getFullYear(),mo=sm.getMonth(),dim=new Date(y,mo+1,0).getDate(),pre=`${y}-${pad(mo+1)}-`;
  $("#smon").textContent=sm.toLocaleDateString("hr-HR",{month:"long",year:"numeric"});
  const es=load().filter(e=>ymd(new Date(e.when)).startsWith(pre)),sy=es.filter(e=>e.type==="symptom"),se=es.filter(e=>e.type==="seizure");
  const per=Array.from({length:dim},()=>({s:0,z:0}));
  sy.forEach(e=>per[new Date(e.when).getDate()-1].s+=(e.symptoms||[]).length);
  se.forEach(e=>per[new Date(e.when).getDate()-1].z++);
  const cnt=(arr,f)=>{const o={};arr.forEach(e=>(f(e)||[]).forEach(v=>v&&(o[v]=(o[v]||0)+1)));return Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,5)};
  const ci=Object.entries(cis()).filter(([k])=>k.startsWith(pre)).map(x=>x[1]),cs=ci.filter(c=>c.sleep!=null),ciAvg=cs.length?(Math.round(cs.reduce((a,c)=>a+c.sleep,0)/cs.length*10)/10).toString().replace(".",",")+" h":"–",ciLow=cs.filter(c=>c.sleep<6).length;
  const sdur=sy.filter(e=>e.seconds&&!e.ongoing),sAvg=sdur.length?dur(Math.round(sdur.reduce((a,e)=>a+e.seconds,0)/sdur.length)):"–",sTot=sdur.length?dur(sdur.reduce((a,e)=>a+e.seconds,0)):"–";
  const withDur=se.filter(e=>e.seconds),avg=withDur.length?dur(Math.round(withDur.reduce((a,e)=>a+e.seconds,0)/withDur.length)):"–";
  let t=0,g=0;const f=takenDays(meds())[0],last=`${pre}${pad(dim)}`,end=todayK()<last?todayK():last;
  if(f)for(let i=1;i<=dim;i++){const k=pre+pad(i);if(k>=f&&k<=end){const r=medStat(k);t+=r.t;g+=r.g}}
  const mx=Math.max(1,...per.map(p=>p.s+p.z*3));
  $("#sbody").innerHTML=`<div class="stats">
   <div><big>${se.length}</big>napadaja</div><div><big>${avg}</big>prosječno trajanje napadaja</div>
   <div><big>${per.reduce((a,p)=>a+p.s,0)}</big>zabilježenih simptoma</div><div><big>${per.filter(p=>p.s||p.z).length}</big>dana sa simptomima ili napadajem</div>
   <div><big>${t?Math.round(g/t*100)+" %":"–"}</big>uzetih doza lijekova</div><div><big>${es.length}</big>unosa ukupno</div>
   <div><big>${sAvg}</big>prosječno trajanje simptoma</div><div><big>${sTot}</big>ukupno trajanje simptoma</div>
   <div><big>${se.filter(e=>e.rescue).length}</big>napadaja s hitnim lijekom</div><div><big>${ciAvg}</big>prosječno spavanje</div>
   <div><big>${ci.length}</big>dana s dnevnom provjerom</div><div><big>${ciLow}</big>dana sa spavanjem manje od 6 h</div></div>
   <label class="f">Po danima</label>
   <div class="chart">${per.map(p=>`<div class="bar"><i class="z" style="height:${p.z*3/mx*100}%"></i><i class="s" style="height:${p.s/mx*100}%"></i></div>`).join("")}</div>
   <div class="lab">${per.map((p,i)=>`<span>${[1,5,10,15,20,25,dim].includes(i+1)?i+1:""}</span>`).join("")}</div>
   <div class="leg"><span><i style="background:var(--red)"></i>simptomi</span><span><i style="background:var(--blue)"></i>napadaji</span></div>`
   +topList("Najčešći simptomi",cnt(sy,e=>e.symptoms))+topList("Najčešći okidači",cnt(se,e=>e.triggers))+topList("Vrste napadaja",cnt(se,e=>[e.kind]));
}

