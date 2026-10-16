// Kokošinjac (galerija)
// kokošinjac (galerija)
let coopBuilt=false;
function renderCoop(){
  updHearts();if(coopBuilt)return;coopBuilt=true;const g=$("#coopgrid");
  BK.forEach(id=>{
    const c=document.createElement("div");c.className="cc";c.setAttribute("role","button");c.tabIndex=0;
    c.innerHTML=`<svg class="ck" data-b="${id}"></svg><b></b><span></span>`;$("b",c).textContent=BR[id][0];$("span",c).textContent=BR[id][1];
    const go=ev=>{const r=c.getBoundingClientRect();burst(ev.clientX||r.left+r.width/2,ev.clientY||r.top+r.height/3);if(!RMQ.matches)$("svg",c).animate(HOP,{duration:420,easing:"ease-out"})};
    c.addEventListener("click",go);c.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go(e)}});
    g.append(c);
  });
}

