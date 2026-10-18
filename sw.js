/* DC CAD Pro - Service Worker (suba a versão em V a cada deploy) */
const V='dccad-v9.0.0',
SHELL=['/','/index.html','/css/estilo.css','/css/celular.css','/js/core/nucleo.js','/js/core/offline-backup.js','/js/editor/chatdc-documentos.js','/js/editor/complemento-editor.js','/js/editor/produtividade-canvas.js','/js/editor/vista-arquivo.js','/js/ui/celular.js','/js/ui/ferramentas-config.js','/js/core/config.js','/js/modulos/pix.js','/js/modulos/perfis.js','/js/modulos/ia.js','/js/modulos/orcamentos.js','/js/modulos/campo.js','/js/ui/nav.js','/js/modulos/documentos.js','/manifest.json','/assets/img/logo.png','/assets/img/favicon.png','/assets/img/apple-touch-icon.png','/assets/img/Whatsapp.png','/assets/logos-bancos/Banco%20do%20Brasil.png','/assets/logos-bancos/Bradesco.png','/assets/logos-bancos/C6.png','/assets/logos-bancos/Caixa.png','/assets/logos-bancos/Inter.png','/assets/logos-bancos/Ita%C3%BA.png','/assets/logos-bancos/Mercado%20Pago.png','/assets/logos-bancos/Neon.png','/assets/logos-bancos/Nubank.png','/assets/logos-bancos/Original.png','/assets/logos-bancos/PagBank.png','/assets/logos-bancos/PicPay.png','/assets/logos-bancos/Santander.png','/assets/logos-bancos/Sicoob.png','/assets/logos-bancos/Sicredi.png'],
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
