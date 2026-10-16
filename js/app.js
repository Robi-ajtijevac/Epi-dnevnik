// Navigacija, provjera nove verzije i service worker
function setDanas(tab){
  const c=tab==="c";
  $("#dsw").setAttribute("aria-checked",c?"true":"false");
  $("#pane-t").classList.toggle("hide",c);$("#checkin").classList.toggle("hide",!c);
  if(c){$("#cdate").value=todayK();$("#cdate").max=todayK();loadCheckin()}else renderToday();
}
function show(id,keep){
  if(!keep&&editing){editing=null;reset($("#symptom"));reset($("#seizure"))}
  $$("main > section").forEach(s=>s.classList.toggle("hide",s.id!==id));
  if(id==="history")renderList();if(id==="coop")renderCoop();if(id==="today")setDanas("t");if(id==="card"){cardEdit=false;renderCard()}if(id==="home")homeSub();if(id==="meds")renderMeds();if(id==="summ")renderSumm();
  window.scrollTo(0,0);
}
$$("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
// Natrag iz obrasca: kod uređivanja natrag u povijest, inače u izbornik "Nešto se dogodilo"
$$("#symptom .back,#seizure .back").forEach(b=>b.onclick=()=>{const t=editing?"history":"happened";show(t)});
$("#dsw").onclick=()=>setDanas($("#dsw").getAttribute("aria-checked")==="true"?"t":"c");

// provjera nove verzije + osvježavanje jednim dodirom
async function chk(){try{const t=await(await fetch("index.html?c="+Date.now(),{cache:"no-store"})).text();
  const m=t.match(/name="app-version" content="(\d+)"/);if(m&&+m[1]>VER)$("#upd").classList.remove("hide")}catch(e){}}
$("#updbtn").onclick=async()=>{
  try{for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister();for(const k of await caches.keys())await caches.delete(k)}catch(e){}
  location.replace(location.pathname+"?u="+Date.now());
};
chk();document.addEventListener("visibilitychange",()=>{if(!document.hidden)chk()});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
