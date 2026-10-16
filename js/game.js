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
  hearts++;wr(HK,hearts);updHearts();if(hearts%10===0)parade();
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


// Svaki 10. dodir (10, 20, 30…): leptiri lete preko cijelog ekrana i sipaju čarobnu prašinu
const PCOL=["#ff8fc0","#ffb457","#b794ff","#6bb8ff","#6fdc9b","#ffd75e"],DCOL=["#ffd75e","#ff8fc0","#fff","#b794ff","#6bb8ff"];
const STAR=c=>`<svg viewBox="0 0 24 24"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="${c}"/></svg>`;
let paradeN=0,dustN=0;
function dust(x,y){
  if(dustN>70)return;dustN++;
  const s=7+Math.random()*9,d=document.createElement("span");d.className="dust";d.style.width=d.style.height=s+"px";
  d.innerHTML=STAR(rnd(DCOL));d.style.transform=`translate(${x}px,${y}px)`;document.body.append(d);
  const dx=Math.random()*30-15,dy=30+Math.random()*50,end=()=>{d.remove();dustN--};
  d.animate([{transform:`translate(${x}px,${y}px) scale(1) rotate(0)`,opacity:1},{transform:`translate(${x+dx}px,${y+dy}px) scale(.2) rotate(${Math.random()*180}deg)`,opacity:0}],
    {duration:700+Math.random()*600,easing:"ease-in",fill:"forwards"}).onfinish=end;
}
function parade(){
  if(paradeN>=2)return;paradeN++;
  const W=innerWidth,H=innerHeight,N=9,rn=(a,b)=>a+Math.random()*(b-a);
  if(RMQ.matches){
    const L=[];for(let i=0;i<N;i++){const b=document.createElement("div");b.className="pb";b.style.color=rnd(PCOL);b.style.width=b.style.height=rn(26,42)+"px";
      b.innerHTML='<svg viewBox="0 0 32 32"><use href="#bf"/></svg>';b.style.transform=`translate(${rn(10,W-50)}px,${rn(60,H-80)}px)`;b.firstChild.style.animation="none";document.body.append(b);L.push(b)}
    setTimeout(()=>{L.forEach(b=>b.remove());paradeN--},2400);return;
  }
  const bs=[],t0=performance.now();
  for(let i=0;i<N;i++){
    const el=document.createElement("div"),s=rn(26,44),fromL=Math.random()<.5;
    el.className="pb";el.style.color=rnd(PCOL);el.style.width=el.style.height=s+"px";el.style.opacity="0";
    el.innerHTML='<svg viewBox="0 0 32 32"><use href="#bf"/></svg>';document.body.append(el);
    bs.push({el,s,x0:fromL?-60:W+60,x1:fromL?W+60:-60,y:rn(H*.15,H*.85),A:rn(H*.08,H*.22),A2:rn(10,40),f:rn(1.2,2.6),f2:rn(3,6),ph:rn(0,6.3),dur:rn(5500,8500),delay:rn(0,1400),last:0});
  }
  (function step(now){
    let alive=0;
    bs.forEach(b=>{
      const p=(now-t0-b.delay)/b.dur;if(b.done)return;
      if(p>=1){b.done=1;b.el.remove();return}alive++;if(p<0)return;
      const x=b.x0+(b.x1-b.x0)*p,y=b.y+b.A*Math.sin(p*6.28*b.f+b.ph)+b.A2*Math.sin(p*6.28*b.f2);
      b.el.style.opacity="1";b.el.style.transform=`translate(${x-b.s/2}px,${y-b.s/2}px)`;
      if(now-b.last>110){b.last=now;dust(x+Math.random()*10-5,y+b.s*.2)}
    });
    if(alive)requestAnimationFrame(step);else paradeN--;
  })(t0);
}
