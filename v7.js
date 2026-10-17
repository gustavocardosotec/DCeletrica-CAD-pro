/* DCeletrica CAD Pro 7.0 alfa - complemento (carregado depois do index.html) */
(()=>{
const $=id=>document.getElementById(id),Z=()=>S&&!$('vE').classList.contains('hidden'),MAIN=document.querySelector('#vE main'),
brl=n=>'R$ '+(+n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}),
pts=t=>t.t=='fio'?t.pts:t.t=='cota'?[t.a,t.b]:t.t=='room'?[[t.x,t.y],[t.x+t.w,t.y+t.h]]:[[t.x,t.y]];
const css=document.createElement('style');css.textContent=`.pres #vE .eh,.pres #tb,.pres #rc,.pres #hint,.pres #bAd,.pres #mm,.pres #lib,.pres #arb{display:none!important}#xp{display:none;position:fixed;top:10px;right:10px;z-index:50}.pres #xp{display:block}.mob #mm{display:none}.mob #vE .eh>#b7{display:inline-flex!important;flex:none;min-width:46px;padding:0 10px}#lib{position:absolute;left:12px;bottom:110px;width:236px;max-height:42vh;overflow:auto;z-index:7}.lg7{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:8px}.mob #lib{left:8px;right:8px;width:auto;bottom:70px}#arb{display:none;position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:45;gap:8px;align-items:center;background:#fff;border:1px solid #dbe3ec;border-radius:99px;padding:6px 12px;box-shadow:0 6px 20px #0f2a4333}`;document.head.appendChild(css);
const win=(t,h,w)=>{const m=document.createElement('div');m.className='modal full';m.style.zIndex=85;m.innerHTML=`<div style="max-width:${w||640}px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">${t}</h3><button class="btn ghost ml-auto" data-x>✕</button></div><div data-b>${h}</div></div>`;m.onclick=e=>{if(e.target===m||e.target.dataset.x!==undefined)m.remove()};document.body.appendChild(m);return m};
const toast=m=>{let t=$('t7');if(!t){t=document.createElement('div');t.id='t7';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:95;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3500)};

/* ===== Tema ===== */
const TF={dark:'invert(.93) hue-rotate(180deg)',abnt:'none',obra:'invert(.93) hue-rotate(180deg) contrast(1.6) brightness(1.15)'};
const th=()=>{try{return localStorage.getItem('dce_th')||'dark'}catch(e){return'dark'}},ath=()=>{cv.style.filter=TF[th()]||'none'};ath();

/* ===== Camadas ===== */
const LY=[['tom','🔌 Tomadas'],['ilu','💡 Iluminação e interruptores'],['for','🔥 Força (TUE)'],['civ','🧱 Paredes, portas e janelas'],['fio','〰️ Fiação'],['txt','🔤 Textos e cotas'],['not','📝 Notas'],['ocu','🛡️ Alerta de ocupação dos eletrodutos']];
const lyOf=t=>t.t=='room'?'civ':t.t=='fio'?'fio':t.t=='cota'?'txt':t.t=='txt'?(t.note?'not':'txt'):['tb','tm','ta','td'].includes(t.k)?'tom':['luz','is','i3','i4','camp','tec'].includes(t.k)?'ilu':t.k=='tue'?'for':['porta','janela','aber'].includes(t.k)?'civ':'out';
const lyOn=t=>{if(t.hid)return false;const k=lyOf(t);return k=='out'||!(S.ly&&S.ly[k]===0)};
function camadas(){const m=win('🎚️ Camadas',LY.map(([k,n])=>`<label style="display:flex;gap:8px;align-items:center;padding:6px 0"><input type="checkbox" data-k="${k}" ${S.ly&&S.ly[k]===0?'':'checked'} style="width:18px;height:18px;accent-color:#f26b21"> ${n}</label>`).join(''),420);
 m.addEventListener('change',e=>{const k=e.target.dataset.k;if(!k)return;S.ly=S.ly||{};S.ly[k]=e.target.checked?1:0;draw();auto()})}

/* ===== Ocupação dos eletrodutos (NBR 5410: máx. 40%) ===== */
const OD={1.5:3,2.5:3.7,4:4.3,6:4.9,10:6.4,16:7.6,25:9.6,35:10.8},ND=[[16,12],[20,16],[25,22],[32,29],[40,37],[50,47],[60,57],[75,72]];
let oc=null,os='',bl=0,lastBad=0;
function occ(){const sg=cur+'|'+S.items.length+'|'+JSON.stringify(S.ov||0)+S.items.reduce((a,t)=>a+(t.t=='fio'?t.pts.length+(t.dn||0):0)+(t.c?+t.c||0:0),0);if(oc&&sg==os)return oc;os=sg;
 const cs=circs(),cm={},sy={},E=[],adj={};cs.forEach(o=>cm[o.n]=o);S.items.forEach(t=>{if(t.t=='sym'&&t.id)sy[t.id]=t});
 S.items.forEach(f=>{if(f.t!='fio'||!f.ids||f.ids.length<2)return;const a=f.ids[0],b=f.ids[f.ids.length-1];if(a&&b&&a!=b&&sy[a]&&sy[b]){const e={f,a,b};E.push(e);(adj[a]=adj[a]||[]).push(e);(adj[b]=adj[b]||[]).push(e)}});
 const own=i=>{const t=sy[i];return t&&t.c&&PW[t.k]!==undefined?[t.c]:[]},R=Object.keys(sy).find(i=>sy[i].k=='qgd'),set={},par={},ord=[];
 if(R){const seen={[R]:1},q=[R];while(q.length){const u=q.shift();ord.push(u);(adj[u]||[]).forEach(e=>{const v=e.a==u?e.b:e.a;if(!seen[v]){seen[v]=1;par[v]=e;q.push(v)}})}
  ord.forEach(u=>set[u]=new Set(own(u)));for(let i=ord.length-1;i>0;i--){const u=ord[i],e=par[u],p=e.a==u?e.b:e.a;set[u].forEach(c=>set[p].add(c))}}
 oc=E.map(e=>{const ch=R&&(par[e.b]===e?e.b:par[e.a]===e?e.a:null),cc=[...(ch&&set[ch]?set[ch]:new Set([...own(e.a),...own(e.b)]))];
  let ar=0;cc.forEach(n=>{const o=cm[n];if(o)ar+=3*Math.PI/4*(OD[o.cabo]||10)**2});
  const dn=e.f.dn||(e.f.tp=='tr'?25:20),di=(ND.find(x=>x[0]==dn)||[0,16])[1],pct=Math.round(ar/(Math.PI/4*di*di)*100),rq=ND.find(x=>ar/(Math.PI/4*x[1]*x[1])<=.4),P=e.f.pts;let len=0;for(let i=1;i<P.length;i++)len+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);
  return{f:e.f,cc,pct,dn,req:rq?rq[0]:75,len:len/U}});
 lastBad=oc.some(o=>o.pct>40);return oc}
setInterval(()=>{bl=!bl;if(lastBad&&Z()&&!drag&&!document.hidden)draw()},800);

/* ===== Seleção de área / Lupa ===== */
const AR={mode:0,m:0,rect:null,sel:[],d:null};let an=-1;
const bbox=()=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;AR.sel.forEach(t=>pts(t).forEach(q=>{a=Math.min(a,q[0]);b=Math.min(b,q[1]);c=Math.max(c,q[0]);d=Math.max(d,q[1])}));return[a,b,c,d]};
const inBox=p=>{const[a,b,c,d]=bbox(),m=14/S.v.z;return p.x>=a-m&&p.x<=c+m&&p.y>=b-m&&p.y<=d+m};
MAIN.addEventListener('mousedown',e=>{if(e.target!==cv||e.button||!Z())return;const p=wpt(e);
 if(AR.sel.length&&!AR.mode&&!e.shiftKey&&inBox(p)){e.stopPropagation();e.preventDefault();AR.d={x:p.x,y:p.y,o:AR.sel.map(t=>JSON.stringify(pts(t)))};return}
 if(AR.mode||(e.shiftKey&&tool=='sel')){e.stopPropagation();e.preventDefault();AR.m=AR.mode||'area';AR.rect={x0:p.x,y0:p.y,x1:p.x,y1:p.y};return}
 if(AR.sel.length){AR.sel=[];draw()}},true);
addEventListener('mousemove',e=>{if(!S)return;if(AR.rect){const p=wpt(e);AR.rect.x1=p.x;AR.rect.y1=p.y;draw()}
 else if(AR.d){const p=wpt(e),dx=snap(p.x-AR.d.x),dy=snap(p.y-AR.d.y);AR.sel.forEach((t,i)=>{const o=JSON.parse(AR.d.o[i]);if(t.t=='fio')t.pts=o.map(q=>[q[0]+dx,q[1]+dy]);else if(t.t=='cota'){t.a=[o[0][0]+dx,o[0][1]+dy];t.b=[o[1][0]+dx,o[1][1]+dy]}else if(t.t=='room'){t.x=o[0][0]+dx;t.y=o[0][1]+dy}else{t.x=o[0][0]+dx;t.y=o[0][1]+dy}});draw()}});
addEventListener('mouseup',()=>{if(AR.rect){const r=AR.rect;AR.rect=null;finishArea(r)}else if(AR.d){AR.d=null;auto()}});
function finishArea(r){const x0=Math.min(r.x0,r.x1),x1=Math.max(r.x0,r.x1),y0=Math.min(r.y0,r.y1),y1=Math.max(r.y0,r.y1),m=AR.m;AR.mode=0;if(x1-x0<8||y1-y0<8){draw();return}
 if(m=='lupa'){const W=cv.clientWidth,H=cv.clientHeight,z=Math.min(3,.95*W/(x1-x0),.95*H/(y1-y0));S.v.z=z;S.v.x=W/2-(x0+x1)/2*z;S.v.y=H/2-(y0+y1)/2*z;draw();return}
 AR.sel=S.items.filter(t=>lyOn(t)&&pts(t).every(q=>q[0]>=x0&&q[0]<=x1&&q[1]>=y0&&q[1]<=y1));sel=null;pp(1);an=-1;draw();toast(AR.sel.length?AR.sel.length+' item(ns): arraste para mover ou use a barra':'Nada dentro da área')}
function delArea(){const rm=new Set(AR.sel.filter(t=>t.t=='sym'&&t.id).map(t=>t.id));S.items=S.items.filter(t=>!AR.sel.includes(t)&&!(t.t=='fio'&&t.ids&&t.ids.some(i=>i&&rm.has(i))));AR.sel=[];sel=null;renum();pp(1);auto();draw()}
const arb=document.createElement('div');arb.id='arb';arb.innerHTML='<b class="text-sm"></b><button class="btn danger" data-a="del">🗑 Apagar</button><button class="btn ghost" data-a="con">🪄 Conectar</button><button class="btn ghost" data-a="clr">✕</button>';document.body.appendChild(arb);
arb.onclick=e=>{const a=e.target.dataset.a;if(a=='del')delArea();else if(a=='con')conectar();else if(a=='clr'){AR.sel=[];draw()}};
const arbU=()=>{const n=AR.sel.length;if(n==an)return;an=n;arb.style.display=n?'flex':'none';arb.querySelector('b').textContent=n+' selecionado(s)'};
function conectar(){const L=AR.sel.filter(t=>t.t=='sym'&&!DRK.includes(t.k));if(L.length<2){msg('Selecione uma área (menu 🧰 > Selecionar área, ou Shift + arrastar) com o quadro e os pontos.');return}
 const segs=[];S.items.forEach(f=>{if(f.t=='fio')for(let i=1;i<f.pts.length;i++)segs.push([f.pts[i-1],f.pts[i]])});
 const ccw=(a,b,c)=>(c[1]-a[1])*(b[0]-a[0])-(b[1]-a[1])*(c[0]-a[0]),sh=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<2,
 X=(p,q,r,u)=>!(sh(p,r)||sh(p,u)||sh(q,r)||sh(q,u))&&ccw(p,q,r)*ccw(p,q,u)<0&&ccw(r,u,p)*ccw(r,u,q)<0,
 cross=(a,b)=>segs.filter(g=>X([a.x,a.y],[b.x,b.y],g[0],g[1])).length;
 const root=L.find(t=>t.k=='qgd')||L[0],inT=[root],rest=L.filter(t=>t!==root);let n=0,nx=0;L.forEach(t=>t.id=t.id||uid());
 while(rest.length){let b=null;inT.forEach(a=>rest.forEach(r=>{const d=Math.hypot(a.x-r.x,a.y-r.y),cr=cross(a,r);if(!b||cr<b.cr||(cr==b.cr&&d<b.d))b={a,r,d,cr}}));
  const f={t:'fio',gen:0,pts:[[b.a.x,b.a.y],[b.r.x,b.r.y]],ids:[b.a.id,b.r.id]};S.items.push(f);segs.push(f.pts);nx+=b.cr;inT.push(b.r);rest.splice(rest.indexOf(b.r),1);n++}
 auto();draw();toast(n+' ligações criadas. '+(nx?nx+' cruzamento(s) não deu para evitar: mova algum ponto.':'Nenhuma cruza outra.'))}

/* ===== Desenho: camadas, ocupação, notas, seleção ===== */
const _it=items;items=function(c,clean){const all=S.items;S.items=all.filter(t=>!t.note&&(clean||lyOn(t)));try{_it(c,clean)}finally{S.items=all}if(clean)return;
 try{if(!(S.ly&&S.ly.ocu===0)){c.save();c.lineCap='round';occ().forEach(o=>{if(!o.cc.length||!lyOn(o.f))return;const bad=o.pct>40;c.globalAlpha=bad?(bl?.8:.35):.45;c.strokeStyle=bad?'#f97316':o.pct>30?'#eab308':'#06b6d4';c.lineWidth=6;c.beginPath();o.f.pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();
  if(bad){const p=o.f.pts,i=Math.floor((p.length-1)/2),x=(p[i][0]+p[i+1][0])/2,y=(p[i][1]+p[i+1][1])/2,t=`⚠️ ${o.pct}% ocupado - aumentar para Ø ${o.req}mm`;c.globalAlpha=1;c.font='bold 11px sans-serif';c.textAlign='center';const w=c.measureText(t).width+8;c.fillStyle='#fff';c.fillRect(x-w/2,y-18,w,15);c.strokeStyle='#f97316';c.lineWidth=1;c.strokeRect(x-w/2,y-18,w,15);c.fillStyle='#c2410c';c.fillText(t,x,y-7)}});c.restore()}}catch(e){}
 all.filter(t=>t.note&&lyOn(t)).forEach(t=>{const on=t===sel;c.save();c.font='13px sans-serif';const L=String(t.s).split('\n'),w=Math.max(...L.map(l=>c.measureText(l).width))+16,h=L.length*17+12;c.shadowColor='#0004';c.shadowBlur=6;c.fillStyle='#fde047';c.fillRect(t.x-w/2,t.y-h/2,w,h);c.shadowBlur=0;c.strokeStyle=on?'#2563eb':'#ca8a04';c.lineWidth=on?2:1;c.strokeRect(t.x-w/2,t.y-h/2,w,h);c.fillStyle='#422006';c.textAlign='center';L.forEach((l,i)=>c.fillText(l,t.x,t.y-h/2+19+i*17));c.restore()});
 if(AR.rect){const r=AR.rect,k=AR.m=='lupa'?'#16a34a':'#2563eb';c.save();c.strokeStyle=k;c.fillStyle=k+'22';c.setLineDash([6,4]);c.lineWidth=1.5;c.fillRect(r.x0,r.y0,r.x1-r.x0,r.y1-r.y0);c.strokeRect(r.x0,r.y0,r.x1-r.x0,r.y1-r.y0);c.restore()}
 if(AR.sel.length){const[a,b,d,e]=bbox();c.save();c.strokeStyle='#2563eb';c.lineWidth=1.5;c.setLineDash([6,4]);c.strokeRect(a-10,b-10,d-a+20,e-b+20);c.setLineDash([]);AR.sel.forEach(t=>{if(t.t=='sym'||t.t=='txt'){c.beginPath();c.arc(t.x,t.y,13,0,7);c.stroke()}});c.restore()}};
const _ht=hit;hit=p=>{const t=_ht(p);return t&&!lyOn(t)?null:t};
const _lt=lblTxt;lblTxt=t=>t.lh?'':_lt(t);
const _pp=pp;pp=function(rb){_pp(rb);if(rb&&sel&&sel.t=='sym'&&LBK.includes(sel.k)&&$('bD')){const d=document.createElement('label');d.style.cssText='display:flex;gap:6px;align-items:center';d.innerHTML=`<input type="checkbox" ${sel.lh?'checked':''}> Ocultar legenda`;d.firstChild.onchange=e=>{sel.lh=e.target.checked;draw();auto()};$('pp').insertBefore(d,$('bD'))}};
const _ge=gerar;gerar=async function(){const nt=S.items.filter(t=>t.note);S.items=S.items.filter(t=>!t.note);try{return await _ge()}finally{S.items.push(...nt)}};$('bGe').onclick=()=>gerar();
const _ap=abrirProj;abrirProj=function(p){AR.sel=[];AR.rect=null;AR.mode=0;an=-1;_ap(p);ath()};
let ex7=null;const _pl=place;place=function(p){const n=S.items.length;_pl(p);if(ex7&&S.items.length>n&&sel&&sel.t=='sym'){['p','nm','v'].forEach(k=>{if(ex7[k])sel[k]=ex7[k]});pp(1)}};
const _mt=markTool;markTool=function(){_mt();if(ex7&&tool!=ex7.k)ex7=null};

/* ===== Desfazer / Refazer ===== */
const rd={s:[],b:null},_un=undo;undo=function(){if(hist.length<2)return;rd.s.push(hist[hist.length-1]);AR.sel=[];_un();rd.b=hist[hist.length-1]};
function redo(){if(!rd.s.length||hist[hist.length-1]!==rd.b){rd.s=[];return}const j=rd.s.pop();hist.push(j);S.items=JSON.parse(j);rd.b=j;sel=null;wire=null;cw=null;AR.sel=[];pp(1);draw();auto()}
{const rb=document.createElement('button');rb.id='bRd';rb.className='btn ghost';rb.title='Refazer (Ctrl+Y)';rb.innerHTML='↷<span class="lb">Refazer</span>';$('bUn').after(rb);rb.onclick=redo;$('bUn').onclick=()=>undo()}

/* ===== Minimapa ===== */
const mm=document.createElement('canvas');mm.id='mm';mm.width=160;mm.height=110;mm.style.cssText='position:absolute;right:12px;bottom:64px;width:160px;height:110px;background:#fffffff0;border:1px solid #dbe3ec;border-radius:10px;box-shadow:0 2px 8px #0002;z-index:6;cursor:pointer';MAIN.appendChild(mm);
let mb=null,fz=0;try{if(localStorage.getItem('dce_mm')=='0')mm.style.display='none'}catch(e){}
function mmDraw(){if(!S||mm.style.display=='none')return;const g=mm.getContext('2d');g.clearRect(0,0,160,110);const W=cv.clientWidth,H=cv.clientHeight,v=S.v,vx0=-v.x/v.z,vy0=-v.y/v.z,vx1=vx0+W/v.z,vy1=vy0+H/v.z;
 if(!fz||!mb){const ps=[];S.items.forEach(t=>ps.push(...pts(t)));const xs=[vx0,vx1,...ps.map(p=>p[0])],ys=[vy0,vy1,...ps.map(p=>p[1])],x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),s=Math.min(150/(x1-x0||1),100/(y1-y0||1));mb={s,ox:5-x0*s+(150-(x1-x0)*s)/2,oy:5-y0*s+(100-(y1-y0)*s)/2}}
 const{s,ox,oy}=mb;g.strokeStyle='#334155';g.lineWidth=1;S.items.forEach(t=>{if(t.t=='room')g.strokeRect(t.x*s+ox,t.y*s+oy,t.w*s,t.h*s);else if(t.t=='sym'&&!DRK.includes(t.k)){g.fillStyle='#f26b21';g.fillRect(t.x*s+ox-1,t.y*s+oy-1,2,2)}});
 g.strokeStyle='#2563eb';g.lineWidth=2;g.strokeRect(vx0*s+ox,vy0*s+oy,(vx1-vx0)*s,(vy1-vy0)*s)}
const mmGo=e=>{if(!mb)return;const r=mm.getBoundingClientRect(),wx=((e.clientX-r.left)*160/r.width-mb.ox)/mb.s,wy=((e.clientY-r.top)*110/r.height-mb.oy)/mb.s;S.v.x=cv.clientWidth/2-wx*S.v.z;S.v.y=cv.clientHeight/2-wy*S.v.z;draw()};
mm.onpointerdown=e=>{fz=1;mmGo(e);mm.setPointerCapture(e.pointerId);mm.onpointermove=mmGo};mm.onpointerup=()=>{fz=0;mm.onpointermove=null};
const _dr=draw;draw=function(c){_dr(c);if(!c){mmDraw();arbU()}};

/* ===== Apresentação, atalhos e ajuda ===== */
const pres=()=>{document.documentElement.classList.toggle('pres');setTimeout(()=>draw(),60)};
{const x=document.createElement('button');x.id='xp';x.className='btn ghost';x.textContent='✕ Sair da apresentação';x.onclick=pres;document.body.appendChild(x)}
function help(){win('⌨️ Atalhos',`<div class="text-sm" style="line-height:1.9"><b>T</b> tomada • <b>L</b> ponto de luz • <b>E</b> eletroduto<br><b>Ctrl+Z</b> desfazer • <b>Ctrl+Y</b> refazer • <b>Ctrl+D</b> duplicar<br><b>Shift + arrastar</b> seleciona uma área (mover / apagar com Delete)<br><b>Z</b> lupa (arraste um retângulo para dar zoom)<br><b>F</b> modo apresentação • <b>F1</b> ou <b>?</b> esta ajuda<br><b>Botão direito</b> em um item: menu rápido<br><b>Esc</b> cancela • <b>Espaço + arrastar</b> move a vista</div>`,460)}
let lastAct=Date.now();['pointerdown','keydown'].forEach(n=>addEventListener(n,()=>lastAct=Date.now(),true));
addEventListener('keydown',e=>{if(!Z()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||document.querySelector('.modal:not(.hidden),#mSh'))return;const k=e.key.toLowerCase(),c=e.ctrlKey||e.metaKey;
 if(c&&(k=='y'||(k=='z'&&e.shiftKey))){e.preventDefault();redo();return}if(c&&k=='d'){e.preventDefault();$('bDu').click();return}if(c)return;
 if(e.key=='F1'||e.key=='?'){e.preventDefault();help();return}
 if(e.key=='Escape'){AR.sel=[];AR.mode=0;AR.rect=null;draw();return}
 if((e.key=='Delete'||e.key=='Backspace')&&AR.sel.length){e.preventDefault();delArea();return}
 const m={t:'tb',l:'luz',e:'fio'}[k];if(m){tool=m;wire=null;cw=null;markTool();return}
 if(k=='f')pres();else if(k=='z'){AR.mode='lupa';toast('Lupa: arraste um retângulo sobre a área')}});

/* ===== Menu do botão direito ===== */
cv.addEventListener('contextmenu',e=>{if(tool!='sel'||!Z())return;const t=hit(wpt(e));if(!t)return;sel=t;pp(1);draw();
 const o=[];if(t.t!='fio'&&t.t!='cota')o.push(['dup','📋 Duplicar']);if(t.t=='sym'&&!AUT.includes(t.k))o.push(['rot','🔄 Girar 90º']);if(t.k=='porta')o.push(['flip','↔ Espelhar']);if(t.t=='sym'&&t.c)o.push(['circ','📊 Detalhes do circuito']);if(t.t=='room'&&t.h)o.push(['ilu','💡 Calcular iluminação mínima']);o.push(['del','🗑 Apagar e reanalisar']);
 const m=document.createElement('div');m.className='pop';m.style.cssText=`position:fixed;z-index:95;left:${Math.min(e.clientX,innerWidth-230)}px;top:${Math.min(e.clientY,innerHeight-o.length*44-20)}px;min-width:210px;padding:6px`;m.innerHTML=o.map(([a,n])=>`<button class="it" data-a="${a}">${n}</button>`).join('');
 m.onclick=ev=>{const a=ev.target.dataset.a;m.remove();if(a=='dup')$('bDu').click();else if(a=='rot')$('bRo').click();else if(a=='flip'){sel.fl=!sel.fl;draw();auto()}else if(a=='circ')openQd(t.c);else if(a=='ilu')ilum(t);else if(a=='del')del()};
 document.body.appendChild(m);setTimeout(()=>document.addEventListener('pointerdown',()=>m.remove(),{once:true,capture:true}),0)});

/* ===== Iluminação mínima do cômodo ===== */
function ilum(r){const a=r.w*r.h/U/U,va=a<=6?100:100+60*Math.floor((a-6)/4),n=a>16?2:1,per=Math.round(va/n);
 yes(`Cômodo de ${a.toFixed(1).replace('.',',')} m²\nNBR 5410: 100 VA nos primeiros 6 m² + 60 VA a cada 4 m² inteiros a mais.\n\nMínimo: ${va} VA de iluminação (${n} ponto${n>1?'s':''} de ${per} VA).\n\nInserir no centro do cômodo?`).then(ok=>{if(!ok)return;
  const cl=circs().find(o=>o.k=='luz'),c=cl?cl.n:String(Math.max(0,...S.items.filter(t=>t.t=='sym'&&t.c).map(t=>+t.c||0))+1);
  for(let i=0;i<n;i++){const f=n==1?.5:i?.75:.25;S.items.push({t:'sym',k:'luz',x:r.w>=r.h?r.x+r.w*f:r.x+r.w/2,y:r.w>=r.h?r.y+r.h/2:r.y+r.h*f,rot:0,c:String(c),p:per+'VA',cmd:'a',v:V0(),len:90,id:uid()})}
  auto();draw();toast(n+' ponto(s) de luz inseridos no circuito '+c)})}
const ilumSel=()=>sel&&sel.t=='room'&&sel.h?ilum(sel):msg('Toque em um cômodo para selecioná-lo e tente de novo (ou use o botão direito nele).');

/* ===== Auditor NBR + queda de tensão ===== */
function audit(){const cs=circs(),Q=S.items.find(t=>t.t=='sym'&&t.k=='qgd'),sy=S.items.filter(t=>t.t=='sym'),L=[],nm=o=>`Circ. ${o.n} (${o.d})`,TUGK=['tb','tm','ta','td'];
 const sem=sy.filter(t=>PW[t.k]!==undefined&&!t.c).length;if(sem)L.push(['w',`${sem} ponto(s) sem número de circuito.`]);
 if(cs.length&&!Q)L.push(['w','Nenhum quadro (QDC) no desenho: não dá para medir a queda de tensão.']);
 cs.forEach(o=>{if(!o.ok)L.push(['e',`${nm(o)}: cabo de ${o.cabo} mm² não suporta o disjuntor de ${o.b} A.`]);
  const a=dim({k:o.k,w:o.w,v:o.v,fca:(S.fca||{})[o.n]});if(o.cabo<a.cabo)L.push(['e',`${nm(o)}: cabo ${o.cabo} mm², mas a potência exige ${a.cabo} mm².`]);
  const tg=sy.filter(t=>t.c==o.n&&TUGK.includes(t.k)).length;if(tg>10)L.push(['w',`${nm(o)}: ${tg} tomadas no mesmo circuito (boa prática: dividir).`]);
  if(Q){const far=Math.max(0,...sy.filter(t=>t.c==o.n).map(t=>Math.abs(t.x-Q.x)+Math.abs(t.y-Q.y)))/U*1.1+2,I=o.w/o.v,dvf=s=>2*.0225*far*I/s/o.v*100,dv=dvf(o.cabo);
   if(dv>4){const s2=SEC.find(s=>s>o.cabo&&dvf(s)<=4&&IZ[s]*FD>=o.b)||SEC.find(s=>s>o.cabo&&IZ[s]*FD>=o.b);L.push(['w',`${nm(o)}: queda de tensão ~${dv.toFixed(1)}% (limite 4%), a ~${far.toFixed(0)} m do quadro.`,s2?o.n+'|'+s2:null,s2])}}});
 S.items.filter(r=>r.t=='room'&&r.h>0).forEach(r=>{const ins=sy.filter(t=>t.x>=r.x-20&&t.x<=r.x+r.w+20&&t.y>=r.y-20&&t.y<=r.y+r.h+20),lb=S.items.find(t=>t.t=='txt'&&!t.note&&t.x>r.x&&t.x<r.x+r.w&&t.y>r.y&&t.y<r.y+r.h),n=lb?lb.s:(r.w/U).toFixed(1)+'x'+(r.h/U).toFixed(1)+' m';
  if(!ins.some(t=>t.k=='luz'))L.push(['w',`${n}: sem ponto de luz.`]);if(!ins.some(t=>[...TUGK,'tue'].includes(t.k)))L.push(['w',`${n}: sem tomada.`])});
 {const lm=S.cfg.lim||{},kva=cs.reduce((a,o)=>a+o.w,0)/1000,bi=S.cfg.forn=='bi',mx=bi?lm.bi:lm.mono,cn=S.cfg.conc?' ('+S.cfg.conc+')':'';if(mx&&kva>mx)L.push(['w',`Carga instalada de ${kva.toFixed(1).replace('.',',')} kVA acima do limite informado para ${bi?'bifásico':'monofásico'}: ${mx} kVA${cn}.`]);if(lm.dg){const I=kva*1000/(bi?220:+S.cfg.fase||127);if(I>lm.dg)L.push(['w',`Corrente total estimada de ${I.toFixed(0)} A (sem fator de demanda) acima do disjuntor geral informado: ${lm.dg} A${cn}.`])}}
 try{const seen={};occ().filter(o=>o.pct>40).forEach(o=>{const t=`Eletroduto com ${o.pct}% de ocupação (máx. 40%): aumentar para Ø ${o.req} mm.`;if(!seen[t]){seen[t]=1;L.push(['e',t])}})}catch(e){}
 const m=win('🔍 Auditoria NBR 5410',`<p class="text-sm">${L.length?`<b>${L.filter(x=>x[0]=='e').length}</b> erro(s) • <b>${L.filter(x=>x[0]=='w').length}</b> aviso(s)`:'✅ Nenhum problema encontrado.'}${S.cfg.conc?' • Concessionária: '+esc(S.cfg.conc):''}</p>`+L.map(x=>`<div class="qcc ${x[0]=='e'?'bad':''}" style="font-size:13px">${x[0]=='e'?'⛔':'⚠️'} ${esc(x[1])}${x[2]?`<div class="mt-1"><button class="btn ghost" data-ap="${x[2]}">Usar cabo ${x[3]} mm²</button></div>`:''}</div>`).join('')+'<p class="text-xs mt-3" style="color:#64748b">Verificação de apoio, estimada (distâncias em linha reta + 10%). Confira sempre com a NBR 5410 e a sua concessionária.</p>',620);
 m.addEventListener('click',e=>{const a=e.target.dataset.ap;if(!a)return;const[n,s]=a.split('|');S.ov[n]=S.ov[n]||{};S.ov[n].cabo=+s;auto();draw();m.remove();audit()})}

/* ===== Orçamento, proposta em PDF e WhatsApp ===== */
function orcCalc(){const cs=circs(),R=matList(cs).map(r=>[r[0],r[1],r[2]]),cab={};try{occ().forEach(o=>o.cc.forEach(n=>{const x=cs.find(c=>c.n==n);if(x)cab[x.cabo]=(cab[x.cabo]||0)+o.len*3}))}catch(e){}
 Object.keys(cab).sort((a,b)=>a-b).forEach(s=>R.push([`Cabo ${s} mm² (F+N+T, aprox.)`,Math.ceil(cab[s]),'m']));
 const pr=S.pr||{};let tm=0;const rows=R.map(r=>{const q=parseFloat(String(r[1]).replace(',','.'))||0,p=+pr[r[0]]||0;tm+=q*p;return{n:r[0],q:r[1],u:r[2],p,s:q*p}}),mo=tm*((S.mo==null?60:S.mo)/100);return{rows,tm,mo,tot:tm+mo}}
function orc(){const m=win('💵 Orçamento do projeto','',720),b=m.querySelector('[data-b]');let c;
 const paint=()=>{c=orcCalc();b.innerHTML=`<p class="text-xs" style="color:#64748b">Preencha o preço médio de cada item (fica salvo no projeto). Quantidades contadas no desenho; metragens aproximadas.</p><div style="overflow:auto"><table style="width:100%;font-size:13px;border-collapse:collapse">${c.rows.map((r,i)=>`<tr style="border-bottom:1px solid #dbe3ec"><td style="padding:4px">${esc(r.n)}</td><td style="white-space:nowrap">${r.q} ${r.u}</td><td><input data-i="${i}" type="number" min="0" step="0.01" class="in" style="width:90px;padding:4px 6px" value="${r.p||''}" placeholder="R$"></td><td style="text-align:right;white-space:nowrap">${brl(r.s)}</td></tr>`).join('')}</table></div><div class="qcc">Materiais: <b>${brl(c.tm)}</b><br>Mão de obra: <input id="omo" type="number" min="0" class="in" style="width:72px;display:inline;padding:4px" value="${S.mo==null?60:S.mo}">% sobre materiais = <b>${brl(c.mo)}</b><br><span style="font-size:18px">Total: <b>${brl(c.tot)}</b></span></div><div class="flex gap-2 mt-3"><button class="btn ghost flex-1" data-pdf>📄 PDF proposta</button><button class="btn or flex-1" data-zap>📲 WhatsApp</button></div>`};
 paint();b.addEventListener('change',e=>{const i=e.target.dataset.i;if(i!==undefined){S.pr=S.pr||{};S.pr[c.rows[+i].n]=+e.target.value||0}else if(e.target.id=='omo')S.mo=+e.target.value||0;else return;auto();paint()});
 b.addEventListener('click',e=>{if(e.target.dataset.pdf!==undefined)propPdf();if(e.target.dataset.zap!==undefined)zap()})}
function propPdf(){if(!window.jspdf){alert('O gerador de PDF não carregou. Verifique a internet.');return}const c=orcCalc(),cs=circs(),h=S.hdr||{},d=new jspdf.jsPDF({unit:'mm',format:'a4'});let y=0;
 d.setFillColor(15,42,67);d.rect(0,0,210,48,'F');d.setTextColor(255);d.setFont(undefined,'bold');d.setFontSize(22);d.text('DC Elétrica Residencial',15,24);d.setFont(undefined,'normal');d.setFontSize(12);d.text('Proposta comercial - Projeto elétrico',15,34);if(h.logo){try{d.addImage(h.logo,'JPEG',165,8,30,30)}catch(e){}}
 d.setTextColor(20);d.setFontSize(15);d.setFont(undefined,'bold');d.text(String($('nm').value||'Projeto'),15,62);d.setFont(undefined,'normal');d.setFontSize(11);y=70;
 [h.cli&&'Cliente: '+h.cli,h.obra&&'Obra: '+h.obra,S.cfg.conc&&'Concessionária: '+S.cfg.conc,'Data: '+(h.data||new Date().toLocaleDateString('pt-BR')),'Carga instalada: '+(cs.reduce((a,o)=>a+o.w,0)/1000).toFixed(1).replace('.',',')+' kVA em '+cs.length+' circuitos'].filter(Boolean).forEach(l=>{d.text(l,15,y);y+=6});
 const tr=(cells,xs,bold,al)=>{if(y>278){d.addPage();y=20}d.setFont(undefined,bold?'bold':'normal');cells.forEach((t,i)=>d.text(String(t),xs[i],y,al&&al[i]?{align:'right'}:undefined));y+=6},ln=()=>{d.setDrawColor(200);d.line(15,y-4,195,y-4)};
 y+=6;d.setFontSize(13);tr(['Circuitos'],[15],1);d.setFontSize(10);tr(['Nº','Descrição','Potência (W)','Disjuntor','Cabo'],[15,30,125,150,170],1,[0,0,1,0,0]);ln();cs.forEach(o=>tr([o.n,String(o.d).slice(0,45),Math.round(o.w),o.b+' A',o.cabo+' mm²'],[15,30,125,150,170],0,[0,0,1,0,0]));
 y+=6;d.setFontSize(13);tr(['Orçamento'],[15],1);d.setFontSize(10);tr(['Item','Qtd.','Unit.','Subtotal'],[15,120,155,195],1,[0,0,1,1]);ln();c.rows.forEach(r=>tr([String(r.n).slice(0,62),r.q+' '+r.u,r.p?brl(r.p):'-',r.p?brl(r.s):'-'],[15,120,155,195],0,[0,0,1,1]));
 y+=4;tr(['Materiais',brl(c.tm)],[15,195],0,[0,1]);tr(['Mão de obra ('+(S.mo==null?60:S.mo)+'%)',brl(c.mo)],[15,195],0,[0,1]);d.setFontSize(13);tr(['TOTAL',brl(c.tot)],[15,195],1,[0,1]);
 d.setFontSize(8);d.setFont(undefined,'normal');if(y>280){d.addPage();y=20}d.text('Valores estimados com base no desenho; sujeitos a conferência em obra.',15,y+4);d.save(($('nm').value||'projeto')+'-proposta.pdf')}
function zap(){const c=orcCalc(),cs=circs(),h=S.hdr||{},t=`*Projeto elétrico - ${$('nm').value}*\n${h.cli?'Cliente: '+h.cli+'\n':''}${S.cfg.conc?'Concessionária: '+S.cfg.conc+'\n':''}Carga: ${(cs.reduce((a,o)=>a+o.w,0)/1000).toFixed(1).replace('.',',')} kVA | ${cs.length} circuitos\n${c.tot?'Orçamento: *'+brl(c.tot)+'*\n':''}\nDC Elétrica Residencial`;window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank')}

/* ===== Equilibrar fases (bifásico) ===== */
function fases(){const cs=circs();if(!cs.length){msg('Nenhum circuito ainda.');return}
 const m=win('⚖️ Equilíbrio de fases','<div class="grid grid-cols-2 gap-2"><button class="btn ghost" data-n="2">Bifásico A/B</button><button class="btn ghost" data-n="3">Trifásico R/S/T</button></div><div data-r class="mt-3"></div>',520),r=m.querySelector('[data-r]');
 const run=n=>{S.phs=n;m.querySelectorAll('[data-n]').forEach(b=>b.className='btn '+(+b.dataset.n==n?'or':'ghost'));const N=n==3?['R','S','T']:['A','B'],Lw=N.map(()=>0),ph={},bf=o=>+o.v>+S.cfg.fase,sg=[];
  const mn=k=>Lw.map((v,i)=>[v,i]).sort((a,b)=>a[0]-b[0]).slice(0,k).map(x=>x[1]);
  [...cs].filter(bf).sort((x,y)=>y.w-x.w).forEach(o=>{const ix=n==2?[0,1]:mn(2);ix.forEach(i=>Lw[i]+=o.w/2);ph[o.n]=ix.sort().map(i=>N[i]).join('+')});
  [...cs].filter(o=>!bf(o)).sort((x,y)=>y.w-x.w).forEach(o=>{const i=mn(1)[0];Lw[i]+=o.w;ph[o.n]=N[i];sg.push(o)});
  for(let k=0;k<100;k++){const hi=Lw.indexOf(Math.max(...Lw)),lo=Lw.indexOf(Math.min(...Lw)),d=Lw[hi]-Lw[lo],c=sg.find(o=>ph[o.n]==N[hi]&&o.w<d&&Math.abs(d-2*o.w)<d);if(!c)break;ph[c.n]=N[lo];Lw[hi]-=c.w;Lw[lo]+=c.w}
  S.ph=ph;auto();const tot=Lw.reduce((a,b)=>a+b,0)||1,dif=(Math.max(...Lw)-Math.min(...Lw))/tot*100;
  r.innerHTML=`<p class="text-sm">${N.map((f,i)=>`Fase ${f}: <b>${Math.round(Lw[i])} VA</b>`).join(' • ')}<br>Desequilíbrio: <b style="color:${dif<=10?'#15803d':'#b45309'}">${dif.toFixed(1)}%</b></p>`+cs.map(o=>`<div class="text-sm" style="display:flex;border-bottom:1px solid #dbe3ec;padding:4px 0"><span>Circ. ${o.n} - ${esc(o.d)}</span><b style="margin-left:auto">Fase ${ph[o.n]}</b></div>`).join('')+'<p class="text-xs mt-2" style="color:#64748b">Distribuição indicativa (circuitos de tensão maior ocupam duas fases). Fica salva no projeto.</p>'};
 m.addEventListener('click',e=>{if(e.target.dataset.n)run(+e.target.dataset.n)});run(S.phs==3||(S.phs==null&&0)?3:2)}

/* ===== Unifilar ===== */
function unif(){const cs=circs();if(!cs.length){msg('Nenhum circuito ainda.');return}const G=qdcGeo(cs),s=2,m=win('⚡ Diagrama unifilar','<canvas data-c style="width:100%;border:1px solid #dbe3ec;border-radius:10px;background:#fff"></canvas><button class="btn or w-full mt-3 py-3" data-d>⬇ Baixar PNG</button>',900),c=m.querySelector('[data-c]');
 c.width=(G.W+40)*s;c.height=(G.H+60)*s;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);qdc(g,20*s,30*s,s,cs,S.q);m.querySelector('[data-d]').onclick=()=>{const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download=($('nm').value||'projeto')+'-unifilar.png';a.click()}}

/* ===== Biblioteca de símbolos (arrastar e soltar) ===== */
const LB7=()=>{try{return JSON.parse(localStorage.getItem('dce_lib7')||'[]')}catch(e){return[]}};
const lib=document.createElement('div');lib.id='lib';lib.className='pop';lib.style.display='none';MAIN.appendChild(lib);
function put7(v,p){const o=tool,ox=ex7;let ex=null,k;if(v.startsWith('c:')){ex=LB7()[+v.slice(2)];if(!ex)return;k=ex.k}else k=v.slice(2);tool=k;ex7=ex;place(p);tool=o;ex7=ox;draw()}
function renderLib(){lib.innerHTML='<div class="flex items-center gap-2"><b class="text-sm">🧰 Símbolos</b><button class="btn ghost ml-auto" data-s title="Salvar o símbolo selecionado na biblioteca">＋ Salvar</button><button class="btn ghost" data-x>✕</button></div><div class="lg7"></div><div class="text-xs mt-2" style="color:#64748b">Arraste para a planta (ou toque e depois toque na planta). ＋ Salvar guarda o símbolo selecionado com a potência e o nome.</div>';
 const g=lib.querySelector('.lg7'),cu=LB7(),add=(k,lbl,id,ex)=>{const b=document.createElement('button');b.className='it';b.style.cssText='width:auto;flex-direction:column;padding:4px;gap:2px;font-size:10px;min-height:0;justify-content:center';b.draggable=true;b.innerHTML='<canvas width="32" height="30"></canvas><span>'+esc(lbl)+'</span>';mini(b.firstChild,k);b.ondragstart=e=>e.dataTransfer.setData('text/plain',id);b.onclick=()=>{tool=k;wire=null;cw=null;ex7=ex||null;markTool()};if(ex)b.oncontextmenu=async e=>{e.preventDefault();if(await yes('Remover "'+ex.l+'" da biblioteca?')){cu.splice(+id.slice(2),1);try{localStorage.setItem('dce_lib7',JSON.stringify(cu))}catch(x){}renderLib()}};g.appendChild(b)};
 ['tb','tm','ta','td','tue','is','i3','i4','camp','tec','luz','qgd','cx',...AUT,'porta','janela','aber'].forEach(k=>add(k,(NM[k]||k).split(' ')[0],'k:'+k));cu.forEach((x,i)=>add(x.k,x.l,'c:'+i,x))}
lib.onclick=e=>{if(e.target.dataset.x!==undefined)lib.style.display='none';if(e.target.dataset.s!==undefined){if(!sel||sel.t!='sym'){toast('Selecione um símbolo na planta primeiro');return}const a=LB7();a.push({k:sel.k,p:sel.p,nm:sel.nm,v:sel.v,l:(sel.nm||NM[sel.k]).split(' ')[0]+(sel.p?' '+sel.p:'')});try{localStorage.setItem('dce_lib7',JSON.stringify(a))}catch(x){}renderLib()}};
cv.addEventListener('dragover',e=>e.preventDefault());cv.addEventListener('drop',e=>{e.preventDefault();const v=e.dataTransfer.getData('text/plain');if(/^[kc]:/.test(v))put7(v,wpt(e))});
const libT=()=>{if(lib.style.display=='none'){renderLib();lib.style.display=''}else lib.style.display='none'};

/* ===== Notas, tempo, Copilot, visualização ===== */
async function nota(){const s=await ask('Texto da nota:',{inp:1});if(!s)return;const t={t:'txt',note:1,s,x:(cv.clientWidth/2-S.v.x)/S.v.z,y:(cv.clientHeight/2-S.v.y)/S.v.z};S.items.push(t);sel=t;pp(1);auto();draw()}
const tmr=document.createElement('span');tmr.className='text-xs';tmr.style.cssText='color:#64748b;margin:0 6px;white-space:nowrap';$('st').before(tmr);
setInterval(()=>{if(!Z())return;if(!ro&&document.visibilityState=='visible'&&Date.now()-lastAct<60000)S.tmp=(S.tmp||0)+10;const t=S.tmp||0;tmr.textContent='⏱ '+Math.floor(t/3600)+'h '+String(Math.floor(t%3600/60)).padStart(2,'0')+'m'},10000);
function ans(q){const s=q.toLowerCase().replace(/,/g,'.'),n=r=>{const x=s.match(r);return x?parseFloat(x[1]):0},w=n(/(\d+(?:\.\d+)?)\s*kw\b/)*1000||n(/(\d+(?:\.\d+)?)\s*(?:w|va)\b/),v=n(/(\d{3})\s*v\b/)||+S.cfg.fase,d=n(/(\d+(?:\.\d+)?)\s*m\b(?!²|2)/),a=n(/(\d+(?:\.\d+)?)\s*(?:m²|m2|metros)/);
 if(/ilumin/.test(s)&&a){const va=a<=6?100:100+60*Math.floor((a-6)/4);return `Iluminação mínima para ${a} m²: <b>${va} VA</b> (100 VA nos 6 primeiros m² + 60 VA a cada 4 m² inteiros).`}
 if(/queda/.test(s)&&w&&d){const r=dim({k:'tue',w,v}),I=w/v,dv=x=>2*.0225*d*I/x/v*100,s2=SEC.find(x=>x>=r.cabo&&dv(x)<=4)||35;return `Corrente ${I.toFixed(1)} A, disjuntor ${r.b} A. Com ${r.cabo} mm² a queda é ${dv(r.cabo).toFixed(1)}%: ${dv(r.cabo)>4?`use <b>${s2} mm²</b> (${dv(s2).toFixed(1)}%)`:'dentro do limite de 4%'}.`}
 if(w){const r=dim({k:'tue',w,v});return `${w} W em ${v} V: corrente ${(w/v).toFixed(1)} A, disjuntor <b>${r.b} A</b>, cabo <b>${r.cabo} mm²</b> (circuito dedicado).`}
 if(/tomada/.test(s))return 'Regra geral da NBR 5410: 1 tomada a cada 5 m de perímetro (salas e quartos), a cada 3,5 m (cozinha, copa e serviço) e pelo menos 1 no banheiro junto ao lavatório. Potência mínima: 100 VA (600 VA nas 3 primeiras da cozinha/serviço e no banheiro).';
 if(/\bdr\b|idr|diferencial/.test(s))return 'O DR de alta sensibilidade (30 mA) é proteção adicional exigida em banheiros, cozinhas, áreas de serviço, áreas externas e tomadas em geral. Aqui o IDR fica no quadro.';
 return 'Posso calcular: "chuveiro 5500w 220v", "queda de tensão 3000w 127v 40m", "iluminação 14 m²", e explicar tomadas e DR.'}
function cop(){const m=win('🤖 Copilot NBR','<p class="text-xs" style="color:#64748b">Assistente de regras da NBR 5410 (funciona sem internet; não é IA generativa). Ex.: "chuveiro 5500w 220v", "queda de tensão 3000w 127v 40m", "iluminação 14 m²", "tomadas", "DR".</p><div data-l style="max-height:45vh;overflow:auto"></div><div class="flex gap-2 mt-2"><input data-i class="in" placeholder="Pergunte..."><button class="btn ghost" data-mic>🎤</button><button class="btn or" data-go>➤</button></div>',560),l=m.querySelector('[data-l]'),i=m.querySelector('[data-i]');
 const go=()=>{const q=i.value.trim();if(!q)return;i.value='';l.insertAdjacentHTML('beforeend',`<div class="qcc" style="background:#fde9dc;border-color:#f6cdb2">${esc(q)}</div><div class="qcc" style="background:#eaf2fb;border-color:#c9dcf0">${ans(q)}</div>`);l.scrollTop=1e9};
 m.querySelector('[data-go]').onclick=go;i.onkeydown=e=>{if(e.key=='Enter')go()};const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 m.querySelector('[data-mic]').onclick=()=>{if(!SR){toast('Voz não suportada neste navegador');return}const r=new SR();r.lang='pt-BR';r.onresult=e=>{i.value=e.results[0][0].transcript;go()};r.start()}}
function cfg7(){const h=S.hdr=S.hdr||{},m=win('🎛️ Visualização e projeto',`<b class="text-sm">Tema</b><div class="grid grid-cols-3 gap-2 mt-1">${[['dark','🌙 Dark CAD'],['abnt','📄 ABNT claro'],['obra','☀️ Obra']].map(([k,n])=>`<button class="btn ${th()==k?'or':'ghost'}" data-th="${k}">${n}</button>`).join('')}</div><label>Escala do desenho<select class="in mt-1" data-sc>${['1:50','1:75','1:100'].map(x=>`<option ${(h.esc||'1:50')==x?'selected':''}>${x}</option>`).join('')}</select></label><label>Concessionária<select class="in mt-1" data-cc>${['','CPFL Paulista','Enel','Neoenergia','Cemig','Outra'].map(x=>`<option ${(S.cfg.conc||'')==x?'selected':''}>${x}</option>`).join('')}</select></label><div class="qcc"><b class="text-sm">Limites da concessionária (preencha com a norma dela)</b>${[['mono','Carga máx. monofásico (kVA)'],['bi','Carga máx. bifásico (kVA)'],['dg','Disjuntor geral máx. (A)']].map(([k,n])=>`<label>${n}<input type="number" min="0" step="any" class="in mt-1" data-lm="${k}" value="${(S.cfg.lim&&S.cfg.lim[k])||''}"></label>`).join('')}<div class="text-xs mt-1" style="color:#64748b">O auditor compara a carga do projeto com esses limites.</div></div><p class="text-xs mt-2" style="color:#64748b">Confira sempre a norma vigente da sua concessionária (entrada de serviço, caixa do medidor e aterramento). O tema não altera o PDF.</p>`,460);
 m.addEventListener('click',e=>{const k=e.target.dataset.th;if(!k)return;try{localStorage.setItem('dce_th',k)}catch(x){}ath();m.remove();cfg7()});
 m.addEventListener('change',e=>{if(e.target.dataset.sc!==undefined)h.esc=e.target.value;else if(e.target.dataset.cc!==undefined)S.cfg.conc=e.target.value;else if(e.target.dataset.lm){(S.cfg.lim=S.cfg.lim||{})[e.target.dataset.lm]=+e.target.value||0}auto()})}
const mmT=()=>{const on=mm.style.display=='none';mm.style.display=on?'':'none';try{localStorage.setItem('dce_mm',on?'1':'0')}catch(e){}draw()};

/* ===== Botão Ferramentas ===== */
function menu7(){const o0=$('mSh');if(o0)o0.remove();const it=[['🔍','Auditar NBR',audit,'or'],['💵','Orçamento',orc],['📲','Enviar ao cliente',zap],['🔗','Link do cliente (só leitura)',linkCli],['🔤','Textos e números',txts],['🔊','Som de encaixe (liga/desliga)',sndT],['⚡','Unifilar',unif],['⚖️','Equilibrar fases',fases],['💡','Iluminação do cômodo',ilumSel],['🪄','Conectar área',conectar],['▭','Selecionar área',()=>{AR.mode='area';toast('Arraste um retângulo sobre a área')}],['🔎','Lupa (Z)',()=>{AR.mode='lupa';toast('Arraste um retângulo para dar zoom')}],['🧰','Biblioteca',libT],['📝','Nota post-it',nota],['🎚️','Camadas',camadas],['🎛️','Tema e projeto',cfg7],['🗺️','Minimapa',mmT],['👁','Apresentação (F)',pres],['🤖','Copilot NBR',cop],['⌨️','Atalhos (F1)',help]];
 const o=document.createElement('div');o.id='mSh';o.innerHTML='<div><div class="gp"></div><h4>🧰 Ferramentas 7.0</h4><div class="g"></div></div>';const g=o.querySelector('.g');
 it.forEach(([i,l,f,c])=>{const b=document.createElement('button');b.className='t '+(c||'');b.innerHTML='<i>'+i+'</i><span>'+l+'</span>';b.onclick=()=>{o.remove();setTimeout(f,60)};g.appendChild(b)});o.onclick=e=>{if(e.target===o)o.remove()};document.body.appendChild(o)}
{const b=document.createElement('button');b.id='b7';b.className='btn or';b.title='Ferramentas 7.0';b.innerHTML='🧰<span class="lb">&nbsp;Ferramentas</span>';$('bCalc').before(b);b.onclick=menu7}

/* ===== Projetos: favoritos, tags, status e miniatura ===== */
const TG=[['res','#2563eb','Residencial'],['com','#dc2626','Comercial'],['ref','#16a34a','Reforma']],STS=['Em andamento','Aprovado','Finalizado'];let ftg='';
function thumb(c,p){const it=p.dados.items||[],ps=[];it.forEach(t=>{if(t.t=='room')ps.push([t.x,t.y],[t.x+t.w,t.y+t.h]);else if(t.t=='sym')ps.push([t.x,t.y])});const h=c.querySelector('.thumb');if(!h||!ps.length)return;h.innerHTML='<canvas width="300" height="84" style="width:100%;height:100%"></canvas>';h.style.fontSize='0';
 const g=h.firstChild.getContext('2d'),x0=Math.min(...ps.map(q=>q[0])),x1=Math.max(...ps.map(q=>q[0])),y0=Math.min(...ps.map(q=>q[1])),y1=Math.max(...ps.map(q=>q[1])),s=Math.min(270/(x1-x0||1),66/(y1-y0||1)),ox=15+(270-(x1-x0)*s)/2-x0*s,oy=9+(66-(y1-y0)*s)/2-y0*s;
 g.strokeStyle='#fff';g.lineWidth=1.6;it.forEach(t=>{if(t.t=='room')g.strokeRect(t.x*s+ox,t.y*s+oy,t.w*s,t.h*s);else if(t.t=='sym'&&!DRK.includes(t.k)){g.fillStyle='#f26b21';g.fillRect(t.x*s+ox-1.5,t.y*s+oy-1.5,3,3)}})}
function dash(){const g=$('gr');if(!g||!PL||!PL.length)return;let bar=$('fbar');if(!bar){bar=document.createElement('div');bar.id='fbar';bar.className='flex gap-2 mb-4 flex-wrap';bar.onclick=e=>{const b=e.target.closest('[data-t]');if(b){ftg=b.dataset.t;dash()}};g.before(bar)}
 bar.innerHTML=[['','#64748b','Todos'],...TG].map(([k,c,n])=>`<button class="btn ${ftg==k?'or':'ghost'}" data-t="${k}">${k?`<span style="width:10px;height:10px;border-radius:9px;background:${c};display:inline-block"></span>`:''}${n}</button>`).join('');
 g.querySelectorAll('.dctl').forEach(x=>x.remove());
 const cards=[...g.querySelectorAll('.card')].map(c=>{const b=c.querySelector('[data-o]'),p=b&&PL.find(x=>x.id==b.dataset.o);return p?{c,p,m:p.dados.meta=p.dados.meta||{}}:null}).filter(Boolean);
 cards.sort((a,b)=>((b.m.f||b.m.tpl)?1:0)-((a.m.f||a.m.tpl)?1:0)).forEach(({c,p,m})=>{g.appendChild(c);const tg=TG.find(t=>t[0]==m.tg);c.style.borderLeft=tg?'6px solid '+tg[1]:'';c.style.display=ftg&&m.tg!=ftg?'none':'';thumb(c,p);
  const d=document.createElement('div');d.className='dctl flex gap-2 mt-2';d.innerHTML=`<button class="btn ghost" data-f title="Favoritar">${m.f?'⭐':'☆'}</button><select class="in" style="padding:6px" data-g><option value="">Sem tag</option>${TG.map(t=>`<option value="${t[0]}" ${m.tg==t[0]?'selected':''}>${t[2]}</option>`).join('')}</select><select class="in" style="padding:6px" data-s>${STS.map(s=>`<option ${(m.st||STS[0])==s?'selected':''}>${s}</option>`).join('')}</select><button class="btn ghost" data-d title="Duplicar projeto">📋</button><button class="btn ghost" data-tp title="Marcar como modelo master">${m.tpl?'📌':'📍'}</button>`;
  const sv=()=>DB('?id=eq.'+p.id,{method:'PATCH',body:JSON.stringify({dados:p.dados})});
  d.querySelector('[data-f]').onclick=async()=>{m.f=!m.f;await sv();dash()};d.querySelector('[data-g]').onchange=async e=>{m.tg=e.target.value;await sv();dash()};d.querySelector('[data-tp]').onclick=async()=>{m.tpl=!m.tpl;await sv();dash()};d.querySelector('[data-d]').onclick=async()=>{const n=await ask('Nome do novo projeto:',{inp:1,def:m.tpl?'Novo projeto':p.nome+' (cópia)'});if(!n)return;const dd=JSON.parse(JSON.stringify(p.dados));dd.meta=Object.assign({},dd.meta,{f:false,tpl:false});dd.tmp=0;const r=await DB('',{method:'POST',body:JSON.stringify({nome:n,dados:dd})});if(r&&r[0]){toast('Projeto duplicado');await list()}else toast('Não foi possível duplicar')};d.querySelector('[data-s]').onchange=async e=>{m.st=e.target.value;await sv()};c.appendChild(d)})}
const _ls=list;list=async function(){await _ls();try{dash()}catch(e){}};

/* ===== Extras 7.0: nuvem, régua, encaixe, textos, link do cliente ===== */
const cl7=document.createElement('span');cl7.id='cl7';cl7.style.cssText='font-size:14px;margin:0 4px;cursor:default';cl7.textContent='☁️';tmr.before(cl7);
const _st=status;status=function(m){_st(m);const x=String(m||'');cl7.title=x;if(ro)cl7.textContent='👁';else if(!navigator.onLine)cl7.textContent='⚠️';else if(/^Salvando/.test(x))cl7.textContent='🔄';else if(/nuvem/.test(x))cl7.textContent='☁️✅';else if(/aparelho/.test(x))cl7.textContent='💾';else if(/erro|falh|n[ãa]o foi/i.test(x))cl7.textContent='⚠️'};
addEventListener('offline',()=>{cl7.textContent='⚠️';cl7.title='Sem internet'});addEventListener('online',()=>{cl7.textContent='☁️';cl7.title='Online'});
let mw=null,gl=null,pd=null;const sndOn=()=>{try{return localStorage.getItem('dce_snd')!='0'}catch(e){return true}};
function sndT(){try{localStorage.setItem('dce_snd',sndOn()?'0':'1')}catch(e){}toast('Som de encaixe '+(sndOn()?'ligado':'desligado'))}
let ac=null;const beep=()=>{if(!sndOn())return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=880;g.gain.value=.05;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.09);o.stop(ac.currentTime+.1)}catch(e){}};
const nearWall=t=>S.items.some(r=>{if(r.t!='room')return false;const ix=t.x>=r.x-2&&t.x<=r.x+r.w+2,iy=t.y>=r.y-2&&t.y<=r.y+r.h+2;return(ix&&(Math.abs(t.y-r.y)<=16||Math.abs(t.y-r.y-r.h)<=16))||(iy&&(Math.abs(t.x-r.x)<=16||Math.abs(t.x-r.x-r.w)<=16))});
const fx=t=>{if(!t||t.t!='sym'||t.k=='luz'||t.k=='cx'||!nearWall(t))return;beep();gl={x:t.x,y:t.y,t:Date.now()};draw()};
const _pl2=place;place=function(p){const n=S.items.length;_pl2(p);if(S.items.length>n)fx(S.items[S.items.length-1])};
cv.addEventListener('pointerdown',()=>setTimeout(()=>{pd=sel&&sel.t=='sym'?{t:sel,x:sel.x,y:sel.y}:null},0));
addEventListener('pointerup',()=>setTimeout(()=>{if(pd&&sel===pd.t&&(sel.x!=pd.x||sel.y!=pd.y))fx(sel);pd=null},0));
cv.addEventListener('pointermove',e=>{if(!S)return;const p=wpt(e);mw={x:p.x,y:p.y};if(tool=='fio'&&wire&&wire.pts&&wire.pts.length&&Z())draw()});
const _it2=items;items=function(c,clean){_it2(c,clean);if(clean)return;const z=S.v.z;
 try{if(tool=='fio'&&wire&&wire.pts&&wire.pts.length&&mw){const P=wire.pts,L=P[P.length-1],d=Math.hypot(mw.x-L[0],mw.y-L[1])/U;let tot=d;for(let i=1;i<P.length;i++)tot+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1])/U;
  const f=x=>x.toFixed(2).replace('.',','),t=`${f(d)} m  (total ${f(tot)} m)`;c.save();c.strokeStyle='#2563eb';c.lineWidth=1.5/z;c.setLineDash([6/z,4/z]);c.beginPath();c.moveTo(L[0],L[1]);c.lineTo(mw.x,mw.y);c.stroke();c.setLineDash([]);c.font=`bold ${12/z}px sans-serif`;c.textAlign='left';const w=c.measureText(t).width+8/z,x=mw.x+14/z,y=mw.y-14/z;c.fillStyle='#fff';c.fillRect(x,y-14/z,w,18/z);c.strokeStyle='#2563eb';c.lineWidth=1/z;c.strokeRect(x,y-14/z,w,18/z);c.fillStyle='#1d4ed8';c.fillText(t,x+4/z,y);c.restore()}}catch(e){}
 if(gl){const a=1-(Date.now()-gl.t)/500;if(a<=0)gl=null;else{c.save();c.strokeStyle='#f26b21';c.globalAlpha=a;c.lineWidth=3/z;c.beginPath();c.arc(gl.x,gl.y,14+(1-a)*18,0,7);c.stroke();c.restore();requestAnimationFrame(()=>draw())}}};
function txts(){const ms=mlist(),tx=S.items.filter(t=>t.t=='txt'&&!t.note),sy=S.items.filter(t=>t.t=='sym'&&LBK.includes(t.k));
 const row=(k,i,on,n)=>`<label style="display:flex;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid #dbe3ec;font-size:13px"><input type="checkbox" data-${k}="${i}" ${on?'checked':''} style="width:18px;height:18px;accent-color:#f26b21"> ${esc(n)}</label>`;
 const m=win('🔤 Textos e números',`<p class="text-xs" style="color:#64748b">Marque para mostrar, desmarque para ocultar na tela (o PDF segue as suas escolhas de legenda). Para mover, selecione e arraste na planta.</p><b class="text-sm">Textos (${tx.length})</b>${tx.map((t,i)=>row('t',i,!t.hid,t.s)).join('')||'<div class="text-xs">Nenhum.</div>'}<b class="text-sm" style="display:block;margin-top:10px">Legendas dos símbolos (${sy.length})</b>${sy.map((t,i)=>row('y',i,!t.lh,(NM[t.k]||t.k)+(lblTxt(t)?' - '+lblTxt(t):'')+(t.lh?' (oculta)':''))).join('')||'<div class="text-xs">Nenhuma.</div>'}<b class="text-sm" style="display:block;margin-top:10px">Medidas dos cômodos e cotas (${ms.length})</b>${ms.map((q,i)=>row('m',i,!q.hid,(q.k=='w'?'Largura ':q.k=='h'?'Altura ':'Cota ')+q.s)).join('')||'<div class="text-xs">Nenhuma.</div>'}<button class="btn ghost w-full mt-2" data-rst="1">↺ Reposicionar medidas</button><div class="flex gap-2 mt-3"><button class="btn ghost flex-1" data-all="1">Mostrar tudo</button><button class="btn ghost flex-1" data-all="0">Ocultar tudo</button></div>`,520);
 m.addEventListener('change',e=>{const d=e.target.dataset;if(d.t!==undefined)tx[+d.t].hid=!e.target.checked;else if(d.y!==undefined)sy[+d.y].lh=!e.target.checked;else if(d.m!==undefined){const q=ms[+d.m];q.r[{w:'hw',h:'hh',c:'ch'}[q.k]]=!e.target.checked}else return;draw();auto()});
 m.addEventListener('click',e=>{if(e.target.dataset.rst!==undefined){ms.forEach(q=>{const r=q.r;r.wdx=r.wdy=r.hdx=r.hdy=r.cdx=r.cdy=0});draw();auto();return}const a=e.target.dataset.all;if(a===undefined)return;ms.forEach(q=>q.r[{w:'hw',h:'hh',c:'ch'}[q.k]]=a=='0');tx.forEach(t=>t.hid=a=='0');sy.forEach(t=>t.lh=a=='0');draw();auto();m.remove();txts()})}
async function linkCli(){if(!S)return;const d=JSON.parse(JSON.stringify(S));if(d.hdr)delete d.hdr.logo;delete d.tmp;const j=JSON.stringify({n:$('nm').value,d});let b,z='p';
 try{if(window.CompressionStream){b=new Uint8Array(await new Response(new Blob([j]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());z='z'}}catch(e){b=null}
 if(!b)b=new TextEncoder().encode(j);let q='';b.forEach(x=>q+=String.fromCharCode(x));const u=location.origin+'/#c='+z+btoa(q).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const big=u.length>40000,m=win('🔗 Link para o cliente',`<p class="text-sm">O cliente abre o projeto <b>só para ver</b> (não edita e não precisa de conta). O link guarda uma <b>cópia de agora</b>: se você mudar o projeto depois, gere outro link.</p><textarea class="in" rows="3" readonly style="font-size:12px;word-break:break-all">${esc(u)}</textarea><p class="text-xs" style="color:${big?'#b45309':'#64748b'}">${u.length.toLocaleString('pt-BR')} caracteres${big?' - link muito grande, pode não abrir em alguns apps. Apague notas ou o logo para reduzir.':''}</p><div class="flex gap-2 mt-2"><button class="btn or flex-1" data-c>📋 Copiar</button><button class="btn ghost flex-1" data-w>📲 WhatsApp</button></div>`,560);
 m.addEventListener('click',async e=>{if(e.target.dataset.c!==undefined){try{await navigator.clipboard.writeText(u);toast('Link copiado')}catch(x){m.querySelector('textarea').select();toast('Selecione e copie o link')}}
  if(e.target.dataset.w!==undefined)window.open('https://wa.me/?text='+encodeURIComponent('Projeto elétrico - '+$('nm').value+'\n'+u),'_blank')})}
let shOk=0;async function abreCli(){if(shOk||!location.hash.startsWith('#c='))return false;try{const h=location.hash,z=h[3],raw=h.slice(4).replace(/-/g,'+').replace(/_/g,'/'),bin=atob(raw+'='.repeat((4-raw.length%4)%4)),b=Uint8Array.from(bin,c=>c.charCodeAt(0));
 const j=z=='z'?await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text():new TextDecoder().decode(b),o=JSON.parse(j);shOk=1;ro=1;roWho='Cliente';abrirProj({id:'cliente',nome:o.n,dados:o.d});$('bBk').onclick=()=>{location.href='/'};return true}catch(e){return false}}
const _rota=rota;rota=async function(){if(location.hash.startsWith('#c=')&&await abreCli())return;return _rota()};
setTimeout(()=>{if(location.hash.startsWith('#c=')&&$('vE').classList.contains('hidden'))abreCli()},900);

/* ===== Medidas dos cômodos e cotas: mover e ocultar ===== */
const MK={w:['wdx','wdy'],h:['hdx','hdy'],c:['cdx','cdy']},MZ={d:null},mf=n=>(n/U).toFixed(2)+' m';
function mlist(){const o=[];if(!S||S.nomed)return o;S.items.forEach(r=>{if(r.t=='room'){o.push({r,k:'w',ox:r.x+r.w/2,oy:r.y-8,x:r.x+r.w/2+(r.wdx||0),y:r.y-8+(r.wdy||0),s:mf(r.w),hid:r.hw});if(r.h)o.push({r,k:'h',x:r.x+r.w+14+(r.hdx||0),y:r.y+r.h/2+(r.hdy||0),s:mf(r.h),hid:r.hh})}
 else if(r.t=='cota'){const a=r.a,b=r.b,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2-6;o.push({r,k:'c',ox:mx,oy:my,x:mx+(r.cdx||0),y:my+(r.cdy||0),s:mf(Math.hypot(b[0]-a[0],b[1]-a[1])),hid:r.ch})}});return o}
const _it3=items;items=function(c,clean){if(!S||S.nomed)return _it3(c,clean);const L=mlist(),H=L.filter(m=>m.k=='h'),orig=CanvasRenderingContext2D.prototype.fillText;
 c.fillText=function(t,x,y,...a){let m=null;if(x===0&&y===0)m=H.find(q=>!q.u&&q.s==t);else m=L.find(q=>q.k!='h'&&q.s==t&&Math.abs(q.ox-x)<.5&&Math.abs(q.oy-y)<.5);
  if(!m)return orig.call(c,t,x,y,...a);if(m.u=1,m.hid)return;const r=m.r;if(m.k=='h')return orig.call(c,t,(r.hdy||0),-(r.hdx||0),...a);return orig.call(c,t,x+(r[MK[m.k][0]]||0),y+(r[MK[m.k][1]]||0),...a)};
 try{_it3(c,clean)}finally{delete c.fillText}};
const mHit=p=>{const z=1/S.v.z;return mlist().find(m=>{if(m.hid)return false;const w=m.s.length*6.6+6;return m.k=='h'?p.x>m.x-3&&p.x<m.x+15&&Math.abs(p.y-m.y)<w/2:Math.abs(p.x-m.x)<w/2&&p.y>m.y-15&&p.y<m.y+4})};
MAIN.addEventListener('mousedown',e=>{if(e.target!==cv||e.button||!Z()||tool!='sel'||AR.mode||AR.sel.length||e.shiftKey)return;const p=wpt(e),m=mHit(p);if(!m)return;e.stopPropagation();e.preventDefault();const[kx,ky]=MK[m.k];MZ.d={r:m.r,kx,ky,px:p.x,py:p.y,x0:m.r[kx]||0,y0:m.r[ky]||0}},true);
cv.addEventListener('mousemove',e=>{if(!S||tool!='sel'||MZ.d)return;if(mHit(wpt(e)))cv.style.cursor='move'});
addEventListener('mousemove',e=>{if(!MZ.d)return;const p=wpt(e),d=MZ.d;d.r[d.kx]=Math.round(d.x0+p.x-d.px);d.r[d.ky]=Math.round(d.y0+p.y-d.py);draw()});
addEventListener('mouseup',()=>{if(MZ.d){MZ.d=null;auto()}});
})();
