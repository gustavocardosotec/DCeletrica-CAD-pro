/* DC CAD Pro v9.0 alfa — ferramentas-config.js: painel de ferramentas, configurações da conta/empresa, dashboard de projetos
   (bloco movido do index.html sem nenhuma alteração de lógica) */
(()=>{
const $=id=>document.getElementById(id),LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null},J=(k,d)=>{try{return JSON.parse(LS(k))||d}catch(e){return d}};
const toast=m=>{let t=$('t71');if(!t){t=document.createElement('div');t.id='t71';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3200)};
const mod=(t,h,w)=>{const m=document.createElement('div');m.className='modal full';m.style.zIndex=85;m.innerHTML=`<div style="max-width:${w||460}px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">${t}</h3><button class="btn ghost ml-auto" data-x>✕</button></div><div>${h}</div></div>`;m.addEventListener('click',e=>{if(e.target===m||e.target.hasAttribute('data-x'))m.remove()});document.body.appendChild(m);return m};

/* ===== Ferramentas: botão + painel com busca + atalhos fixos ===== */
const tb=$('tb'),main=document.querySelector('#vE main'),tp=document.createElement('div'),wk=document.createElement('div'),MB=()=>document.documentElement.classList.contains('mob');
tp.id='tp71';tp.innerHTML='<div class="tph"><input id="tq71" class="in" type="search" placeholder="🔍 Buscar ferramenta..."><button id="tx71" class="btn ghost" title="Fechar">✕</button></div><div id="tg71"></div>';wk.id='wk71';main.before(wk);wk.append(tp,main);
const tgc=$('tg71'),IC={sel:'🖱',pan:'✋',room3:'⬜',rect:'▭',wall:'▬',fio:'〰️',cota:'📏',txt:'🔤'};
const icon=k=>IC[k]||(k.startsWith('lbl:')?'🔤':'•');
tb.querySelectorAll('.grp').forEach(g=>{const l=g.querySelector('.tl');if(l)l.textContent=l.textContent.replace(/[▾\s]+$/,'').trim();g.querySelectorAll('.it').forEach(b=>{b.title=b.textContent.trim();if(!NM[b.dataset.k]){const i=document.createElement('span');i.className='ic71';i.textContent=icon(b.dataset.k);b.firstChild.replaceWith(i)}});tgc.appendChild(g)});
tb.classList.add('tb71');tb.innerHTML='<button id="bt71" class="btn or" title="Abrir/fechar ferramentas">🧰<span class="lb">&nbsp;Ferramentas</span></button><span id="cur71"></span><div id="qk71"></div>';
const fi=k=>[...tgc.querySelectorAll('.it')].find(b=>b.dataset.k==k),rec=()=>J('dce_rec71',[]);
function sync(){const ks=['sel','pan',...rec().filter(k=>k!='sel'&&k!='pan').slice(0,6)],q=$('qk71');q.innerHTML='';
 ks.forEach(k=>{const s=fi(k);if(!s)return;const b=document.createElement('button');b.className='q71'+(tool==k?' on':'');b.title=s.title;b.setAttribute('aria-label',s.title);const c=s.querySelector('canvas');
  if(c){const n=document.createElement('canvas');n.width=32;n.height=30;n.getContext('2d').drawImage(c,0,0);b.appendChild(n)}else b.textContent=icon(k);b.onclick=()=>s.click();q.appendChild(b)});
 $('cur71').textContent=tool=='sel'?'Selecionar':(LB[tool]||tool)}
const _mk=markTool;markTool=function(){_mk.apply(this,arguments);if(tool!='sel'&&tool!='pan'){const r=rec().filter(x=>x!=tool);r.unshift(tool);LS('dce_rec71',JSON.stringify(r.slice(0,8)))}sync()};
const op=v=>{const h=v===undefined?!tp.classList.contains('hidden'):!v;tp.classList.toggle('hidden',h);$('bt71').classList.toggle('on',!h);if(!MB())LS('dce_tp71',h?'0':'1');setTimeout(()=>dispatchEvent(new Event('resize')),30)};
$('bt71').onclick=e=>{e.stopPropagation();op()};$('tx71').onclick=()=>op(false);
tgc.addEventListener('click',e=>{if(e.target.closest('.it')&&MB())op(false)});
$('tq71').oninput=e=>{const q=e.target.value.toLowerCase();tgc.querySelectorAll('.grp').forEach(g=>{let n=0;g.querySelectorAll('.it').forEach(b=>{const v=!q||b.title.toLowerCase().includes(q);b.style.display=v?'':'none';if(v)n++});g.style.display=n?'':'none'})};
tp.classList.toggle('hidden',MB()||LS('dce_tp71')==='0');$('bt71').classList.toggle('on',!tp.classList.contains('hidden'));sync();

/* ===== Configurações: abas + empresa ===== */
const tab=t=>{document.querySelectorAll('#cfTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));document.querySelectorAll('#mCfg [data-pn]').forEach(p=>p.classList.toggle('on',p.dataset.pn==t));$('mCfg').querySelector('.cfb').scrollTop=0};
$('cfTabs').onclick=e=>{const b=e.target.closest('button');if(b)tab(b.dataset.t)};
const EK='dce_emp71',F=[['eN','nome'],['eD','doc'],['eT','tel'],['eE','mail'],['eA','end'],['eV','fase'],['eC','conc'],['eX','pix'],['eL','luc'],['eM','mo']];let E={};
const emp=()=>{let o=J(EK,{});const m=ses&&ses.user&&ses.user.user_metadata&&ses.user.user_metadata.empresa;if(m&&!o.nome&&!o.doc)o={...m,logo:o.logo};return o};
const lgShow=()=>{$('eLp').innerHTML=E.logo?`<img src="${E.logo}" alt="Logo">`:'Sem logo';$('eLx').classList.toggle('hidden',!E.logo)};
const fill=()=>{E=emp();F.forEach(([i,k])=>$(i).value=E[k]!=null?E[k]:(k=='fase'?'127':''));lgShow();$('eG').textContent=''};
const fdoc=v=>{const d=v.replace(/\D/g,'');if(!v)return'';if(d.length==11)return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');if(d.length==14)return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,'$1.$2.$3/$4-$5');return null};
$('eLf').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const m=Math.min(1,400/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(i.width*m));c.height=Math.max(1,Math.round(i.height*m));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);E.logo=c.toDataURL('image/jpeg',.85);lgShow()};i.onerror=()=>toast('Não consegui abrir essa imagem.');i.src=r.result};r.readAsDataURL(f);e.target.value=''};
$('eLx').onclick=()=>{E.logo='';lgShow()};
$('eS').onclick=async()=>{const g=$('eG'),o={};g.style.color='#b42318';F.forEach(([i,k])=>o[k]=$(i).value.trim());
 const d=fdoc(o.doc);if(d===null){g.textContent='CNPJ/CPF inválido: use 11 (CPF) ou 14 (CNPJ) dígitos.';return}o.doc=d;
 if(o.mail&&!/^\S+@\S+\.\S+$/.test(o.mail)){g.textContent='E-mail comercial inválido.';return}
 for(const k of['luc','mo'])if(o[k]!==''&&!(+o[k]>=0&&+o[k]<=100)){g.textContent='Margem de lucro e mão de obra: informe de 0 a 100.';return}
 o.logo=E.logo||'';E=o;LS(EK,JSON.stringify(o));LS('dce_conc',o.conc);$('eD').value=d;
 let cloud=false;if(ses&&ses.access_token&&ses.access_token!='local'){try{const t={...o};delete t.logo;const r=await fetch(CFG.url+'/auth/v1/user',{method:'PUT',headers:UH(),body:JSON.stringify({data:{empresa:t}})});if(r.ok){ses.user=await r.json();LS('dce_ses',JSON.stringify(ses));cloud=true}}catch(e){}}
 g.style.color='#15803d';g.textContent=cloud?'Salvo ✅ Dados na sua conta; o logo fica neste aparelho.':'Salvo neste aparelho ✅';toast('Dados da empresa salvos')};
const mv=()=>{const d=$('pf7'),h=$('cfPf');if(!d||!h||d.parentNode===h)return;const c=d.querySelector('[data-p="dce_conc"]'),l=c&&c.closest('label');if(l)l.remove();h.appendChild(d)};
$('bCfg').addEventListener('click',()=>setTimeout(mv,150));
new MutationObserver(()=>{if(!$('mCfg').classList.contains('hidden')){tab('c');fill();mv();setTimeout(mv,200)}}).observe($('mCfg'),{attributes:true,attributeFilter:['class']});
/* padrões da empresa em projetos novos e no PDF */
const _ap=abrirProj;abrirProj=function(p){try{if(p&&p.dados&&!ro&&!(p.dados.items&&p.dados.items.length)){const e=emp(),d=p.dados;d.cfg=d.cfg||{};if(!d.cfg.fase&&e.fase)d.cfg.fase=+e.fase;if(!d.cfg.conc&&e.conc)d.cfg.conc=e.conc}}catch(x){}_ap(p)};
$('bSh').addEventListener('click',()=>{if(!S||ro)return;const e=emp(),h=S.hdr=S.hdr||{};if(!h.logo&&e.logo)h.logo=e.logo;if(!h.autor&&e.nome)h.autor=e.nome},true);

/* ===== Dashboard de projetos ===== */
const DT=[['res','Residencial','#2563eb'],['com','Comercial','#eab308'],['ref','Reforma','#16a34a']];
const tags=()=>{const a=J('dce_tags71',null);return Array.isArray(a)&&a.length?a:DT.map(([id,n,c])=>({id,n,c}))};
const ST=[['Em andamento','#1d4ed8','#dbeafe'],['Aguardando aprovação','#b45309','#fef3c7'],['Concluído','#15803d','#dcfce7']];
const mt=p=>p.dados.meta=p.dados.meta||{},stN=m=>m.st=='Aprovado'||m.st=='Finalizado'?ST[2][0]:ST.some(x=>x[0]==m.st)?m.st:ST[0][0];
const tgOf=m=>tags().find(t=>t.id==m.tg)||(m.tg&&m.tn?{id:m.tg,n:m.tn,c:m.tc||'#64748b'}:null);
const gid=p=>String(mt(p).grp||p.id),ver=p=>mt(p).ver||1,e_=esc,stripV=n=>String(n||'Sem título').replace(/\s+v\d+$/i,'');
const sv=async p=>{const r=await DB('?id=eq.'+p.id,{method:'PATCH',body:JSON.stringify({dados:p.dados})});if(!r)toast('Não foi possível salvar')};
let ft='',fs='',fq='';
function thumb(cn,p){const it=p.dados.items||[],ps=[];it.forEach(t=>{if(t.t=='room')ps.push([t.x,t.y],[t.x+t.w,t.y+(t.h||0)]);else if(t.t=='sym')ps.push([t.x,t.y])});if(!ps.length)return false;
 let a=1e9,b=-1e9,c=1e9,d=-1e9;ps.forEach(q=>{a=Math.min(a,q[0]);b=Math.max(b,q[0]);c=Math.min(c,q[1]);d=Math.max(d,q[1])});
 const g=cn.getContext('2d'),s=Math.min(270/(b-a||1),66/(d-c||1)),ox=15+(270-(b-a)*s)/2-a*s,oy=9+(66-(d-c)*s)/2-c*s;
 g.strokeStyle='#fff';g.lineWidth=1.6;it.forEach(t=>{if(t.t=='room')g.strokeRect(t.x*s+ox,t.y*s+oy,t.w*s,(t.h||0)*s)});
 g.strokeStyle='#ffffff77';g.lineWidth=.8;it.forEach(t=>{if(t.t=='fio'&&t.pts&&t.pts.length>1){g.beginPath();t.pts.forEach((q,i)=>g[i?'lineTo':'moveTo'](q[0]*s+ox,q[1]*s+oy));g.stroke()}});
 g.fillStyle='#f26b21';it.forEach(t=>{if(t.t=='sym'&&!DRK.includes(t.k))g.fillRect(t.x*s+ox-1.5,t.y*s+oy-1.5,3,3)});return true}
function cardH(a){const p=a.at(-1),m=mt(p),t=tgOf(m),s=ST.find(x=>x[0]==stN(m)),it=p.dados.items||[],id=e_(p.id);
 return `<div class="card c71" data-id="${id}"${t?` style="border-top:5px solid ${e_(t.c)}"`:''}><div class="thumb" data-a="open" data-id="${id}"><canvas width="300" height="84" style="width:100%;height:100%"></canvas></div>
<div class="flex items-start gap-2"><button data-a="open" data-id="${id}" class="text-left flex-1" style="min-width:0"><b class="text-lg" style="word-break:break-word">${e_(p.nome||'Sem título')}</b></button><button class="btn ghost" data-a="fav" data-id="${id}" title="Favoritar" style="padding:4px 10px">${m.f?'⭐':'☆'}</button></div>
<div class="flex gap-1 flex-wrap mt-2">${t?`<span class="bd71" style="background:${e_(t.c)}22;color:${e_(t.c)}"><i style="background:${e_(t.c)}"></i>${e_(t.n)}</span>`:''}<span class="bd71" style="background:${s[2]};color:${s[1]}">${s[0]}</span>${m.tpl?'<span class="bd71" style="background:#ede9fe;color:#6d28d9">📌 Modelo</span>':''}</div>
<div class="text-xs mt-2" style="color:#51627a">Modificado em ${new Date(p.atualizado).toLocaleString('pt-BR')} &bull; ${it.filter(i=>i.t=='sym').length} símbolos &bull; ${it.filter(i=>i.t=='room').length} cômodos</div>
${a.length>1?`<div class="flex gap-1 flex-wrap items-center mt-2"><span class="text-xs" style="color:#64748b">Versões:</span>${a.map(x=>`<button class="vr71${x===p?' on':''}" data-a="open" data-id="${e_(x.id)}" title="Abrir v${ver(x)}">v${ver(x)}</button>`).join('')}</div>`:''}
<div class="flex gap-2 mt-3 flex-wrap"><button class="btn ghost" data-a="dup" data-id="${id}">${m.tpl?'📋 Usar modelo':'⧉ Duplicar'}</button><button class="btn ghost" data-a="ed" data-id="${id}" title="Etiqueta, status e modelo">🏷</button><button class="btn danger" data-a="del" data-id="${id}" title="Excluir">🗑</button></div></div>`}
function render(){const g=$('gr'),q=fq.toLowerCase(),M=new Map();
 $('c71').innerHTML=[['','#64748b','Todos'],...tags().map(t=>[t.id,t.c,t.n])].map(([k,c,n])=>`<button class="btn ${ft==k?'or':'ghost'}" data-t="${e_(k)}">${k?`<span style="width:10px;height:10px;border-radius:9px;background:${e_(c)};display:inline-block"></span>`:''}${e_(n)}</button>`).join('');
 PL.forEach(p=>{const k=gid(p);if(!M.has(k))M.set(k,[]);M.get(k).push(p)});
 let L=[...M.values()].map(a=>a.sort((x,y)=>ver(x)-ver(y))).filter(a=>{const m=mt(a.at(-1));return(!ft||m.tg==ft)&&(!fs||stN(m)==fs)&&(!q||a.some(x=>String(x.nome).toLowerCase().includes(q)))});
 const nm=LS('dce_ord')=='nome',fv=a=>{const m=mt(a.at(-1));return m.f||m.tpl?1:0};
 L.sort((a,b)=>fv(b)-fv(a)||(nm?String(a.at(-1).nome).localeCompare(String(b.at(-1).nome)):PL.indexOf(a.at(-1))-PL.indexOf(b.at(-1))));
 g.innerHTML=L.length?L.map(cardH).join(''):'<p class="text-center py-16 col-span-full" style="color:#64748b">Nenhum projeto encontrado com esses filtros.</p>';
 g.querySelectorAll('.c71').forEach(c=>{const p=PL.find(x=>String(x.id)==c.dataset.id);if(p&&!thumb(c.querySelector('canvas'),p))c.querySelector('.thumb').textContent='⚡'})}
function d71(){const g=$('gr');if(!g)return;const o=$('fbar');if(o)o.remove();let bar=$('bar71');
 if(!bar){bar=document.createElement('div');bar.id='bar71';bar.innerHTML=`<input id="q71" class="in" type="search" placeholder="🔍 Buscar projeto..."><select id="s71" class="in"><option value="">Todos os status</option>${ST.map(s=>`<option>${s[0]}</option>`).join('')}</select><button id="m71" class="btn ghost">🏷 Etiquetas</button><div class="chp71" id="c71"></div>`;g.before(bar);
  $('q71').oninput=e=>{fq=e.target.value;render()};$('s71').onchange=e=>{fs=e.target.value;render()};$('m71').onclick=tg;
  bar.onclick=e=>{const b=e.target.closest('[data-t]');if(b){ft=b.dataset.t;render()}}}
 bar.style.display=PL&&PL.length?'':'none';if(PL&&PL.length)render()}
$('gr').addEventListener('click',e=>{let b=e.target.closest('[data-a]');if(!b){const c=e.target.closest('.c71');if(!c)return;b={dataset:{a:'open',id:c.dataset.id}}}const p=PL.find(x=>String(x.id)==b.dataset.id);if(!p)return;const a=b.dataset.a;
 if(a=='open')abrirProj(p);else if(a=='fav'){mt(p).f=!mt(p).f;sv(p);render()}else if(a=='ed')ed(p);else if(a=='dup')dup(p);else if(a=='del')del(p)});
function ed(p){const m=mt(p),T=tags(),w=mod('🏷 Etiqueta e status',`<label>Etiqueta<select id="x1" class="in mt-1"><option value="">Sem etiqueta</option>${T.map(t=>`<option value="${e_(t.id)}"${m.tg==t.id?' selected':''}>${e_(t.n)}</option>`).join('')}</select></label><label>Status<select id="x2" class="in mt-1">${ST.map(s=>`<option${stN(m)==s[0]?' selected':''}>${s[0]}</option>`).join('')}</select></label><label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-top:12px"><input type="checkbox" id="x3"${m.tpl?' checked':''} style="width:18px;height:18px;accent-color:#f26b21"> 📌 Modelo master (base para novos projetos)</label><button id="x4" class="btn ghost w-full mt-3">🏷 Gerenciar etiquetas</button><div class="flex gap-2 mt-4"><button class="btn ghost flex-1" data-x>Cancelar</button><button id="x5" class="btn or flex-1">Salvar</button></div>`);
 w.querySelector('#x4').onclick=()=>{w.remove();tg()};
 w.querySelector('#x5').onclick=async()=>{const t=T.find(x=>x.id==w.querySelector('#x1').value);m.tg=t?t.id:'';m.tn=t?t.n:'';m.tc=t?t.c:'';m.st=w.querySelector('#x2').value;m.tpl=w.querySelector('#x3').checked;w.remove();await sv(p);render()}}
function tg(){const T=tags(),row=t=>`<div class="flex gap-2 items-center mt-2" data-r="${e_(t.id)}"><input type="color" value="${e_(t.c)}" data-c style="flex:none;width:46px;height:44px;padding:2px;border:1px solid #dbe3ec;border-radius:9px;background:#fff"><input class="in" data-n maxlength="24" value="${e_(t.n)}" placeholder="Nome"><button class="btn danger" data-rm title="Remover">✕</button></div>`,
 w=mod('🏷 Etiquetas',`<p class="text-xs" style="color:#64748b">Crie e personalize as etiquetas dos seus projetos.</p><div id="tl">${T.map(row).join('')}</div><button id="ta" class="btn ghost w-full mt-3">＋ Nova etiqueta</button><div class="flex gap-2 mt-4"><button class="btn ghost flex-1" data-x>Cancelar</button><button id="ts" class="btn or flex-1">Salvar</button></div>`);
 w.addEventListener('click',e=>{if(e.target.closest('[data-rm]'))e.target.closest('[data-r]').remove()});
 w.querySelector('#ta').onclick=()=>{if(w.querySelectorAll('[data-r]').length>=12){toast('Máximo de 12 etiquetas');return}w.querySelector('#tl').insertAdjacentHTML('beforeend',row({id:'u'+Math.random().toString(36).slice(2,8),n:'',c:'#7c3aed'}))};
 w.querySelector('#ts').onclick=()=>{const a=[...w.querySelectorAll('[data-r]')].map(r=>({id:r.dataset.r,n:r.querySelector('[data-n]').value.trim(),c:r.querySelector('[data-c]').value})).filter(t=>t.n);LS('dce_tags71',JSON.stringify(a.length?a:[]));w.remove();if(ft&&!a.some(t=>t.id==ft))ft='';render()}}
function dup(p){const m=mt(p),tpl=!!m.tpl,nx=Math.max(...PL.filter(x=>gid(x)==gid(p)).map(ver))+1,rv=stN(m)==ST[1][0],
 w=mod(tpl?'📋 Usar modelo':'⧉ Duplicar projeto',`<label>Nome do novo projeto<input id="d1" class="in mt-1" maxlength="80"></label>${tpl?'':`<div style="font-size:13px;margin-top:10px"><label style="display:flex;gap:8px;align-items:flex-start;cursor:pointer;margin-top:8px"><input type="radio" name="dm" value="ver"${rv?' checked':''} style="margin-top:3px"><span><b>Nova versão (v${nx})</b>: fica no mesmo cartão, com histórico. Ideal para revisões após aprovação.</span></label><label style="display:flex;gap:8px;align-items:flex-start;cursor:pointer;margin-top:8px"><input type="radio" name="dm" value="copy"${rv?'':' checked'} style="margin-top:3px"><span><b>Cópia independente</b>: novo projeto separado.</span></label></div>`}<div class="flex gap-2 mt-4"><button class="btn ghost flex-1" data-x>Cancelar</button><button id="d2" class="btn or flex-1">Criar</button></div>`),
 d1=w.querySelector('#d1'),md=()=>tpl?'tpl':w.querySelector('[name=dm]:checked').value,nmf=()=>{d1.value=tpl?'Novo projeto':md()=='ver'?stripV(p.nome)+' v'+nx:p.nome+' (cópia)'};nmf();w.querySelectorAll('[name=dm]').forEach(r=>r.onchange=nmf);
 w.querySelector('#d2').onclick=async e=>{const n=d1.value.trim();if(!n){toast('Digite um nome');return}const mode=md(),dd=JSON.parse(JSON.stringify(p.dados)),m0=dd.meta||{};dd.tmp=0;
  dd.meta=mode=='ver'?{...m0,grp:gid(p),ver:nx,f:false,tpl:false,st:ST[0][0]}:{tg:m0.tg,tn:m0.tn,tc:m0.tc,st:ST[0][0]};e.target.disabled=true;
  const r=await DB('',{method:'POST',body:JSON.stringify({nome:n,dados:dd})});w.remove();if(r&&r[0]){toast(mode=='ver'?'Versão v'+nx+' criada':'Projeto criado');await list()}else toast('Não foi possível duplicar')}}
async function del(p){const n=PL.filter(x=>gid(x)==gid(p)).length;if(!await yes('Excluir "'+(p.nome||'Sem título')+'"?'+(n>1?' Só esta versão será excluída; as outras continuam no histórico.':'')))return;await DB('?id=eq.'+p.id,{method:'DELETE'});await list()}
const _l=list;list=async function(){const r=await _l.apply(this,arguments);try{d71()}catch(e){console.error(e)}return r};
setTimeout(()=>{try{if(PL&&PL.length&&!$('vP').classList.contains('hidden'))d71()}catch(e){}},700);
})();
