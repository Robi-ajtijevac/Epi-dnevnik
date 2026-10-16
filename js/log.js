// Obrasci za simptom i napadaj
let clocks=[],editing=null;
$$(".tslot").forEach(s=>{
  s.append($("#tpl").content.cloneNode(true));
  const o={txt:$(".wtxt",s),btn:$(".wbtn",s),inp:$(".winp",s),manual:false};
  o.btn.onclick=()=>setManual(o,new Date());
  s._o=o;clocks.push(o);
});
function setManual(o,d){o.manual=true;o.inp.value=local(d);o.inp.classList.remove("hide");o.btn.classList.add("hide");o.txt.textContent="Postavi vrijeme:"}
function tick(){clocks.forEach(o=>{if(!o.manual)o.txt.textContent="Sada · "+fmt(new Date())})}
setInterval(tick,15000);tick();
const getWhen=s=>{const o=$(".tslot",s)._o;return o.manual&&o.inp.value?new Date(o.inp.value):new Date()};
const pick=(s,n)=>pressed($(`[data-name="${n}"]`,s));
$$(".save").forEach(b=>b.dataset.l=b.textContent);
$("#ongo").onclick=function(){this.setAttribute("aria-pressed",this.getAttribute("aria-pressed")==="true"?"false":"true")};
function syncRescue(){$("#rbox").classList.toggle("hide",$("#resc").getAttribute("aria-pressed")!=="true")}
$("#resc").onclick=function(){this.setAttribute("aria-pressed",this.getAttribute("aria-pressed")==="true"?"false":"true");syncRescue()};

function reset(s){
  $$(".chips[data-name]",s).forEach(c=>buildChips(c));
  $$("textarea,input[type=number]",s).forEach(i=>i.value="");$$(".chip[data-flag]",s).forEach(b=>b.setAttribute("aria-pressed","false"));if(s.id==="seizure"){$("#rname").value="";$("#rtime").value="";syncRescue()}
  const o=$(".tslot",s)._o;o.manual=false;o.inp.classList.add("hide");o.btn.classList.remove("hide");tick();
  const sv=$(".save",s);sv.textContent=sv.dataset.l;
}
$$("[data-save]").forEach(btn=>btn.onclick=()=>{
  const type=btn.dataset.save,s=$("#"+type),a=load();
  const e={id:editing||Date.now(),type,when:getWhen(s).toISOString(),notes:$("textarea",s).value.trim()};
  if(type==="symptom"){
    e.symptoms=pick(s,"symptoms");e.severity=pick(s,"severity")[0]||"";
    e.ongoing=$("#ongo").getAttribute("aria-pressed")==="true";
    e.seconds=e.ongoing?0:(+$("#shr").value||0)*3600+(+$("#smn").value||0)*60;
    if(!e.symptoms.length){toast("Odaberite barem jedan simptom");return}
  }else{
    e.seconds=(+$("#min").value||0)*60+(+$("#sec").value||0);
    e.kind=pick(s,"kind")[0]||"";e.aware=pick(s,"aware")[0]||"";
    e.triggers=pick(s,"triggers");e.after=pick(s,"after");
    e.rescue=$("#resc").getAttribute("aria-pressed")==="true";if(e.rescue){e.rescueName=$("#rname").value.trim();e.rescueTime=$("#rtime").value}
  }
  const i=a.findIndex(x=>x.id===e.id);i>=0?a[i]=e:a.push(e);
  store(a);const was=editing;editing=null;reset(s);toast(was?"Promjene spremljene":"Spremljeno");show(was?"history":"home");
});

function fill(s,n,vals){const v=(vals||[]).filter(Boolean);buildChips($(`[data-name="${n}"]`,s),v,v)}
function startEdit(e){
  const s=$("#"+e.type);editing=e.id;show(e.type,true);
  if(e.type==="symptom"){fill(s,"symptoms",e.symptoms);fill(s,"severity",[e.severity]);
    $("#shr").value=Math.floor((e.seconds||0)/3600)||"";$("#smn").value=Math.floor((e.seconds||0)%3600/60)||"";$("#ongo").setAttribute("aria-pressed",e.ongoing?"true":"false")}
  else{$("#min").value=Math.floor(e.seconds/60)||"";$("#sec").value=e.seconds%60||"";
    fill(s,"kind",[e.kind]);fill(s,"aware",[e.aware]);fill(s,"triggers",e.triggers);fill(s,"after",e.after);
    $("#resc").setAttribute("aria-pressed",e.rescue?"true":"false");$("#rname").value=e.rescueName||"";$("#rtime").value=e.rescueTime||"";syncRescue()}
  $("textarea",s).value=e.notes||"";
  setManual($(".tslot",s)._o,new Date(e.when));
  $(".save",s).textContent="Spremi promjene";
}

