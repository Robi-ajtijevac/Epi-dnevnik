// Osnovno: opcije, pohrana, pomoćne funkcije, odabir opcija (chips)
// Broj verzije se čita iz <meta name="app-version"> u index.html (jedino mjesto).
const VER=+((document.querySelector('meta[name="app-version"]')||{}).content)||0;
const OPTS={
 symptoms:["Glavobolja","Trnci","Vrtoglavica","Mučnina","Aura","Déjà vu","Promjene vida","Čudan miris ili okus","Smetenost","Umor","Tjeskoba ili strah","Trzanje mišića","Drugo"],
 severity:["Blago","Umjereno","Jako"],
 kind:["Nisam siguran/na","Zagledanost / odsutnost","Konvulzivni","Jedna strana tijela","Pad","Drugo"],
 aware:["Da","Ne","Nisam siguran/na"],
 triggers:["Nedostatak sna","Stres","Propuštena terapija","Bolest","Treperavo svjetlo","Alkohol","Nepoznato"],
 after:["Pospanost","Smetenost","Glavobolja","Bolni mišići","Brz oporavak"],
 mood:["Loše","Slabo","U redu","Dobro","Odlično"],
 stress:["Nema","Blagi","Umjereni","Jaki"],
 extras:["Alkohol","Bolest ili temperatura","Preskočen obrok","Naporan dan","Treperava svjetla","Putovanje"]
};
const KEY="dnevnikSimptoma.v1",CK="dnevnikSimptoma.custom";
const rd=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||d)}catch(e){return JSON.parse(d)}};
const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){toast("Spremanje u pregledniku nije uspjelo")}};
const load=()=>rd(KEY,"[]"),store=a=>wr(KEY,a);
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const pad=n=>String(n).padStart(2,"0");
const local=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmt=d=>d.toLocaleString("hr-HR",{weekday:"short",day:"numeric",month:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"});
function toast(t){const e=$("#toast");$("span",e).textContent=t;e.classList.remove("on");void e.offsetWidth;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("on"),2200)}
document.addEventListener("touchstart",()=>{},{passive:true});

const pressed=c=>$$(".chip[aria-pressed=true]",c).map(b=>b.dataset.v);
function buildChips(c,sel=[],extra=[]){
  const n=c.dataset.name,cu=rd(CK,"{}")[n]||[],all=[...OPTS[n],...cu];
  extra.forEach(x=>{if(x&&!all.includes(x))all.push(x)});c.innerHTML="";
  all.forEach(o=>{
    const b=document.createElement("button");b.type="button";b.className="chip";b.dataset.v=o;b.textContent=o;
    b.setAttribute("aria-pressed",sel.includes(o)?"true":"false");
    if(cu.includes(o)){const x=document.createElement("span");x.className="x";x.textContent="×";b.append(x)}
    b.onclick=ev=>{
      if(ev.target.classList.contains("x")){
        if(confirm("Ukloniti opciju „"+o+"”?")){const m=rd(CK,"{}");m[n]=m[n].filter(v=>v!==o);wr(CK,m);buildChips(c,pressed(c).filter(v=>v!==o))}return}
      if(!c.dataset.multi)$$(".chip",c).forEach(x=>x!==b&&x.setAttribute("aria-pressed","false"));
      b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")==="true"?"false":"true");
    };c.append(b)});
  if(c.dataset.fixed)return;
  const a=document.createElement("button");a.type="button";a.className="chip add";a.textContent="Dodaj +";
  a.onclick=()=>{const v=(prompt("Dodaj novu opciju:")||"").trim();if(!v)return;
    if(!all.includes(v)){const m=rd(CK,"{}");(m[n]=m[n]||[]).push(v);wr(CK,m)}
    buildChips(c,c.dataset.multi?[...pressed(c),v]:[v])};
  c.append(a);
}
$$(".chips[data-name]").forEach(c=>buildChips(c));

const dur=sec=>{if(!sec)return"trajanje nije upisano";const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),x=sec%60;return[h?h+" h":"",m?m+" min":"",x?x+" s":""].filter(Boolean).join(" ")};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayK=()=>ymd(new Date());
