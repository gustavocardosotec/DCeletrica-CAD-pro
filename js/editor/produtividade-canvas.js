/* DC CAD Pro v9.0 alfa — produtividade-canvas.js: seleção por área, pincel, régua, guias, quick actions, utilitários avulsos
   (bloco movido do index.html sem nenhuma alteração de lógica) */
/* ===== v7.2 alfa: produtividade no canvas + utilitários + toques comerciais ===== */
(()=>{
const $=id=>document.getElementById(id),MAIN=document.querySelector('#vE main'),Z=()=>S&&!$('vE').classList.contains('hidden'),
nf=(n,d=2)=>(+n||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}),brl=n=>'R$ '+nf(n),
tst=m=>{let t=$('t72');if(!t){t=document.createElement('div');t.id='t72';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3000)},
mod=(t,h,w)=>{const m=document.createElement('div');m.className='modal full';m.style.zIndex=90;m.innerHTML=`<div style="max-width:${w||460}px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">${t}</h3><button class="btn ghost ml-auto" data-x>✕</button></div><div>${h}</div></div>`;m.addEventListener('click',e=>{if(e.target===m||e.target.hasAttribute('data-x'))m.remove()});document.body.appendChild(m);return m},
typing=e=>/INPUT|SELECT|TEXTAREA/.test(e.target.tagName),pres=()=>document.documentElement.classList.contains('pres');

/* ---------- faixa de avisos (modos ativos) ---------- */
const pw=document.createElement('div');pw.id='pl72';MAIN.appendChild(pw);const pills={};
function unpill(id){if(pills[id]){pills[id].remove();delete pills[id]}}
function pill(id,html,fn){let b=pills[id];if(!b){b=document.createElement('div');b.className='pl72';b.innerHTML='<span></span><button class="btn ghost" aria-label="Sair">✕</button>';pw.appendChild(b);pills[id]=b}b.firstChild.innerHTML=html;b.lastChild.onclick=fn}

/* ---------- 1) Seleção por área automática (arrastar no vazio) ---------- */
let synth=0;
cv.addEventListener('mousedown',e=>{
 if(synth||e.button||!Z()||tool!='sel'||spc||e.shiftKey||PB||RU)return;
 const p=wpt(e);if(dend(p)||corner(p)>=0||lblHit(p)||hit(p))return;
 e.stopImmediatePropagation();cdd();sel=null;pp(1);
 synth=1;try{cv.dispatchEvent(new MouseEvent('mousedown',{clientX:e.clientX,clientY:e.clientY,button:0,shiftKey:true,bubbles:true,cancelable:true}))}finally{synth=0}
 draw()},true);

/* ---------- 2) Pincel de propriedades ---------- */
let PB=null;
const fam=k=>k=='luz'?'luz':k=='tue'?'tue':['tb','tm','ta','td'].includes(k)?'tom':['is','i3','i4','camp','tec'].includes(k)?'sw':null,
FLD={luz:['c','p','v','cmd'],tom:['c','p','v'],tue:['p','v','nm'],sw:['cmd']};
function startPB(){if(!Z())return;if(ro){tst('Projeto só para visualização');return}
 if(!sel||sel.t!='sym'||!fam(sel.k)){tst('Selecione antes uma tomada, ponto de luz, TUE ou interruptor');return}
 stopRU();const f=fam(sel.k),v={};FLD[f].forEach(k=>v[k]=sel[k]);PB={src:sel,f,v};
 const rs=[v.c?'Circ. '+v.c:'',v.p||'',v.v?v.v+'V':'',v.cmd?'tecla '+v.cmd:''].filter(Boolean).join(' • ');
 pill('pb','🖌 Pincel: toque nos pontos do mesmo tipo<br><small>'+esc(rs)+'</small>',stopPB);draw()}
function stopPB(){PB=null;unpill('pb');if(S)draw()}
function applyPB(t){if(t===PB.src)return;if(fam(t.k)!=PB.f){tst('O pincel só aplica no mesmo tipo de ponto');return}
 const old=t.c;FLD[PB.f].forEach(k=>{if(PB.v[k]!==undefined)t[k]=PB.v[k]});
 if(old&&old!=t.c&&!S.items.some(i=>i.t=='sym'&&i.c==old)){renum();if(PB.f!='tue'&&PB.f!='sw')PB.v.c=PB.src.c}
 sel=t;pp(1);auto();draw();tst('Pincel aplicado'+(PB.v.c&&PB.f!='tue'&&PB.f!='sw'?' • Circ. '+PB.v.c:''))}

/* ---------- 3) Régua / medidor ---------- */
let RU=null;
const RSN=p=>{const r=12/S.v.z;let b=null,bd=r;S.items.forEach(t=>{const L=t.t=='sym'?[[t.x,t.y]]:t.t=='room'?[[t.x,t.y],[t.x+t.w,t.y],[t.x,t.y+(t.h||0)],[t.x+t.w,t.y+(t.h||0)]]:[];L.forEach(q=>{const d=Math.hypot(q[0]-p.x,q[1]-p.y);if(d<bd){bd=d;b=q}})});return b||[snap(p.x),snap(p.y)]},
rd=()=>RU&&RU.a&&RU.b?Math.hypot(RU.b[0]-RU.a[0],RU.b[1]-RU.a[1]):0,
rtx=()=>{const m=rd()/U,den=+String((S.hdr&&S.hdr.esc)||'1:50').split(':')[1]||50;return nf(m)+' m'+(m>0?' <small>('+nf(m*100/den,1)+' cm no papel 1:'+den+')</small>':'')};
function startRU(){if(!Z())return;PB&&stopPB();if(RU){stopRU();return}RU={a:null,b:null,st:0,dn:0};tool='sel';wire=null;cw=null;markTool();cv.style.cursor='crosshair';
 pill('ru','📏 Régua: toque/clique no 1º ponto',stopRU);draw()}
function stopRU(){if(!RU)return;RU=null;unpill('ru');if(cv)cv.style.cursor='';if(S)draw()}
const ruTxt=()=>{if(RU)pill('ru','📏 '+(RU.st==1?(rd()?rtx()+' • toque no 2º ponto':'Toque no 2º ponto (ou arraste)'):RU.st==2?rtx()+' • toque para nova medida':'Régua: toque/clique no 1º ponto'),stopRU)};

addEventListener('mousedown',e=>{if(!Z()||e.target!==cv||e.button||spc)return;
 if(PB){const t=hit(wpt(e));e.stopImmediatePropagation();e.preventDefault();if(t&&t.t=='sym')applyPB(t);return}
 if(RU){const q=RSN(wpt(e));e.stopImmediatePropagation();e.preventDefault();
  if(RU.st!=1){RU.a=q;RU.b=q;RU.st=1;RU.dn=1}else{RU.b=q;RU.st=2;RU.dn=0}ruTxt();draw()}},true);
addEventListener('mouseup',()=>{if(RU&&RU.dn){RU.dn=0;if(RU.st==1&&rd()*S.v.z>10){RU.st=2;ruTxt();draw()}}
 if(GD.length){GD=[];if(S)draw()}setTimeout(qaU,0)});

/* ---------- 4) Guias inteligentes + régua (movimento) ---------- */
let GD=[];
addEventListener('mousemove',e=>{if(!Z())return;
 if(RU&&RU.st==1){RU.b=RSN(wpt(e));ruTxt();draw();return}
 if(drag&&drag.m=='move'&&sel&&(sel.t=='sym'||sel.t=='txt')){const th=(COARSE?10:6)/S.v.z;let bx=null,by=null,dx=th,dy=th;
  S.items.forEach(o=>{if(o===sel)return;let X=[],Y=[];if(o.t=='sym'||o.t=='txt'){X=[o.x];Y=[o.y]}else if(o.t=='room'){X=[o.x,o.x+o.w/2,o.x+o.w];Y=o.h?[o.y,o.y+o.h/2,o.y+o.h]:[o.y]}
   X.forEach(v=>{const d=Math.abs(sel.x-v);if(d<dx){dx=d;bx=v}});Y.forEach(v=>{const d=Math.abs(sel.y-v);if(d<dy){dy=d;by=v}})});
  const had=GD.length;GD=[];if(bx!=null){sel.x=bx;GD.push({x:bx})}if(by!=null){sel.y=by;GD.push({y:by})}
  if(GD.length||had){pp();draw()}}});

/* ---------- 5) Destaque de circuito ---------- */
let HL=null;
function setHL(n){HL=n==null?null:String(n);if(HL&&S&&!S.items.some(t=>t.t=='sym'&&String(t.c)==HL))tst('Circuito '+HL+' não tem pontos no desenho');if(HL)pill('hl','🔦 Circuito '+esc(HL)+' em destaque',()=>setHL(null));else unpill('hl');if(S)draw()}
function hlDraw(c){const z=S.v.z,x=-S.v.x/z,y=-S.v.y/z,W=cv.clientWidth/z,H=cv.clientHeight/z,NEO='#00f5ff',byId={};
 S.items.forEach(t=>{if(t.id)byId[t.id]=t});
 const sy=S.items.filter(t=>t.t=='sym'&&PW[t.k]!==undefined&&String(t.c)==HL),mine=new Set(sy.map(t=>t.id).filter(Boolean)),
 ws=S.items.filter(t=>t.t=='fio'&&t.ids&&t.ids.some(i=>i&&mine.has(i))),lk=new Set(sy);
 ws.forEach(w=>w.ids.forEach(i=>{if(i&&byId[i])lk.add(byId[i])}));
 c.save();c.fillStyle='rgba(7,18,32,.85)';c.fillRect(x,y,W,H);
 c.shadowColor=NEO;c.shadowBlur=12;c.strokeStyle=NEO;c.lineWidth=2.6;c.lineJoin='round';
 ws.forEach(w=>{c.beginPath();w.pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke()});
 lk.forEach(t=>{c.save();c.translate(t.x,t.y);if(t.k!='luz'&&!AUT.includes(t.k))c.rotate(t.rot*Math.PI/180);try{sym(c,t.k,NEO,t)}catch(e){}c.restore();
  if(S.sh.r&&t.t=='sym'&&sy.includes(t)){const l=lblTxt(t),P=lblPos(t);if(l){c.shadowBlur=0;c.fillStyle=NEO;c.font='bold 11px sans-serif';c.textAlign=P.al;c.fillText(l,P.x,P.y)}}});
 c.restore()}

/* ---------- 6) Marca d'água ---------- */
const WMC={r:'#b42318',g:'#475569',b:'#1b4f7a'};
function wmDraw(c,clean){const w=S.wm;if(!w||!w.on||!w.t||(clean&&!w.pdf))return;const ps=[];
 S.items.forEach(t=>t.t=='fio'?ps.push(...t.pts):t.t=='cota'?ps.push(t.a,t.b):t.t=='room'?ps.push([t.x,t.y],[t.x+t.w,t.y+(t.h||0)]):ps.push([t.x,t.y]));if(!ps.length)return;
 const x0=Math.min(...ps.map(q=>q[0])),x1=Math.max(...ps.map(q=>q[0])),y0=Math.min(...ps.map(q=>q[1])),y1=Math.max(...ps.map(q=>q[1])),
 dg=Math.max(300,Math.hypot(x1-x0,y1-y0));c.save();c.translate((x0+x1)/2,(y0+y1)/2);c.rotate(-.42);c.globalAlpha=Math.min(.6,Math.max(.03,(w.o||15)/100));
 c.fillStyle=WMC[w.c]||WMC.r;c.textAlign='center';c.textBaseline='middle';c.font='bold 100px Inter,sans-serif';
 const sz=Math.max(40,Math.min(320,100*dg*.8/Math.max(1,c.measureText(w.t).width)));c.font='bold '+sz+'px Inter,sans-serif';c.fillText(w.t,0,0);c.restore()}
function wmCfg(){if(!Z())return;const w=S.wm=S.wm||{on:0,t:'PROJETO EM APROVAÇÃO',o:15,pdf:1,c:'r'};
 const m=mod('💧 Marca d\'água',`<label style="display:flex;gap:8px;align-items:center;cursor:pointer;margin-top:12px"><input type="checkbox" data-k="on" ${w.on?'checked':''} style="width:18px;height:18px;accent-color:#f26b21"> <b>Mostrar marca d'água</b></label>
 <label>Texto<input class="in mt-1" data-k="t" maxlength="40" value="${esc(w.t)}"></label>
 <div class="flex gap-1 flex-wrap mt-2">${['PROJETO EM APROVAÇÃO','PRÉ-PROJETO','NÃO PARA EXECUÇÃO','APROVADO'].map(x=>`<button class="btn ghost" data-pr="${x}" style="padding:4px 10px;font-size:12px">${x}</button>`).join('')}</div>
 <label>Intensidade: <b data-ov>${w.o}%</b><input type="range" min="5" max="40" value="${w.o}" data-k="o" style="width:100%;accent-color:#f26b21"></label>
 <label>Cor<select class="in mt-1" data-k="c"><option value="r" ${w.c=='r'?'selected':''}>Vermelho</option><option value="g" ${w.c=='g'?'selected':''}>Cinza</option><option value="b" ${w.c=='b'?'selected':''}>Azul</option></select></label>
 <label style="display:flex;gap:8px;align-items:center;cursor:pointer;margin-top:12px"><input type="checkbox" data-k="pdf" ${w.pdf?'checked':''} style="width:18px;height:18px;accent-color:#f26b21"> Incluir também no PDF</label>
 <p class="text-xs mt-2" style="color:#64748b">Aparece no desenho, na apresentação e no link do cliente. Desmarque "Incluir no PDF" se quiser a prancha limpa.</p>`);
 const up=e=>{const k=e.target.dataset.k;if(!k)return;w[k]=e.target.type=='checkbox'?(e.target.checked?1:0):k=='o'?+e.target.value:e.target.value;if(k=='o')m.querySelector('[data-ov]').textContent=w.o+'%';draw();auto()};
 m.addEventListener('input',up);m.addEventListener('change',up);
 m.addEventListener('click',e=>{const p=e.target.dataset.pr;if(!p)return;w.t=p;w.on=1;m.querySelector('[data-k=t]').value=p;m.querySelector('[data-k=on]').checked=true;draw();auto()})}

/* ---------- hook de desenho ---------- */
const _it=items;items=function(c,clean){_it(c,clean);if(!S)return;
 if(!clean&&HL)hlDraw(c);wmDraw(c,clean);if(clean)return;const z=S.v.z;
 if(GD.length){c.save();c.strokeStyle='#d946ef';c.lineWidth=1/z;c.setLineDash([5/z,4/z]);const x0=-S.v.x/z,y0=-S.v.y/z,x1=x0+cv.clientWidth/z,y1=y0+cv.clientHeight/z;
  GD.forEach(g=>{c.beginPath();if(g.x!=null){c.moveTo(g.x,y0);c.lineTo(g.x,y1)}else{c.moveTo(x0,g.y);c.lineTo(x1,g.y)}c.stroke()});c.restore()}
 if(RU&&RU.a&&RU.b){const[a,b]=[RU.a,RU.b],L=rd();c.save();c.strokeStyle='#e11d48';c.fillStyle='#e11d48';c.lineWidth=1.8/z;c.setLineDash([7/z,4/z]);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.setLineDash([]);
  [a,b].forEach(q=>{c.beginPath();c.arc(q[0],q[1],4.5/z,0,7);c.fill()});
  if(L>2){const t=nf(L/U)+' m',mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;c.font='bold '+13/z+'px sans-serif';const w=c.measureText(t).width+14/z,h=21/z;c.fillStyle='#fff';c.fillRect(mx-w/2,my-h-5/z,w,h);c.strokeStyle='#e11d48';c.lineWidth=1.2/z;c.strokeRect(mx-w/2,my-h-5/z,w,h);c.fillStyle='#e11d48';c.textAlign='center';c.fillText(t,mx,my-10/z)}c.restore()}};
const _dr=draw;draw=function(c){_dr(c);if(!c)qaU()};
const _mk=markTool;markTool=function(){_mk.apply(this,arguments);if(tool!='sel'){RU&&stopRU();PB&&stopPB()}
 if(tool=='sel'){const h=$('hint');if(h&&!/vazio/.test(h.innerHTML))h.innerHTML+=' &bull; <b>arraste no vazio</b> = seleção por área (mover a tela: 2 dedos, ✋ ou Espaço)'}};
const _ap=abrirProj;abrirProj=function(){stopRU();stopPB();setHL(null);return _ap.apply(this,arguments)};

/* ---------- 7) Quick Actions ---------- */
const qa=document.createElement('div');qa.id='qa72';MAIN.appendChild(qa);let qk='';
function qaU(){const t=sel,hide=()=>{qa.style.display='none';qk=''};
 if(!Z()||ro||!t||t.t=='fio'||t.t=='cota'||tool!='sel'||drag||PB||RU||pres())return hide();
 const rot=(t.t=='sym'&&!AUT.includes(t.k))||(t.t=='room'&&t.h),pb=t.t=='sym'&&fam(t.k),hl=t.t=='sym'&&t.c,
 fx=window.fx73&&fx73(t),k=[rot,pb,hl,fx].join();if(k!=qk){qk=k;qa.innerHTML=(rot?'<button data-q="rot" title="Girar 90°">⟳</button>':'')+'<button data-q="dup" title="Duplicar">⧉</button>'+(pb?'<button data-q="pb" title="Pincel de propriedades">🖌</button>':'')+(hl?'<button data-q="hl" title="Destacar circuito">🔦</button>':'')+(fx?'<button data-q="fx" title="Fechamento da caixa">🔌</button>':'')+'<button data-q="del" title="Apagar" class="dg">🗑</button>'}
 qa.style.display='flex';const z=S.v.z,w=qa.offsetWidth,Wm=MAIN.clientWidth,Hm=MAIN.clientHeight;
 let x=(t.t=='room'?t.x+t.w/2:t.x)*z+S.v.x,y=t.y*z+S.v.y-(t.t=='room'?54:62);if(y<6)y=(t.t=='room'?t.y+(t.h||0):t.y)*z+S.v.y+(t.t=='room'?10:30);
 qa.style.left=Math.max(6,Math.min(Wm-w-6,x-w/2))+'px';qa.style.top=Math.max(6,Math.min(Hm-56,y))+'px'}
qa.addEventListener('click',e=>{const a=e.target.closest('[data-q]');if(!a||!sel)return;const q=a.dataset.q;
 if(q=='rot'){if(sel.t=='room'&&sel.h){const cx0=sel.x+sel.w/2,cy0=sel.y+sel.h/2,w=sel.w,h=sel.h;sel.w=h;sel.h=w;sel.x=snap(cx0-h/2);sel.y=snap(cy0-w/2)}else sel.rot=((+sel.rot||0)+90)%360;pp(1);auto();draw()}
 else if(q=='dup')$('bDu').click();else if(q=='del')del();else if(q=='pb')startPB();else if(q=='hl')setHL(HL==String(sel.c)?null:sel.c)});

/* ---------- 8) Circuito destacável pela tabela (Quadro) ---------- */
const qc=$('qc');
new MutationObserver(()=>{qc.querySelectorAll('.qcc').forEach(d=>{if(d.querySelector('[data-hl]'))return;const r=d.querySelector('[data-r]');if(!r)return;
 const b=document.createElement('button');b.className='btn ghost ml-auto';b.dataset.hl=d.dataset.n;b.title='Destacar na planta (neon)';b.textContent='🔦';r.classList.remove('ml-auto');r.before(b)})}).observe(qc,{childList:true});
qc.addEventListener('click',e=>{const b=e.target.closest('[data-hl]');if(!b)return;e.stopPropagation();const n=b.dataset.hl;$('qx').click();setHL(n);tst('Circuito '+n+' em destaque. Toque em ✕ no aviso para sair')},true);

/* ---------- 9) Mensagem para WhatsApp ---------- */
function waCfg(){if(!Z())return;const w=S.wa=S.wa||{};let sug=0;try{const pr=S.pr||{};let tm=0;matList(circs()).forEach(r=>{tm+=(parseFloat(String(r[1]).replace(',','.'))||0)*(+pr[r[0]]||0)});sug=tm*(1+(S.mo==null?60:S.mo)/100)}catch(e){}
 const emp=(()=>{try{return JSON.parse(localStorage.getItem('dce_emp71'))||{}}catch(e){return{}}})();
 const m=mod('📲 Mensagem para o cliente',`<label>Valor do orçamento (R$)<input class="in mt-1" data-f="val" inputmode="decimal" value="${esc(w.val||'')}" placeholder="${sug?nf(sug)+' (materiais + mão de obra, sem cabos)':'ex.: 4.850,00'}"></label>
 <label>Link para o cliente (opcional)<input class="in mt-1" data-f="link" type="url" value="${esc(w.link||'')}" placeholder="Cole aqui o link gerado em Ferramentas > Link do cliente"></label>
 <label>Mensagem<textarea class="in mt-1" data-t rows="11" style="font-size:14px"></textarea></label>
 <div class="flex gap-2 mt-3"><button class="btn ghost flex-1" data-a="cp">📋 Copiar</button><button class="btn or flex-1" data-a="wa">📲 Abrir WhatsApp</button></div>`,500),ta=m.querySelector('[data-t]');
 const gen=()=>{const cs=circs(),h=S.hdr||{},kva=cs.reduce((a,o)=>a+o.w,0)/1000,L=['⚡ *Projeto elétrico — '+($('nm').value||'Projeto')+'*',''];
  if(h.cli)L.push('👤 Cliente: '+h.cli);if(S.cfg.conc)L.push('🏢 Concessionária: '+S.cfg.conc);
  L.push('🔌 Carga: '+nf(kva,1)+' kVA • '+cs.length+' circuito'+(cs.length==1?'':'s')+' • '+(S.cfg.forn=='bi'?'bifásico':'monofásico'));
  if(cs.length){L.push('','📋 *Circuitos*');cs.slice(0,14).forEach(o=>L.push('• C'+o.n+' '+o.d+' — '+o.b+' A, '+o.cabo+' mm²'));if(cs.length>14)L.push('• … e mais '+(cs.length-14))}
  const v=parseFloat(String(w.val||'').replace(/\./g,'').replace(',','.'));if(v>0)L.push('','💰 Investimento: *'+brl(v)+'*');
  if(w.link)L.push('','🔗 Veja o projeto: '+w.link);L.push('','_Projeto conforme NBR 5410._');if(emp.nome||emp.tel)L.push('— '+[emp.nome,emp.tel].filter(Boolean).join(' • '));return L.join('\n')};
 ta.value=gen();m.addEventListener('input',e=>{const f=e.target.dataset.f;if(!f)return;w[f]=e.target.value.trim();ta.value=gen()});
 m.addEventListener('click',async e=>{const a=e.target.dataset.a;if(!a)return;auto();
  if(a=='wa')window.open('https://wa.me/?text='+encodeURIComponent(ta.value),'_blank');
  else{try{await navigator.clipboard.writeText(ta.value)}catch(x){ta.select();document.execCommand('copy')}tst('Mensagem copiada! Cole no WhatsApp')}})}

/* ---------- 10) Utilitários avulsos ---------- */
const SC2=[[1.5,17.5],[2.5,24],[4,32],[6,41],[10,57],[16,76],[25,101],[35,125],[50,151],[70,192],[95,232],[120,269]],
SC3=[[1.5,15.5],[2.5,21],[4,28],[6,36],[10,50],[16,68],[25,89],[35,111],[50,134],[70,171],[95,207],[120,239]],
BRK=[10,16,20,25,32,40,50,63,70,80,100,125,160],RHO=.0206,
CD={1.5:3,2.5:3.7,4:4.3,6:4.9,10:6.2,16:7.4,25:9.2,35:10.6,50:12.5,70:14.5},
CT=[[16,12.4],[20,16.4],[25,21],[32,27.4],[40,34.8],[50,44],[60,55],[75,69],[85,79],[110,102]],
awgD=n=>.127*Math.pow(92,(36-n)/39),awgA=n=>Math.PI/4*awgD(n)**2,awgN=n=>n<=0?(1-n)+'/0':''+n,
opts=(a,s)=>a.map(x=>`<option value="${x[0]!==undefined?x[0]:x}" ${(x[0]!==undefined?x[0]:x)==s?'selected':''}>${x[1]!==undefined?x[1]:x}</option>`).join('');
const TABS=[['cabo','🔌 Cabo e disjuntor'],['duto','🧵 Eletroduto'],['wall','🚗 Carro elétrico'],['awg','🔄 AWG ⇄ mm²']];let CR=[{s:2.5,n:3,d:3.7}];
function ut(tab){document.querySelectorAll('.mUt72').forEach(x=>x.remove());let cur=tab||'cabo';
 const m=mod('🧮 Utilitários rápidos',`<div class="tb72">${TABS.map(([k,n])=>`<button data-tab="${k}">${n}</button>`).join('')}</div><div id="u72"></div>`,560);m.classList.add('mUt72');const box=m.querySelector('#u72'),v=id=>box.querySelector('#'+id);
 const tabs=()=>m.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab==cur));
 const R={cabo(){let f0=220;try{if(S&&S.cfg&&S.cfg.fase)f0=+S.cfg.fase}catch(e){}
   box.innerHTML=`<p class="text-xs" style="color:#64748b">Cobre, isolação PVC 70 °C, método B1 (NBR 5410). Folga de 20% no disjuntor, igual ao gerador do projeto.</p>
   <div class="grid grid-cols-2 gap-2"><label>Potência (W)<input id="p" class="in mt-1" type="number" min="0" value="5500" inputmode="decimal"></label><label>ou Corrente (A)<input id="i" class="in mt-1" type="number" min="0" placeholder="opcional" inputmode="decimal"></label>
   <label>Tensão (V)<select id="v" class="in mt-1">${opts([127,220,380,440],f0)}</select></label><label>Sistema<select id="s" class="in mt-1">${opts([[1,'Monofásico (F+N)'],[2,'Bifásico (F+F)'],[3,'Trifásico (3F)']],1)}</select></label>
   <label>Fator de potência<input id="fp" class="in mt-1" type="number" min=".1" max="1" step=".01" value="1"></label><label>Tipo de circuito<select id="t" class="in mt-1">${opts([['luz','Iluminação'],['tug','Tomadas (TUG)'],['tue','TUE (dedicado)']],'tue')}</select></label>
   <label>Agrupamento (FCA)<select id="f" class="in mt-1">${opts([[.9,'Padrão do app (0,90)'],[1,'1 circuito (1,00)'],[.8,'2 circuitos (0,80)'],[.7,'3 circuitos (0,70)'],[.65,'4 circuitos (0,65)'],[.6,'5 circuitos (0,60)'],[.57,'6 circuitos (0,57)']],.9)}</select></label><label>Comprimento (m)<input id="l" class="in mt-1" type="number" min="0" placeholder="p/ queda de tensão" inputmode="decimal"></label></div><div id="o" class="mt-3"></div>`;
   const go=()=>{const P=+v('p').value||0,I=+v('i').value||0,V=+v('v').value,fp=Math.min(1,Math.max(.1,+v('fp').value||1)),sy=+v('s').value,tp=v('t').value,fc=+v('f').value,L=+v('l').value||0,
    Ib=I>0?I:sy==3?P/(Math.sqrt(3)*V*fp):P/(V*fp),mb=tp=='tug'?20:10,ms=tp=='luz'?1.5:2.5,tb=sy==3?SC3:SC2,o=v('o');
    if(!(Ib>0)){o.innerHTML='<p class="text-sm" style="color:#64748b">Informe a potência ou a corrente.</p>';return}
    const In=BRK.find(x=>x>=Math.max(Ib*1.2,mb));if(!In){o.innerHTML='<p class="text-sm" style="color:#b42318">Corrente acima de 160 A: dimensione manualmente.</p>';return}
    let k=tb.findIndex(r=>r[0]>=ms&&r[1]*fc>=In);if(k<0){o.innerHTML='<p class="text-sm" style="color:#b42318">Seção acima de 120 mm²: dimensione manualmente.</p>';return}
    const qd=s=>L>0?(sy==3?Math.sqrt(3):2)*RHO*L*Ib/s/V*100:0;let up=false;while(L>0&&qd(tb[k][0])>4&&k<tb.length-1){k++;up=true}
    const[s,iz]=tb[k],q=qd(s),qok=q<=4;
    o.innerHTML=`<div class="r72"><div><small>Corrente (Ib)</small><b>${nf(Ib,1)} A</b></div><div><small>Disjuntor</small><b>${In} A</b></div><div><small>Cabo</small><b>${nf(s,s%1?1:0)} mm²</b></div><div><small>Iz corrigida</small><b>${nf(iz*fc,1)} A</b></div>${L>0?`<div style="grid-column:1/-1;${qok?'':'background:#fdecea'}"><small>Queda de tensão (${L} m)</small><b style="color:${qok?'#15803d':'#b42318'}">${nf(q)} %</b></div>`:''}</div>
    ${up?'<p class="text-xs mt-2" style="color:#b45309">⚠ Seção aumentada para manter a queda de tensão em até 4%.</p>':''}${!qok?'<p class="text-xs mt-2" style="color:#b42318">⚠ Mesmo na maior seção a queda passa de 4%.</p>':''}
    <p class="text-xs mt-2" style="color:#64748b">Condições: Ib ≤ In ≤ Iz·FCA. ${tp=='luz'?'Mín. 1,5 mm².':'Mín. 2,5 mm².'} Confirme sempre a norma e o fabricante.</p>`};
   box.oninput=box.onchange=go;go()},
  duto(){const draw=()=>{box.innerHTML=`<p class="text-xs" style="color:#64748b">Limites NBR 5410: 53% (1 cabo), 31% (2 cabos), 40% (3 ou mais). Diâmetros típicos de cabo 750 V e de eletroduto PVC: confira o catálogo do fabricante.</p>
   <div id="rw">${CR.map((r,i)=>`<div class="flex gap-2 items-end mt-2" data-i="${i}"><label style="flex:1">Seção<select class="in mt-1" data-k="s">${opts(Object.keys(CD).map(Number),r.s)}</select></label><label style="width:70px">Qtde<input class="in mt-1" data-k="n" type="number" min="1" value="${r.n}"></label><label style="width:86px">Ø ext. (mm)<input class="in mt-1" data-k="d" type="number" min="1" step=".1" value="${r.d}"></label><button class="btn danger" data-rm title="Remover" ${CR.length<2?'disabled':''}>✕</button></div>`).join('')}</div>
   <button class="btn ghost w-full mt-3" data-add>＋ Adicionar bitola</button><div id="o" class="mt-3"></div>`;go()},
   go=()=>{const n=CR.reduce((a,r)=>a+(+r.n||0),0),S2=CR.reduce((a,r)=>a+(+r.n||0)*(+r.d||0)**2,0),lim=n<=1?53:n==2?31:40,o=v('o');if(!n){o.innerHTML='';return}
    const ok=CT.find(([,D])=>S2/(D*D)*100<=lim);
    o.innerHTML=`<div class="r72"><div><small>Total de cabos</small><b>${n}</b></div><div><small>Limite de ocupação</small><b>${lim}%</b></div><div style="grid-column:1/-1;background:#e8f7ee"><small>Eletroduto mínimo</small><b style="color:#15803d">${ok?'Ø '+ok[0]+' mm ('+nf(S2/(ok[1]**2)*100,1)+'%)':'acima de 110 mm'}</b></div></div>
    <div class="text-xs mt-2" style="line-height:1.9">${CT.map(([d,D])=>{const p=S2/(D*D)*100,g=p<=lim;return`<span style="display:inline-block;margin:2px 4px 2px 0;padding:2px 8px;border-radius:99px;background:${g?'#dcfce7':'#fde2e0'};color:${g?'#15803d':'#b42318'}${ok&&ok[0]==d?';font-weight:800;outline:2px solid #15803d':''}">Ø${d}: ${nf(p,0)}%</span>`}).join('')}</div>`};
   box.oninput=e=>{const i=e.target.closest('[data-i]'),k=e.target.dataset.k;if(!i||!k)return;const r=CR[+i.dataset.i];r[k]=+e.target.value;if(k=='s'){r.d=CD[r.s];i.querySelector('[data-k=d]').value=r.d}go()};
   box.onchange=e=>{if(e.target.dataset.k=='s')draw()};
   box.onclick=e=>{const i=e.target.closest('[data-i]');if(e.target.closest('[data-rm]')&&i&&CR.length>1){CR.splice(+i.dataset.i,1);draw()}else if(e.target.closest('[data-add]')){CR.push({s:2.5,n:1,d:3.7});draw()}};draw()},
  wall(){wall73(box)},
  awg(){const L=[];for(let n=-3;n<=30;n++)L.push([n,awgN(n)+' AWG']);
   box.innerHTML=`<p class="text-xs" style="color:#64748b">d = 0,127 · 92^((36−n)/39) mm (padrão AWG). Valores teóricos do condutor sólido.</p>
   <div class="qcc"><b class="text-sm">AWG → mm²</b><label>Bitola AWG<select id="a" class="in mt-1">${opts(L,12)}</select></label><div id="oa" class="mt-2"></div></div>
   <div class="qcc"><b class="text-sm">mm² → AWG</b><label>Seção (mm²)<input id="m" class="in mt-1" type="number" min=".01" step=".01" value="2.5" inputmode="decimal"></label><div id="om" class="mt-2"></div></div>
   <div class="text-xs mt-3" style="line-height:1.9;color:#334155">${[14,12,10,8,6,4,2,1,0,-1,-2,-3].map(n=>`<span style="display:inline-block;margin:2px 4px 2px 0;padding:2px 8px;border-radius:99px;background:#f0f4f8">${awgN(n)}: ${nf(awgA(n),2)} mm²</span>`).join('')}</div>`;
   const ga=()=>{const n=+v('a').value,A=awgA(n),c=[1.5,2.5,4,6,10,16,25,35,50,70,95,120].find(x=>x>=A*.97);v('oa').innerHTML=`<div class="r72"><div><small>Seção</small><b>${nf(A,2)} mm²</b></div><div><small>Diâmetro</small><b>${nf(awgD(n),2)} mm</b></div><div style="grid-column:1/-1"><small>Seção comercial equivalente</small><b>${c?nf(c,c%1?1:0)+' mm²':'—'}</b></div></div>`},
   gm=()=>{const A=+v('m').value;if(!(A>0)){v('om').innerHTML='';return}const ne=36-39*Math.log(Math.sqrt(4*A/Math.PI)/.127)/Math.log(92),nr=Math.round(ne),nu=Math.floor(ne+1e-9),c=n=>n<-3||n>40?'fora da tabela':awgN(n)+' AWG ('+nf(awgA(n),2)+' mm²)';
    v('om').innerHTML=`<div class="r72"><div style="grid-column:1/-1"><small>Mais próximo</small><b>${c(nr)}</b></div><div style="grid-column:1/-1"><small>Igual ou maior (seguro)</small><b>${c(nu)}</b></div></div>`};
   box.oninput=box.onchange=e=>{if(e.target.id=='a')ga();else if(e.target.id=='m')gm()};ga();gm()}};
 m.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b){cur=b.dataset.tab;tabs();R[cur]()}});tabs();R[cur]()}
window.ut72=ut;

/* ---------- 11) Menu 7.2 + atalhos ---------- */
function help72(){mod('⌨️ Atalhos 7.2',`<div class="text-sm" style="line-height:1.9"><b>Arrastar no vazio</b> seleciona por área (mover a tela: 2 dedos, ✋ ou <b>Espaço</b>)<br><b>R</b> régua • <b>P</b> pincel de propriedades • <b>Esc</b> sai dos modos<br><b>Quick Actions</b>: aparecem ao selecionar: ⟳ girar, ⧉ duplicar, 🖌 pincel, 🔦 destacar circuito, 🗑 apagar<br><b>Guias magnéticas</b> (rosa) ao mover símbolos<br><b>🔦</b> no Quadro: destaca o circuito em neon</div>`)}
function hlMenu(){if(!Z())return;if(HL){setHL(null);return}if(sel&&sel.t=='sym'&&sel.c){setHL(sel.c);return}$('bQd').click();tst('Toque em 🔦 no circuito desejado')}
function menu72(){const o0=$('mSh');if(o0)o0.remove();const it=[['📏','Régua / medir (R)',startRU,'or'],['🖌','Pincel de propriedades (P)',startPB],['🔦','Destacar circuito',hlMenu],['💧','Marca d\'água',wmCfg],['📲','Mensagem p/ WhatsApp',waCfg],['📑','Documentos comerciais',()=>docs73()],['💬','ChatDC NBR',()=>chat73()],['🔌','Fechamento de caixa',()=>fecha73(sel)],['🧮','Utilitários',()=>ut()],['❓','Atalhos 7.2',help72],...(window.v74menu?window.v74menu():[])];
 const o=document.createElement('div');o.id='mSh';o.innerHTML='<div><div class="gp"></div><h4>📐 Desenho 7.2</h4><div class="g"></div></div>';const g=o.querySelector('.g');
 it.forEach(([i,l,f,c])=>{const b=document.createElement('button');b.className='t '+(c||'');b.innerHTML='<i>'+i+'</i><span>'+l+'</span>';b.onclick=()=>{o.remove();setTimeout(f,60)};g.appendChild(b)});o.onclick=e=>{if(e.target===o)o.remove()};document.body.appendChild(o)}
$('b72').onclick=menu72;$('bUt').onclick=()=>ut();$('bUtP').onclick=()=>ut();
addEventListener('keydown',e=>{if(!Z())return;if(e.key=='Escape'){stopRU();stopPB();if(HL)setHL(null);return}
 if(typing(e)||e.ctrlKey||e.metaKey||e.altKey||document.querySelector('.modal:not(.hidden),#mSh'))return;const k=e.key.toLowerCase();if(k=='r')startRU();else if(k=='p')startPB()});
})();
