const VERSION="abbytraining-account-shortcut-v15";const FILES=["./","./index.html","./app.js","./cloud.js","./shared.js","./supabase-config.js","./style.css","./manifest.webmanifest","./assets/abby-portrait.webp","./assets/icon-192.png","./assets/icon-512.png","./assets/uebung-01.webp","./assets/uebung-02.webp","./assets/uebung-03.webp","./assets/uebung-04.webp","./assets/uebung-05.webp","./assets/uebung-06.webp","./assets/uebung-07.webp","./assets/uebung-08.webp","./assets/uebung-09.webp","./assets/uebung-10.webp","./assets/uebung-11.webp"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Keep app scripts and HTML fresh, but continue working offline when the network fails.
self.addEventListener("fetch",e=>{
 const req=e.request;
 if(req.method!=="GET"||new URL(req.url).origin!==location.origin)return;
 const url=new URL(req.url);
 const fresh=req.mode==="navigate"||/\.(?:js|css|html|webmanifest)$/.test(url.pathname);
 const network=()=>fetch(req).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(req,copy)).catch(()=>{})}
   return response;
 });
 if(fresh){e.respondWith(network().catch(async()=>await caches.match(req)||Response.error()));return}
 e.respondWith(caches.match(req).then(hit=>hit||network()));
});
