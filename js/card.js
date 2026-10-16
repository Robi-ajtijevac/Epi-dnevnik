// Hitna kartica
const CARDK="dnevnikSimptoma.card",KF=["name","diag","meds","all","c1","p1","doc","pd","note"];let cardEdit=false;
function renderCard(){
  const c=rd(CARDK,"{}"),has=KF.some(f=>c[f]),ed=cardEdit||!has;
  $("#cedit").classList.toggle("hide",!ed);$("#cview").classList.toggle("hide",ed);
  if(ed){KF.forEach(f=>$("#k"+f).value=c[f]||"");$("#kcancel").classList.toggle("hide",!has);return}
  const row=(l,v)=>v?`<div class="k">${l}</div><div class="v">${esc(v)}</div>`:"";
  const call=p=>p?`<div><a class="call" href="tel:${esc(p.replace(/[^+\d]/g,""))}">Nazovi ${esc(p)}</a></div>`:"";
  $("#cview").innerHTML=`<div class="card"><h3>Hitna kartica</h3>`+row("Ime i prezime",c.name)+row("Dijagnoza / stanje",c.diag)+row("Lijekovi",c.meds)+row("Alergije",c.all)
    +row("Kontakt osoba",c.c1)+call(c.p1)+row("Liječnik",c.doc)+call(c.pd)+row("Dodatne upute",c.note)+`</div><div class="mini"><button id="kedit" style="background:var(--yel)">Uredi karticu</button></div>`;
  $("#kedit").onclick=()=>{cardEdit=true;renderCard()};
}
$("#ksave").onclick=()=>{const c={};KF.forEach(f=>c[f]=$("#k"+f).value.trim());wr(CARDK,c);cardEdit=false;renderCard();toast("Kartica spremljena")};
$("#kcancel").onclick=()=>{cardEdit=false;renderCard()};
$("#kimp").onclick=()=>{const l=meds().list.map(x=>x.n);if(!l.length){toast("Popis lijekova je prazan");return}
  const t=$("#kmeds"),cur=t.value.trim(),add=l.filter(n=>!cur.includes(n));if(add.length)t.value=(cur?cur+"\n":"")+add.join("\n")};

