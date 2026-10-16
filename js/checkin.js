// Dnevna provjera
const CIK="dnevnikSimptoma.checkin",cis=()=>rd(CIK,"{}");
function loadCheckin(){
  const s=$("#checkin"),k=$("#cdate").value||todayK(),all=cis(),c=all[k]||{};
  $("#csleep").value=c.sleep??"";$("#cn").value=c.notes||"";
  fill(s,"mood",[c.mood]);fill(s,"stress",[c.stress]);fill(s,"extras",c.extras);
  $("#cstat").textContent=all[k]?"Za ovaj dan već postoji provjera. Spremanje će je zamijeniti.":"";
  $("#csave").textContent=all[k]?"Spremi promjene":"Spremi provjeru";
  $("#cdel").classList.toggle("hide",!all[k]);
}
$("#cdate").onchange=loadCheckin;
$("#csave").onclick=()=>{
  const s=$("#checkin"),k=$("#cdate").value||todayK(),sl=$("#csleep").value;
  const c={sleep:sl===""?null:+sl,mood:pick(s,"mood")[0]||"",stress:pick(s,"stress")[0]||"",extras:pick(s,"extras"),notes:$("#cn").value.trim()};
  if(c.sleep===null&&!c.mood&&!c.stress&&!c.extras.length&&!c.notes){toast("Upišite barem jedan podatak");return}
  const m=cis();m[k]=c;wr(CIK,m);toast("Provjera spremljena");show("home");
};
$("#cdel").onclick=()=>{const k=$("#cdate").value||todayK();if(!confirm("Obrisati provjeru za taj dan?"))return;
  const m=cis();delete m[k];wr(CIK,m);toast("Obrisano");loadCheckin()};

