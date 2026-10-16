// Slanje, spremanje i sigurnosna kopija
function download(name,text,mime){
  const u=URL.createObjectURL(new Blob([text],{type:mime}));
  const a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),1000);
}
const q=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
function buildCsv(){
  const a=load().sort((x,y)=>new Date(x.when)-new Date(y.when)),m=meds(),md=[];
  Object.keys(m.d).sort().forEach(k=>Object.entries(m.d[k]).forEach(([n,r])=>{if(r.m)md.push([k,n,"Jutro"]);if(r.e)md.push([k,n,"Večer"])}));
  const cI=Object.entries(cis()).sort();if(!a.length&&!md.length&&!cI.length)return null;
  const head=["Datum","Vrijeme","Vrsta","Simptomi","Jačina","Trajanje (sekunde)","Vrsta napadaja","Gubitak svijesti","Okidači","Nakon napadaja","Bilješke","Lijek","Doza","Još traje","Hitni lijek","Hitni lijek (naziv)","Hitni lijek (sat)","San (h)","Raspoloženje","Stres","Dodatno"];
  const rows=a.map(e=>{const d=new Date(e.when);
    return [ymd(d),`${pad(d.getHours())}:${pad(d.getMinutes())}`,
    e.type==="symptom"?"Simptom":"Napadaj",(e.symptoms||[]).join(", "),e.severity||"",e.seconds||"",e.kind||"",e.aware||"",
    (e.triggers||[]).join(", "),(e.after||[]).join(", "),e.notes||"","","",e.ongoing?"Da":"",e.rescue?"Da":"",e.rescueName||"",e.rescueTime||"","","","",""].map(q).join(";")});
  md.forEach(([k,n,w])=>rows.push([k,"","Lijek","","","","","","","","",n,w,"","","","","","","",""].map(q).join(";")));
  cI.forEach(([k,c])=>{const r=Array(21).fill("");r[0]=k;r[2]="Dnevna provjera";r[10]=c.notes||"";r[17]=c.sleep??"";r[18]=c.mood||"";r[19]=c.stress||"";r[20]=(c.extras||[]).join(", ");rows.push(r.map(q).join(";"))});
  return "\ufeff"+[head.map(q).join(";"),...rows].join("\r\n");
}
const fname=()=>"dnevnik-"+local(new Date()).slice(0,10)+".csv";
$("#csv").onclick=()=>{const t=buildCsv();if(!t){toast("Nema unosa za izvoz");return}download(fname(),t,"text/csv;charset=utf-8")};
$("#send").onclick=async()=>{
  const t=buildCsv();if(!t){toast("Nema unosa za slanje");return}
  const file=new File([t],fname(),{type:"text/csv"});
  try{
    if(navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({files:[file],title:"Dnevnik"});
    else{download(fname(),t,"text/csv;charset=utf-8");toast("Dijeljenje nije podržano. Datoteka je spremljena.")}
  }catch(e){if(e.name!=="AbortError")toast("Nije moguće otvoriti izbornik za dijeljenje")}
};
$("#json").onclick=()=>download("dnevnik-sigurnosna-kopija.json",JSON.stringify({entries:load(),custom:rd(CK,"{}"),lijekovi:meds(),provjere:cis(),kartica:rd(CARDK,"{}")},null,2),"application/json");


