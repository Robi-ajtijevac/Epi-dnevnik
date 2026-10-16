// Povijest: kalendar i popis unosa
function renderList(){
  hcal.st.sel=hf;hcal.draw();
  let a=load().sort((x,y)=>new Date(y.when)-new Date(x.when));const L=$("#list");L.innerHTML="";
  if(hf)a=a.filter(e=>ymd(new Date(e.when))===hf);
  $("#hnote").textContent=hf?"Prikazani su unosi za "+new Date(hf+"T12:00").toLocaleDateString("hr-HR",{day:"numeric",month:"long"})+". Dodirnite dan ponovno za sve unose.":"";
  if(!a.length){L.innerHTML=`<div class="empty"><svg class="ck"><use href="#ck"/></svg><p>${hf?"Nema unosa za taj dan.":"Još nema unosa. Spremljeni unosi pojavit će se ovdje."}</p></div>`;return}
  a.forEach(e=>{
    const d=document.createElement("div");d.className="entry "+e.type;
    const t=e.type==="symptom"?(e.symptoms.join(", ")+(e.severity?" ("+e.severity.toLowerCase()+")":"")+(e.ongoing?" · još traje":e.seconds?" · "+dur(e.seconds):"")):("Napadaj · "+dur(e.seconds)+(e.kind?" · "+e.kind:"")+(e.rescue?" · hitni lijek"+(e.rescueName?" ("+e.rescueName+")":"")+(e.rescueTime?" u "+e.rescueTime:""):""));
    d.innerHTML=`<div class="act"><button class="ed">Uredi</button><button class="de">Obriši</button></div><b></b><span></span>`;
    $("b",d).textContent=t;$("span",d).textContent=fmt(new Date(e.when))+(e.notes?" · "+e.notes:"");
    $(".ed",d).onclick=()=>startEdit(e);
    $(".de",d).onclick=()=>{if(confirm("Obrisati ovaj unos?")){store(load().filter(x=>x.id!==e.id));renderList()}};
    L.append(d);
  });
}

function symColor(k){const A=load(),ks=A.map(e=>ymd(new Date(e.when))).sort();let n=0,z=0;
  A.forEach(e=>{if(ymd(new Date(e.when))!==k)return;if(e.type==="symptom")n+=(e.symptoms||[]).length;else{n++;z++}});
  const s=z?"<em>⚡</em>":"";if(n>0)return{c:n===1?"y":n<=3?"o":"r",s};return ks.length&&k>=ks[0]&&k<=todayK()?{c:"g",s}:{s}}

function mkCal(host,fn,pick){
  const N=new Date(),st={m:new Date(N.getFullYear(),N.getMonth(),1),sel:null};
  const draw=()=>{
    const y=st.m.getFullYear(),mo=st.m.getMonth(),first=(new Date(y,mo,1).getDay()+6)%7,days=new Date(y,mo+1,0).getDate();
    let h=`<div class="calh"><button data-d="-1" aria-label="Prethodni mjesec">‹</button><b>${st.m.toLocaleDateString("hr-HR",{month:"long",year:"numeric"})}</b><button data-d="1" aria-label="Sljedeći mjesec">›</button></div><div class="calg">`+["Po","Ut","Sr","Če","Pe","Su","Ne"].map(x=>`<i>${x}</i>`).join("")+"<u></u>".repeat(first);
    for(let i=1;i<=days;i++){const k=`${y}-${pad(mo+1)}-${pad(i)}`,c=fn(k);
      h+=`<button class="day ${c.c||""}${k===st.sel?" sel":""}${k===todayK()?" today":""}" data-k="${k}">${i}${c.s||""}</button>`}
    host.innerHTML=h+"</div>";
    $$("[data-d]",host).forEach(b=>b.onclick=()=>{st.m=new Date(st.m.getFullYear(),st.m.getMonth()+ +b.dataset.d,1);draw()});
    $$(".day",host).forEach(b=>b.onclick=()=>{st.sel=pick(b.dataset.k);draw()});
  };
  draw();return{st,draw};
}
let hf=null;
const hcal=mkCal($("#hcal"),symColor,k=>{hf=hf===k?null:k;renderList();return hf});
