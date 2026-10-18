/* DC CAD Pro - Service Worker (suba a versão em V a cada deploy) */
const V='dccad-v8.2.0',
SHELL=['/','/index.html','/estilo.css','/config.js','/pix.js','/perfis.js','/ia.js','/orcamentos.js','/campo.js','/nav.js','/documentos.js','/manifest.json','/logo.png','/favicon.png','/apple-touch-icon.png','/Whatsapp.png','/Logos%20Bancos/Banco%20do%20Brasil.png','/Logos%20Bancos/Bradesco.png','/Logos%20Bancos/C6.png','/Logos%20Bancos/Caixa.png','/Logos%20Bancos/Inter.png','/Logos%20Bancos/Ita%C3%BA.png','/Logos%20Bancos/Mercado%20Pago.png','/Logos%20Bancos/Neon.png','/Logos%20Bancos/Nubank.png','/Logos%20Bancos/Original.png','/Logos%20Bancos/PagBank.png','/Logos%20Bancos/PicPay.png','/Logos%20Bancos/Santander.png','/Logos%20Bancos/Sicoob.png','/Logos%20Bancos/Sicredi.png'],
CDN=['https://cdn.tailwindcss.com','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);
 await Promise.all([...SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})),...CDN.map(u=>fetch(new Request(u,{mode:'no-cors'})).then(r=>c.put(u,r)).catch(()=>{}))]);self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);try{if(self.registration.navigationPreload)await self.registration.navigationPreload.enable()}catch(x){}await self.clients.claim()})())});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});
const timeout=(p,ms)=>new Promise((ok,no)=>{const t=setTimeout(()=>no('timeout'),ms);p.then(r=>{clearTimeout(t);ok(r)},e=>{clearTimeout(t);no(e)})});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||!/^https?:$/.test(u.protocol)||u.hostname.endsWith('supabase.co')||u.hostname==='accounts.google.com'||u.pathname.startsWith('/rest/')||u.pathname.startsWith('/auth/'))return;
 e.respondWith((async()=>{const c=await caches.open(V);
  if(u.origin===location.origin){
   if(r.mode==='navigate'){ /* páginas: rede primeiro (3 s), cache como reserva */
    try{const n=await timeout(Promise.resolve(e.preloadResponse).then(p=>p||fetch(r)),3000);if(n.ok&&n.type==='basic')c.put('/index.html',n.clone());return n}
    catch(x){return (await c.match('/index.html'))||(await c.match('/'))||Response.error()}}
   /* arquivos do app (js, css, imagens): cache primeiro e atualiza em segundo plano = abre instantâneo */
   const h=await c.match(r,{ignoreSearch:true});
   const n=fetch(r).then(x=>{if(x&&x.ok&&x.type==='basic')c.put(r,x.clone());return x}).catch(()=>null);
   if(h){e.waitUntil(n);return h}
   return (await timeout(n,6000).catch(()=>null))||Response.error()}
  /* CDN, fontes: cache primeiro, atualiza em segundo plano */
  const h=await c.match(r);const n=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>null);return h||(await n)||Response.error()})())});
