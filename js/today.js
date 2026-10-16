// Danas: današnji unosi
let tedit=null;
const hm=d=>`${pad(d.getHours())}:${pad(d.getMinutes())}`;
const todayList=()=>load().filter(e=>ymd(new Date(e.when))===todayK()||e.ongoing).sort((a,b)=>new Date(b.when)-new Date(a.when));
function homeSub(){const l=todayList(),o=l.filter(e=>e.ongoing).length;
  $("#todaysub").textContent=l.length?"Unosa danas: "+l.length+(o?" · još traje: "+o:""):"Danas još nema unosa";}
function upd(id,fn){const a=load(),x=a.find(y=>y.id===id);if(x){fn(x);store(a)}tedit=null;renderToday()}
function renderToday(){
  const L=$("#tlist"),a=todayList();L.innerHTML="";
  $("#tsub").textContent=a.length?"Dodajte trajanje naknadno ili završite simptom koji još traje.":"";
  if(!a.length){L.innerHTML='<div class="empty"><svg class="ck"><use href="#ck"/></svg><p>Danas još nema unosa.</p></div>';return}
  a.forEach(e=>{
    const w=new Date(e.when),sym=e.type==="symptom",d=document.createElement("div");d.className="entry "+e.type;
    const day=ymd(w)===todayK()?"":w.toLocaleDateString("hr-HR",{day:"numeric",month:"numeric"})+". ";
    const dt=e.ongoing?"još traje (od "+day+hm(w)+")":e.seconds?"trajanje: "+dur(e.seconds):"trajanje nije upisano";
    d.innerHTML='<b></b><span></span><div class="mini"></div>';
    $("b",d).textContent=sym?e.symptoms.join(", "):"Napadaj"+(e.kind?" · "+e.kind:"")+(e.rescue?" · hitni lijek":"");
    $("span",d).textContent=day+hm(w)+" · "+dt;
    const M=$(".mini",d),btn=(t,bg,fn,host=M)=>{const b=document.createElement("button");b.type="button";b.textContent=t;b.style.background=bg;b.onclick=fn;host.append(b)};
    if(e.ongoing)btn("Završilo je sada","var(--green)",()=>{upd(e.id,x=>{x.seconds=Math.max(1,Math.round((Date.now()-new Date(x.when))/1000));x.ongoing=false});toast("Trajanje spremljeno")});
    btn(e.seconds||e.ongoing?"Promijeni trajanje":"Dodaj trajanje","var(--yel)",()=>{tedit=tedit===e.id?null:e.id;renderToday()});
    if(tedit===e.id){
      const v=e.seconds||0,ed=document.createElement("div");ed.className="row";ed.style.cssText="flex-wrap:wrap;margin-top:12px";
      const inp=(c,l,val,mx)=>`<input type="number" inputmode="numeric" min="0" ${mx?'max="59"':""} class="${c}" aria-label="${l}" placeholder="0" value="${val||""}">`;
      ed.innerHTML=inp("th","Sati",Math.floor(v/3600))+" h "+inp("tm","Minute",Math.floor(v%3600/60),1)+" min "+(sym?"":inp("ts","Sekunde",v%60,1)+" s");
      const row=document.createElement("div");row.className="mini";row.style.width="100%";
      btn("Spremi","var(--green)",()=>{const g=c=>+($("."+c,ed)||{}).value||0,sec=g("th")*3600+g("tm")*60+g("ts");
        if(!sec){toast("Upišite trajanje");return}upd(e.id,x=>{x.seconds=sec;x.ongoing=false});toast("Trajanje spremljeno")},row);
      btn("Odustani","var(--card)",()=>{tedit=null;renderToday()},row);
      ed.append(row);d.append(ed);
    }
    L.append(d);
  });
}
homeSub();

