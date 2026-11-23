// Guarda o app no celular para abrir sem internet.
const CACHE="corrente-trafo-v11";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  // rede primeiro (pega a versão nova), cache se estiver sem internet
  // no-cache: sempre confere com o servidor, para a versão nova aparecer na hora
  const same=new URL(e.request.url).origin===self.location.origin;
  e.respondWith((same?fetch(e.request.url,{cache:"no-cache"}):fetch(e.request)).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(m=>m||caches.match("./index.html"))));
});
