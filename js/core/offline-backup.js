/* DC CAD Pro v9.0 alfa — offline-backup.js: IndexedDB, offline/fila, auto-save, backup .dccad, SVG/DXF, QR, PWA, vitrine
   (bloco movido do index.html sem nenhuma alteração de lógica) */
/* DC CAD Pro v7.4 — PWA/offline, backup .dccad, SVG/DXF, QR no carimbo, vitrine do eletricista */
(()=>{'use strict';
const T=m=>{try{toast(m)}catch(e){alert(m)}},Q1=s=>document.querySelector(s);
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));

/* ================= IndexedDB ================= */
let _d;const idb=()=>_d||(_d=new Promise((ok,no)=>{const r=indexedDB.open('dccad74',1);r.onupgradeneeded=()=>{['proj','queue','bkp'].forEach(s=>r.result.createObjectStore(s,{keyPath:'id'}))};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}));
const tx=async(s,m,f)=>{const d=await idb();return new Promise((ok,no)=>{const t=d.transaction(s,m),q=f(t.objectStore(s));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>no(t.error)})};
const iget=(s,k)=>tx(s,'readonly',o=>o.get(k)),iall=s=>tx(s,'readonly',o=>o.getAll()),iput=(s,v)=>tx(s,'readwrite',o=>o.put(v)),idel=(s,k)=>tx(s,'readwrite',o=>o.delete(k)),
iset=(s,a)=>tx(s,'readwrite',o=>{o.clear();a.forEach(v=>o.put(v))});

/* ================= Offline: cache + fila de sincronização ================= */
const idOf=q=>(q.match(/id=eq\.([^&]+)/)||[])[1];
const pill=document.createElement('div');pill.style.cssText='position:fixed;left:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:95;background:#0f2a43;color:#fff;font:600 12px Inter,system-ui,sans-serif;padding:6px 12px;border-radius:99px;box-shadow:0 4px 14px #0004;display:none;pointer-events:none';document.body.appendChild(pill);
const setPill=async()=>{let n=0;try{n=(await iall('queue')).length}catch(e){}window.v74q=n;pill.textContent=!navigator.onLine?'📴 Offline'+(n?' • '+n+' pendente(s)':''):'🔄 Sincronizando ('+n+')';pill.style.display=(!navigator.onLine||n)?'block':'none'};
function remap(a,b){if(cur==a){cur=b;try{history.replaceState(null,'','/projeto/'+pSlug(cur))}catch(e){}}if(Array.isArray(PL)){const p=PL.find(x=>x.id==a);if(p)p.id=b}}
let syn=0;
async function sync(){if(syn||!navigator.onLine||!ses||ses.access_token=='local')return;syn=1;let n=0;
 try{const Q=(await iall('queue')).sort((a,b)=>a.t-b.t);
  for(const it of Q){let r;
   if(it.m=='POST'){r=await DB0('',{method:'POST',body:JSON.stringify(it.body)});if(Array.isArray(r)&&r[0]){await idel('proj',it.id);await iput('proj',r[0]);remap(it.id,r[0].id)}}
   else if(it.m=='PATCH')r=await DB0('?id=eq.'+it.id,{method:'PATCH',body:JSON.stringify(it.body)});
   else r=await DB0('?id=eq.'+it.id,{method:'DELETE'});
   if(Array.isArray(r)){await idel('queue',it.id);n++}else break}
 }catch(e){}
 syn=0;await setPill();
 if(n){T('☁️ '+n+' alteração(ões) sincronizada(s)');if(!window.v74q){const v=document.getElementById('vP');if(v&&!v.classList.contains('hidden'))list()}}}
async function off(q,o,m){const id=idOf(q),now=new Date().toISOString();let r;
 if(m=='GET'){const a=(await iall('proj')).sort((x,y)=>String(y.atualizado).localeCompare(String(x.atualizado)));r=id?a.filter(p=>p.id==id):a}
 else if(m=='POST'){const b=JSON.parse(o.body);r={id:'off'+Date.now().toString(36),...b,atualizado:now};await iput('proj',r);await iput('queue',{id:r.id,m:'POST',t:Date.now(),body:b});r=[r]}
 else if(m=='PATCH'){const b=JSON.parse(o.body),p=(await iget('proj',id))||{id},n={...p,...b};await iput('proj',n);const e=await iget('queue',id);
  await iput('queue',e&&e.m=='POST'?{...e,body:{...e.body,...b}}:{id,m:'PATCH',t:e?e.t:Date.now(),body:{...(e?e.body:{}),...b}});r=[n]}
 else{await idel('proj',id);const e=await iget('queue',id);if(e&&e.m=='POST')await idel('queue',id);else await iput('queue',{id,m:'DELETE',t:Date.now()});r=[]}
 setPill();return r}
window.v74DB=async(orig,q,o)=>{
 if(ses&&ses.access_token=='local')return orig(q,o);
 const m=o.method||'GET';
 if(navigator.onLine){try{
  if((await iall('queue')).length)await sync();
  const pend=(await iall('queue')).length;
  if(m=='GET'&&pend)return off(q,o,m);
  const r=await orig(q,o);
  if(Array.isArray(r)){
   if(m=='GET'&&/select=/.test(q))iset('proj',r).catch(()=>{});
   else if(m=='DELETE')idel('proj',idOf(q)).catch(()=>{});
   else if(r[0])iput('proj',r[0]).catch(()=>{})}
  window.v74q=0;return r}catch(e){}}
 return off(q,o,m)};
addEventListener('online',()=>{setPill();sync()});addEventListener('offline',setPill);
setTimeout(()=>{setPill();sync()},1500);setInterval(()=>{if(window.v74q)sync()},30000);

/* ================= Auto-save / recuperação de sessão ================= */
setInterval(()=>{try{if(S&&cur&&!ro&&pend)iput('bkp',{id:cur,t:Date.now(),nome:$('nm').value,dados:S})}catch(e){}},3000);
{const o=save;window.save=async function(){const r=await o.apply(this,arguments);try{if(!pend&&cur)idel('bkp',cur)}catch(e){}return r}}
window.rec=async function(p){let b=null,l=null;try{b=await iget('bkp',p.id)}catch(e){}
 try{l=JSON.parse(localStorage.getItem('dce_bkp_'+p.id)||'null')}catch(e){}if(l&&(!b||l.t>b.t))b=l;
 if(ro||cur!=p.id||!b||!b.dados||!Array.isArray(b.dados.items)||b.t<=new Date(p.atualizado).getTime()+1500)return;
 if(await yes('♻️ Recuperação de sessão: encontramos alterações deste projeto ('+new Date(b.t).toLocaleString('pt-BR')+') que não chegaram a ser salvas. Recuperar?')){Object.assign(S,b.dados);$('nm').value=b.nome||p.nome;sel=null;hist=[JSON.stringify(S.items)];pp(1);draw();auto()}
 else{try{idel('bkp',p.id);localStorage.removeItem('dce_bkp_'+p.id)}catch(e){}}};
let prev=null;try{prev=JSON.parse(localStorage.getItem('dce_sess')||'null')}catch(e){}
setInterval(()=>{try{const ed=!$('vE').classList.contains('hidden');if(ed&&cur&&!ro)localStorage.setItem('dce_sess',JSON.stringify({id:cur,nome:$('nm').value,t:Date.now()}));else if(!ed)localStorage.removeItem('dce_sess')}catch(e){}},2000);
setTimeout(()=>{try{if(!prev||!prev.id||Date.now()-prev.t>6048e5||!$('vE').classList.contains('hidden')||!Array.isArray(PL))return;const p=PL.find(x=>x.id==prev.id);if(!p)return;
 const b=document.createElement('div');b.style.cssText='position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:90;background:#fff;border:2px solid #f26b21;border-radius:14px;padding:10px 14px;box-shadow:0 10px 30px #0004;font:600 13px Inter,system-ui,sans-serif;display:flex;gap:10px;align-items:center;max-width:92vw';
 b.innerHTML='<span>♻️ A sessão anterior foi fechada com "'+esc(p.nome)+'" aberto.</span><button class="btn or">Reabrir</button><button class="btn ghost">✕</button>';
 b.children[1].onclick=()=>{b.remove();ro=0;abrirProj(p)};b.children[2].onclick=()=>b.remove();document.body.appendChild(b)}catch(e){}},3800);

/* ================= Backup .dccad ================= */
const nome=()=>(typeof slug=='function'?slug($('nm').value):'')||'projeto';
const dl=(blob,n)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=n;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)};
function expD(){if(!S)return;const d=JSON.parse(JSON.stringify(S));delete d.tmp;dl(new Blob([JSON.stringify({format:'dccad',ver:'7.4',app:'DC CAD Pro',exportado:new Date().toISOString(),nome:$('nm').value,dados:d})],{type:'application/json'}),nome()+'.dccad');T('💾 Backup .dccad salvo')}
function impD(){const i=document.createElement('input');i.type='file';i.accept='.dccad,.json,application/json';i.onchange=async()=>{const f=i.files[0];if(!f)return;
 try{const j=JSON.parse(await f.text()),d=j.dados||j.d;if(!d||!Array.isArray(d.items))throw 0;delete d.pubId;
  const r=await DB('',{method:'POST',body:JSON.stringify({nome:(j.nome||f.name.replace(/\.\w+$/,''))+' (importado)',dados:d})});
  if(r&&r[0]){ro=0;roWho='';abrirProj(r[0]);T('📥 Backup importado como novo projeto')}else msg('Não foi possível criar o projeto.')}
 catch(e){msg('Arquivo inválido: não é um backup .dccad do DC CAD Pro.')}};i.click()}

/* ================= Gravador de canvas -> SVG / DXF ================= */
const mm=document.createElement('canvas').getContext('2d');
function RC(){const SP=['fillStyle','strokeStyle','lineWidth','lineCap','lineJoin','font','textAlign','globalAlpha'],o={fillStyle:'#000',strokeStyle:'#000',lineWidth:1,lineCap:'butt',lineJoin:'miter',font:'10px sans-serif',textAlign:'left',globalAlpha:1,_d:[]};
 let M=[1,0,0,1,0,0],P=[],sub=null,lx=0,ly=0;const stk=[],ops=[],PI2=Math.PI*2;
 const mul=(A,B)=>[A[0]*B[0]+A[2]*B[1],A[1]*B[0]+A[3]*B[1],A[0]*B[2]+A[2]*B[3],A[1]*B[2]+A[3]*B[3],A[0]*B[4]+A[2]*B[5]+A[4],A[1]*B[4]+A[3]*B[5]+A[5]],
 TR=(x,y)=>[M[0]*x+M[2]*y+M[4],M[1]*x+M[3]*y+M[5]],sc=()=>Math.sqrt(Math.abs(M[0]*M[3]-M[1]*M[2]))||1,
 mv=(x,y)=>{sub=[TR(x,y)];sub.l0=[x,y];P.push(sub);lx=x;ly=y},ln=(x,y)=>{if(!sub)return mv(x,y);sub.push(TR(x,y));lx=x;ly=y},
 arc=(cx,cy,r,a0,a1,ccw)=>{let d=a1-a0;if(!ccw){if(d>=PI2)d=PI2;else while(d<0)d+=PI2}else{if(d<=-PI2)d=-PI2;else while(d>0)d-=PI2}
  const n=Math.max(6,Math.ceil(Math.abs(d)/(Math.PI/30)));for(let i=0;i<=n;i++){const a=a0+d*i/n;ln(cx+r*Math.cos(a),cy+r*Math.sin(a))}},
 bez=(p)=>{const x0=lx,y0=ly;for(let i=1;i<=14;i++){const t=i/14,u=1-t;let x,y;
   if(p.length==6){x=u*u*u*x0+3*u*u*t*p[0]+3*u*t*t*p[2]+t*t*t*p[4];y=u*u*u*y0+3*u*u*t*p[1]+3*u*t*t*p[3]+t*t*t*p[5]}
   else{x=u*u*x0+2*u*t*p[0]+t*t*p[2];y=u*u*y0+2*u*t*p[1]+t*t*p[3]}ln(x,y)}},
 emit=(k,subs,extra)=>{subs=subs.filter(s=>s.length>1);if(!subs.length)return;const z=sc();ops.push({k,s:subs,c:k=='f'?o.fillStyle:o.strokeStyle,a:o.globalAlpha,w:o.lineWidth*z,cap:o.lineCap,join:o.lineJoin,dash:(o._d||[]).map(v=>v*z),...extra})},
 rectS=(x,y,w,h)=>{const s=[TR(x,y),TR(x+w,y),TR(x+w,y+h),TR(x,y+h)];s.closed=1;return s};
 Object.assign(o,{
  save(){stk.push({M:M.slice(),s:SP.map(k=>o[k]),d:o._d})},restore(){const x=stk.pop();if(x){M=x.M;SP.forEach((k,i)=>o[k]=x.s[i]);o._d=x.d}},
  translate(x,y){M=mul(M,[1,0,0,1,x,y])},scale(x,y){M=mul(M,[x,0,0,y,0,0])},rotate(a){const c=Math.cos(a),s=Math.sin(a);M=mul(M,[c,s,-s,c,0,0])},
  transform(a,b,c,d,e,f){M=mul(M,[a,b,c,d,e,f])},setTransform(a,b,c,d,e,f){M=[a,b,c,d,e,f]},resetTransform(){M=[1,0,0,1,0,0]},
  setLineDash(a){o._d=(a||[]).slice()},getLineDash(){return o._d},
  beginPath(){P=[];sub=null},moveTo:mv,lineTo:ln,
  closePath(){if(sub){sub.closed=1;const l=sub.l0;if(l)mv(l[0],l[1])}},
  arc,arcTo(x1,y1,x2,y2,r){const ax=lx-x1,ay=ly-y1,bx=x2-x1,by=y2-y1,la=Math.hypot(ax,ay),lb=Math.hypot(bx,by);if(!la||!lb||!r)return ln(x1,y1);
   const ux=ax/la,uy=ay/la,vx=bx/lb,vy=by/lb,th=Math.acos(Math.max(-1,Math.min(1,ux*vx+uy*vy)));if(th<1e-3||Math.abs(th-Math.PI)<1e-3)return ln(x1,y1);
   const d=r/Math.tan(th/2),t1=[x1+ux*d,y1+uy*d],t2=[x1+vx*d,y1+vy*d];let bx2=ux+vx,by2=uy+vy;const bl=Math.hypot(bx2,by2);bx2/=bl;by2/=bl;
   const h=r/Math.sin(th/2),c=[x1+bx2*h,y1+by2*h],a0=Math.atan2(t1[1]-c[1],t1[0]-c[0]),a1=Math.atan2(t2[1]-c[1],t2[0]-c[0]);let dd=a1-a0;while(dd>Math.PI)dd-=PI2;while(dd<-Math.PI)dd+=PI2;
   ln(t1[0],t1[1]);arc(c[0],c[1],r,a0,a0+dd,dd<0)},
  bezierCurveTo(a,b,c,d,e,f){bez([a,b,c,d,e,f]);},quadraticCurveTo(a,b,c,d){bez([a,b,c,d])},
  rect(x,y,w,h){mv(x,y);ln(x+w,y);ln(x+w,y+h);ln(x,y+h);o.closePath()},
  stroke(){emit('s',P)},fill(){emit('f',P)},
  fillRect(x,y,w,h){emit('f',[rectS(x,y,w,h)])},strokeRect(x,y,w,h){emit('s',[rectS(x,y,w,h)])},clearRect(){},
  fillText(t,x,y){const p=TR(x,y);ops.push({k:'t',t:String(t),x:p[0],y:p[1],z:parseFloat((o.font.match(/([\d.]+)px/)||[,10])[1])*sc(),r:Math.atan2(M[1],M[0]),c:o.fillStyle,al:o.textAlign,b:/bold/.test(o.font)})},
  measureText(t){mm.font=o.font;return mm.measureText(t)},drawImage(){},clip(){},
  createLinearGradient(){return{addColorStop(){}}},createRadialGradient(){return{addColorStop(){}}},ops:()=>ops});
 return new Proxy(o,{get:(t,k)=>k in t?t[k]:(()=>{}),set:(t,k,v)=>(t[k]=v,true)})}
function cap(){const c=RC();try{items(c,true)}catch(e){console.warn('v74 cap',e)}return c.ops()}
const cn=c=>{mm.fillStyle='#000';mm.fillStyle=String(c||'#000');const s=mm.fillStyle;let m=s.match(/^#([0-9a-f]{6})$/i);if(m)return['#'+m[1],1];m=s.match(/^rgba?\(([^)]+)\)/);if(m){const p=m[1].split(',').map(Number);return['#'+p.slice(0,3).map(x=>Math.round(x).toString(16).padStart(2,'0')).join(''),p[3]==null?1:p[3]]}return['#000000',1]};
const f2=n=>(+n.toFixed(2)).toString(),xe=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function box(ops){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const ex=(x,y)=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)};
 ops.forEach(o=>{if(o.k=='t'){const w=o.t.length*o.z*.6;ex(o.x-w,o.y-o.z);ex(o.x+w,o.y+o.z*.3)}else o.s.forEach(p=>p.forEach(q=>ex(q[0],q[1])))});return[x0,y0,x1,y1]}
function expSVG(){if(!S)return;const ops=cap();if(!ops.length)return msg('Projeto vazio: nada para exportar.');
 const[x0,y0,x1,y1]=box(ops),pd=40,W=x1-x0+pd*2,Hh=y1-y0+pd*2,es=parseFloat(((S.hdr&&S.hdr.esc)||'1:50').split(':')[1])||50,mmu=10/es;
 let s=`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f2(x0-pd)} ${f2(y0-pd)} ${f2(W)} ${f2(Hh)}" width="${f2(W*mmu)}mm" height="${f2(Hh*mmu)}mm">\n<title>${xe($('nm').value)} - DC CAD Pro</title>\n<rect x="${f2(x0-pd)}" y="${f2(y0-pd)}" width="${f2(W)}" height="${f2(Hh)}" fill="#fff"/>\n`;
 ops.forEach(o=>{const[c,a]=cn(o.c),al=a*(o.a==null?1:o.a);
  if(o.k=='t')s+=`<text x="${f2(o.x)}" y="${f2(o.y)}" font-size="${f2(o.z)}" font-family="Arial,Helvetica,sans-serif"${o.b?' font-weight="bold"':''} text-anchor="${o.al=='center'?'middle':o.al=='right'||o.al=='end'?'end':'start'}" fill="${c}"${al<1?` fill-opacity="${f2(al)}"`:''}${o.r?` transform="rotate(${f2(o.r*180/Math.PI)} ${f2(o.x)} ${f2(o.y)})"`:''}>${xe(o.t)}</text>\n`;
  else{const d=o.s.map(p=>'M'+p.map(q=>f2(q[0])+' '+f2(q[1])).join('L')+(p.closed?'Z':'')).join('');
   s+=o.k=='f'?`<path d="${d}" fill="${c}"${al<1?` fill-opacity="${f2(al)}"`:''} stroke="none"/>\n`:`<path d="${d}" fill="none" stroke="${c}"${al<1?` stroke-opacity="${f2(al)}"`:''} stroke-width="${f2(o.w)}" stroke-linecap="${o.cap=='butt'?'butt':o.cap}" stroke-linejoin="${o.join}"${o.dash.length?` stroke-dasharray="${o.dash.map(f2).join(' ')}"`:''}/>\n`}});
 dl(new Blob([s+'</svg>'],{type:'image/svg+xml'}),nome()+'.svg');T('🖼 SVG exportado (escala '+((S.hdr&&S.hdr.esc)||'1:50')+')')}
function expDXF(){if(!S)return;const ops=cap();if(!ops.length)return msg('Projeto vazio: nada para exportar.');
 const AC=[[1,255,0,0],[2,255,255,0],[3,0,200,0],[4,0,255,255],[5,0,0,255],[6,255,0,255],[7,0,0,0],[8,100,100,100],[9,160,160,160],[30,255,127,0],[40,255,191,0]],Ly={},E=[],w=(c,v)=>E.push(c+'\n'+v),K=10;
 const lay=c=>{const[h]=cn(c),r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);let best=AC[6],bd=1e9;AC.forEach(a=>{const d=(a[1]-r)**2+(a[2]-g)**2+(a[3]-b)**2;if(d<bd){bd=d;best=a}});const n='COR_'+h.slice(1).toUpperCase();Ly[n]=best[0];return n},
 X=x=>(x*K).toFixed(3),Y=y=>(-y*K).toFixed(3);
 ops.forEach(o=>{const L=lay(o.c);
  if(o.k=='t'){const al=o.al=='center'?1:(o.al=='right'||o.al=='end')?2:0;w(0,'TEXT');w(8,L);w(10,X(o.x));w(20,Y(o.y));w(30,0);w(40,(o.z*K).toFixed(3));w(1,o.t);if(o.r)w(50,(-o.r*180/Math.PI).toFixed(2));if(al){w(72,al);w(11,X(o.x));w(21,Y(o.y));w(31,0)}}
  else o.s.forEach(p=>{const q=p.closed?p.concat([p[0]]):p;for(let i=1;i<q.length;i++){if(q[i][0]==q[i-1][0]&&q[i][1]==q[i-1][1])continue;w(0,'LINE');w(8,L);w(10,X(q[i-1][0]));w(20,Y(q[i-1][1]));w(30,0);w(11,X(q[i][0]));w(21,Y(q[i][1]));w(31,0)}})});
 const H=['0\nSECTION','2\nHEADER','9\n$ACADVER','1\nAC1009','9\n$DWGCODEPAGE','3\nANSI_1252','0\nENDSEC','0\nSECTION','2\nTABLES','0\nTABLE','2\nLTYPE','70\n1','0\nLTYPE','2\nCONTINUOUS','70\n0','3\nSolid line','72\n65','73\n0','40\n0.0','0\nENDTAB','0\nTABLE','2\nLAYER','70\n'+Object.keys(Ly).length];
 Object.entries(Ly).forEach(([n,c])=>H.push('0\nLAYER','2\n'+n,'70\n0','62\n'+c,'6\nCONTINUOUS'));
 const txt=H.concat(['0\nENDTAB','0\nENDSEC','0\nSECTION','2\nENTITIES'],E,['0\nENDSEC','0\nEOF']).join('\r\n')+'\r\n';
 dl(new Blob([Uint8Array.from(txt,c=>{const k=c.charCodeAt(0);return k<256?k:63})],{type:'application/dxf'}),nome()+'.dxf');T('📐 DXF exportado (unidade: mm, escala 1:1)')}

/* ================= REST helper + QR no carimbo ================= */
const HD=()=>({apikey:CFG.key,Authorization:'Bearer '+(ses&&ses.access_token&&ses.access_token!='local'?ses.access_token:CFG.key),'Content-Type':'application/json'});
async function rest(p,o={},auth){const go=()=>fetch(CFG.url+p,{...o,headers:{...HD(),...(o.headers||{})}});let r=await go();
 if(r.status==401&&auth&&ses&&ses.refresh_token){const d=await api('/auth/v1/token?grant_type=refresh_token',{refresh_token:ses.refresh_token});if(d.access_token){ses=d;localStorage.setItem('dce_ses',JSON.stringify(d));r=await go()}}return r}
window.v74DrawQR=(g,Q,x,y,s)=>{g.save();g.fillStyle='#fff';g.fillRect(x,y,s,s);const q=2,m=s/(Q.n+q*2);g.fillStyle='#000';for(let r=0;r<Q.n;r++)for(let c=0;c<Q.n;c++)if(Q.d(r,c))g.fillRect(x+(c+q)*m,y+(r+q)*m,m+.3,m+.3);g.restore()};
async function prepQR(){window.v74QR=null;
 try{if(!S||ro||S.noqr||!navigator.onLine||!ses||ses.access_token=='local'||typeof qrcode=='undefined')return;
  S.pubId=S.pubId||Array.from(crypto.getRandomValues(new Uint8Array(10)),b=>'abcdefghijklmnopqrstuvwxyz0123456789'[b%36]).join('');
  const d=JSON.parse(JSON.stringify(S));if(d.hdr)delete d.hdr.logo;delete d.tmp;
  const r=await rest('/rest/v1/pub_projetos?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:S.pubId,nome:$('nm').value,dados:d,atualizado:new Date().toISOString()})},1);
  if(!r.ok)return;const q=qrcode(0,'M');q.addData(location.origin+'/#v='+S.pubId);q.make();window.v74QR={n:q.getModuleCount(),d:(a,b)=>q.isDark(a,b)}}catch(e){}}
{const o=pdfGo;window.pdfGo=async function(){try{await prepQR();return await o.apply(this,arguments)}finally{window.v74QR=null}}}
/* visualização online (#v=id) — somente leitura */
async function abreV(){if(shOk||!location.hash.startsWith('#v='))return false;
 try{const r=await rest('/rest/v1/rpc/get_pub',{method:'POST',body:JSON.stringify({p_id:location.hash.slice(3)})}),j=await r.json();if(!j||!j.dados)return false;
  shOk=1;ro=1;roWho='Visualização online';abrirProj({id:'pub',nome:j.nome,dados:j.dados});$('bBk').onclick=()=>{location.href='/'};return true}catch(e){return false}}
{const o=rota;rota=async function(){if(location.hash.startsWith('#v=')&&await abreV())return;return o()}}
setTimeout(()=>{if(location.hash.startsWith('#v=')&&$('vE').classList.contains('hidden'))abreV()},1200);

/* ================= Instalar app (PWA) ================= */
let ip;addEventListener('beforeinstallprompt',e=>{e.preventDefault();ip=e});
async function instalar(){if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)return msg('O app já está instalado ✅');
 if(ip){ip.prompt();await ip.userChoice;ip=null;return}
 msg('Para instalar:\n\n📱 iPhone/iPad (Safari): Compartilhar › "Adicionar à Tela de Início".\n🤖 Android (Chrome): menu ⋮ › "Instalar app".\n💻 PC (Chrome/Edge): ícone de instalar na barra de endereço.')}

/* ================= Perfil público / Vitrine ================= */
const wa=(n,t)=>{n=String(n||'').replace(/\D/g,'');if(n.length<=11)n='55'+n;return'https://wa.me/'+n+'?text='+encodeURIComponent(t)};
function stats(){const L=(typeof PL!='undefined'&&Array.isArray(PL))?PL:[];let pts=0;L.forEach(p=>((p.dados&&p.dados.items)||[]).forEach(t=>{if(t.t=='sym')pts++}));
 const sc=L.length*10+pts,nivel=[[1500,'💎 Diamante'],[600,'🥇 Ouro'],[200,'🥈 Prata'],[50,'🥉 Bronze'],[0,'🌱 Iniciante']].find(x=>sc>=x[0])[1],selos=[];
 if(L.length>=1)selos.push('🏠 Primeiro projeto');if(L.length>=5)selos.push('📐 5 projetos');if(L.length>=10)selos.push('🏗️ 10 projetos');if(pts>=500)selos.push('🔌 500 pontos');if(pts>=2000)selos.push('⚡ 2.000 pontos');return{proj:L.length,pts,nivel,selos}}
window.v77stats=stats;
const perfil=()=>window.perfis77?window.perfis77.mine():msg('Carregando... tente de novo.');

/* ================= Menus / botões ================= */
window.v74menu=()=>[['💾','Backup: exportar .dccad',expD,'or'],['📥','Backup: importar .dccad',impD],['🖼','Exportar SVG (vetor)',expSVG],['📐','Exportar DXF (CAD)',expDXF],
 ['🔳','QR no carimbo do PDF: '+((S&&S.noqr)?'desligado':'ligado'),()=>{S.noqr=!S.noqr;auto();T('QR no carimbo: '+(S.noqr?'desligado':'ligado'))}],['🪪','Meu cartão digital',perfil],['📲','Instalar app',instalar]];
{const n=Q1('#bNew');if(n){const mk=(id,h,f)=>{const b=document.createElement('button');b.id=id;b.className='btn ghost';b.innerHTML=h;b.onclick=f;return b};
 n.after(mk('bImp74','📥<span class="lb">&nbsp;Importar .dccad</span>',impD),mk('bPf74','🪪<span class="lb">&nbsp;Meu cartão</span>',perfil))}}
window.v74={expSVG,expDXF,expD,impD,perfil,sync};
})();
