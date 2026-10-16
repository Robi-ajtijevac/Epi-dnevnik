// Srca i igra u polju
// srca (bez zvuka)
const HK="dnevnikSimptoma.hearts";let hearts=+rd(HK,"0")||0;
const HEART='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21S4 15.5 4 10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" fill="#ff5c7a" stroke="#5a2a42" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const HOP=[{transform:"translateY(0)"},{transform:"translateY(-14px)"},{transform:"translateY(0)"}];
function updHearts(){$$(".hscore").forEach(e=>e.textContent=hearts?"♥ "+hearts:"Dodirni kokoš!")}
function burst(x,y){
  for(let i=0,n=6+Math.floor(Math.random()*3);i<n;i++){
    const h=document.createElement("span");h.className="ht";h.innerHTML=HEART;
    h.style.left=(x+Math.random()*30-15)+"px";h.style.top=y+"px";document.body.append(h);
    if(RMQ.matches){setTimeout(()=>h.remove(),700);continue}
    h.animate([{transform:"translate(0,0) scale(.4)",opacity:1},{transform:`translate(${Math.random()*70-35}px,${-(50+Math.random()*60)}px) scale(${.8+Math.random()*.5})`,opacity:0}],
      {duration:800+Math.random()*500,easing:"ease-out",fill:"forwards"}).onfinish=()=>h.remove();
  }
  hearts++;wr(HK,hearts);updHearts();
}
updHearts();

// polje: kokoši ulaze, izlaze i viraju iza grmova
const field=$("#field"),bushes=[[3,74],[41,82],[76,72]];let live=0;
function mkChicken(id,size,bottom,z){
  const el=document.createElement("div");el.className="fch";el.style.cssText=`width:${size}px;height:${size}px;bottom:${bottom}px;z-index:${z}`;
  el.innerHTML=`<div class="fl"><svg class="ck" data-b="${id}"></svg></div>`;
  el.addEventListener("pointerdown",ev=>{ev.preventDefault();burst(ev.clientX,ev.clientY);
    if(!RMQ.matches)$("svg",el).animate(HOP,{duration:420,easing:"ease-out"});
    if(el._a&&!el._p){el._p=1;el._a.pause();setTimeout(()=>{el._p=0;if(el._a)el._a.play()},900)}});
  field.append(el);return el;
}
function spawn(){
  if(live>=4||document.hidden||$("#home").classList.contains("hide")||RMQ.matches)return;
  const W=field.clientWidth;if(!W)return;
  const id=rnd(BK),done=el=>a=>{a.onfinish=()=>{el._a=null;el.remove();live--}};
  if(Math.random()<.35){
    const b=rnd(bushes),cx=W*b[0]/100+b[1]/2+Math.random()*16-8,el=mkChicken(id,54,10,5);el.style.left=(cx-27)+"px";live++;
    el._a=el.animate([{transform:"translateY(76px)"},{transform:"translateY(0)",offset:.16,easing:"ease-out"},{transform:"translateY(0)",offset:.82},{transform:"translateY(76px)"}],
      {duration:3600+Math.random()*1800,fill:"forwards"});done(el)(el._a);return;
  }
  const near=Math.random(),size=Math.round(44+near*24),bottom=Math.round(6+(1-near)*32),dir=Math.random()<.5?1:-1;
  const x0=dir>0?-size-6:W+6,x1=dir>0?W+6:-size-6,el=mkChicken(id,size,bottom,1+Math.round(near*3));
  if(dir<0)$(".fl",el).style.transform="scaleX(-1)";live++;
  el._a=el.animate([{transform:`translateX(${x0}px)`},{transform:`translateX(${x1}px)`}],{duration:(W+size+12)/(30+Math.random()*28)*1000,easing:"linear",fill:"forwards"});
  done(el)(el._a);
}
if(RMQ.matches)[[8,"silkie"],[38,"polish"],[68,"serama"]].forEach(([p,id])=>{mkChicken(id,56,10,3).style.left=p+"%"});
else{setInterval(spawn,1400);setTimeout(spawn,150);setTimeout(spawn,900)}

