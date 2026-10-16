// Kokoši: pasmine i crtanje
const BR={
 silkie:["Silkie","Perje joj je mekano poput krzna, a na glavi nosi pahuljastu kapicu."],
 polish:["Poljska kukmasta (Polish)","Velika kukmica od perja na glavi izgleda kao pompon."],
 serama:["Serama","Podrijetlom iz Malezije, jedna od najmanjih kokoši na svijetu. Hoda uspravno, s ispuhanim prsima."],
 pekin:["Pekin (patuljasti Cochin)","Okrugla poput pahuljaste loptice, s pernatim nogama."],
 japanese:["Japanska patuljasta (Chabo)","Ima vrlo kratke noge i visok, uspravan rep."],
 sebright:["Sebright","Svako pero ima tamni rub pa izgleda kao čipka."],
 faverolles:["Faverolles","Francuska pasmina s bradicom, perjanim obrazima i pernatim nogama."],
 easter:["Easter Egger","Nese jaja u nijansama plave i zelene."],
 orpington:["Buff Orpington","Zlatna, okrugla i pahuljasta, poznata po mirnoj naravi."],
 appenzeller:["Appenzeller Spitzhauben","Iz Švicarske. Šiljasta kukmica podsjeća na kapicu."],
 frizzle:["Frizzle","Perje joj se kovrča prema van pa izgleda razbarušeno."],
 sultan:["Sultanka (Sultan)","Podrijetlom iz Turske, s kukmicom, bradicom i pernatim nogama."],
 brahma:["Brahma","Jedna od najvećih pasmina, a nježna i mirna."],
 duccle:["Belgijska d'Uccle (Mille Fleur)","Mala kokoš s bradicom i dugim perjem na nogama poput čizmica."],
 araucana:["Araucana","Iz Čilea. Ima pramenove perja uz uši, često nema repa i nese plava jaja."]
};
const BK=Object.keys(BR),RMQ=matchMedia("(prefers-reduced-motion: reduce)"),rnd=a=>a[Math.floor(Math.random()*a.length)];
function hydrate(root){
  const L=[];if(root.matches&&root.matches("svg.ck"))L.push(root);
  if(root.querySelectorAll)L.push(...root.querySelectorAll("svg.ck"));
  L.forEach(el=>{
    if(el.dataset.done)return;
    const id=el.dataset.b||rnd(BK);
    el.setAttribute("viewBox","0 0 64 64");el.innerHTML=KART.deco[id]||KART.breeds[id]||KART.breeds.silkie;
    el.style.setProperty("--d",(-Math.random()*4).toFixed(2)+"s");el.dataset.done="1";
  });
}
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)hydrate(n)}))).observe(document.body,{childList:true,subtree:true});
hydrate(document.body);

