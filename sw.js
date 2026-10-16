const C="dnevnik-v9";
// Svaka datoteka aplikacije mora biti na ovom popisu (i na GitHubu), inače se nova verzija ne instalira.
const FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png",
 "css/base.css","css/home.css","css/screens.css","css/art.css",
 "js/art-data.js","js/core.js","js/art.js","js/log.js","js/history.js","js/export.js","js/meds.js","js/summary.js","js/today.js","js/checkin.js","js/card.js","js/game.js","js/coop.js","js/app.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).search)return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request,{cache:"no-cache"}).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>hit);
    return hit||net;
  }));
});
