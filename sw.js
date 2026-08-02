/* Service worker Carte Obesite
   Regle projet : nom de cache synchronise avec le numero de Build.
   A chaque mise a jour : incrementer BUILD ici ET le "Build X" du pied de page. */
const BUILD = 1;
const CACHE = "carte-obesite-v" + BUILD;
const ASSETS = ["./", "./Carte_Obesite.html", "./Carte_Obesite.geojson"];

self.addEventListener("install", function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS).catch(function(){}); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k !== CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

/* Reseau d abord : on sert toujours la derniere version en ligne,
   le cache ne sert que de secours hors-ligne. */
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return res;
    }).catch(function(){ return caches.match(e.request); })
  );
});
