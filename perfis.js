/* DC CAD Pro — Eletricistas: meu perfil, buscar perfis de outros (nome, empresa, cidade) e página pública */
(()=>{'use strict';
const $=id=>document.getElementById(id),
E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'),
norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),
nz=s=>{s=String(s||'').trim();return s?s:null},
UFS=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'],
logged=()=>typeof ses!='undefined'&&ses&&ses.access_token&&ses.access_token!='local',
tst=m=>{let t=$('t77');if(!t){t=document.createElement('div');t.id='t77';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99999;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',2600)},
wa=(n,t)=>{n=String(n||'').replace(/\D/g,'');if(n.length<=11)n='55'+n;return'https://wa.me/'+n+(t?'?text='+encodeURIComponent(t):'')},
tel=n=>String(n||'').replace(/[^\d+]/g,''),
fmtTel=n=>{const d=String(n||'').replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'');return d.length==11?d.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3'):d.length==10?d.replace(/(\d{2})(\d{4})(\d{4})/,'($1) $2-$3'):String(n||'')},
uidTok=()=>{try{return JSON.parse(atob(ses.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).sub}catch(e){return null}};

/* ---------- rede (com renovação de sessão) ---------- */
async function rq(p,o={},auth){
 const H=()=>({apikey:CFG.key,Authorization:'Bearer '+(auth&&logged()?ses.access_token:CFG.key),'Content-Type':'application/json'});
 const go=()=>fetch(CFG.url+p,{...o,headers:{...H(),...(o.headers||{})}});
 let r=await go();
 if(r.status==401&&auth&&logged()&&ses.refresh_token){try{const d=await api('/auth/v1/token?grant_type=refresh_token',{refresh_token:ses.refresh_token});if(d&&d.access_token){ses=d;localStorage.setItem('dce_ses',JSON.stringify(d));r=await go()}}catch(e){}}
 return r}

/* ---------- imagens pequenas (foto, logo, obras) ---------- */
const shrink=(f,max,q,bg)=>new Promise((ok,no)=>{const i=new Image,u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(i.width*k));c.height=Math.max(1,Math.round(i.height*k));const g=c.getContext('2d');if(bg){g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height)}g.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',q))};i.onerror=()=>{URL.revokeObjectURL(u);no()};i.src=u});
const pickImg=(multi)=>new Promise(r=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=!!multi;i.onchange=()=>r([...i.files]);i.click()});

/* ---------- avatar / iniciais ---------- */
const COL=['#1b4f7a','#f26b21','#0f766e','#7c3aed','#be123c','#15803d','#b45309'];
const ini=v=>{const s=(v.nome||v.empresa||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();return s||'?'};
const av=(v,s=56)=>{const im=v.foto||v.logo;
 if(im)return`<span class="pf-av" style="width:${s}px;height:${s}px"><img src="${E(im)}" alt=""></span>`;
 const c=COL[(norm(v.nome||v.empresa||'x').charCodeAt(0)||0)%COL.length];
 return`<span class="pf-av" style="width:${s}px;height:${s}px;background:${c};color:#fff;font-weight:800;font-size:${Math.round(s*.38)}px">${E(ini(v))}</span>`};
const local=v=>[v.cidade,v.uf].filter(Boolean).join(' - ');

/* ---------- janela ---------- */
function modal(){const old=$('mPf77');if(old)old.remove();
 const m=document.createElement('div');m.id='mPf77';m.className='modal full';m.style.zIndex=9100;
 m.innerHTML=`<div style="max-width:640px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">🌟 Eletricistas</h3><button class="btn ghost ml-auto" data-x aria-label="Fechar">✕</button></div>
 <div class="tb72 pf-tabs"><button data-tab="find">🔎 Encontrar</button><button data-tab="meu">👤 Meu perfil</button></div><div data-b></div></div>`;
 m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-x]'))m.remove()});
 document.body.appendChild(m);return m}

let ME=null; /* meu perfil já carregado (para saber minha cidade) */
async function loadMe(){if(!logged()||!navigator.onLine)return ME;const id=uidTok();if(!id)return ME;
 try{const r=await rq('/rest/v1/vitrine?user_id=eq.'+id+'&select=*',{},1);if(r.ok){const a=await r.json();ME=Array.isArray(a)&&a[0]?a[0]:{}}}catch(e){}return ME}

function open(tab){const m=modal(),box=m.querySelector('[data-b]');let cur=tab||'find';
 const setTab=t=>{cur=t;m.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab==t));(t=='find'?find:mine)(box,m,setTab)};
 m.querySelector('.pf-tabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab)};
 setTab(cur)}

/* ================= ABA: ENCONTRAR ================= */
function find(box){
 box.innerHTML=`<p class="text-sm" style="color:#64748b;margin:2px 0 10px">Procure eletricistas por <b>nome</b>, <b>empresa</b> ou <b>cidade</b> e veja se tem alguém na sua região.</p>
 <input id="pfq" class="in" type="search" placeholder="🔍 Ex.: Bauru, João, Silva Elétrica..." autocomplete="off">
 <div class="pf-chips" id="pfc"></div><div id="pfn" class="text-xs" style="color:#64748b;margin:8px 2px"></div><div id="pfl"></div><div id="pfm"></div>`;
 const q=box.querySelector('#pfq'),L=box.querySelector('#pfl'),N=box.querySelector('#pfn'),M=box.querySelector('#pfm'),C=box.querySelector('#pfc');
 let off=0,tk=0,tm,all=[];const PG=20;
 const card=v=>`<div class="pf-card" role="button" tabindex="0" data-s="${E(v.slug)}">${av(v)}<span class="pf-tx"><b>${E(v.nome||v.empresa)}</b>${v.nome&&v.empresa?`<small>🏢 ${E(v.empresa)}</small>`:''}<small>${local(v)?'📍 '+E(local(v)):''}${local(v)&&v.area?' • ':''}${v.area?E(v.area):''}</small>${v.nivel?`<em>${E(v.nivel)}</em>`:''}</span>${v.whatsapp?`<a class="pf-wa" href="${E(wa(v.whatsapp,'Olá, vi seu perfil no DC CAD Pro.'))}" target="_blank" rel="noopener" title="Chamar no WhatsApp">💬</a>`:''}</div>`;
 async function go(reset){const my=++tk;if(reset){off=0;all=[];L.innerHTML=''}M.innerHTML='';
  if(!navigator.onLine){N.textContent='';L.innerHTML='<p class="pf-vz">📴 Você está offline. Conecte-se para ver os eletricistas.</p>';return}
  N.textContent='Buscando...';
  let a=null,err=0;
  try{const r=await rq('/rest/v1/rpc/listar_vitrines',{method:'POST',body:JSON.stringify({p_q:norm(q.value),p_cidade:norm((ME&&ME.cidade)||''),p_limit:PG,p_off:off})});if(r.ok)a=await r.json();else err=1}catch(e){err=1}
  if(my!=tk)return;
  if(err||!Array.isArray(a)){N.textContent='';L.innerHTML='<p class="pf-vz">Não foi possível carregar a lista agora. Tente de novo em instantes.<br><small>(Dono do site: rode o <b>supabase_perfis.sql</b> no Supabase.)</small></p>';return}
  all=all.concat(a);off+=a.length;
  L.insertAdjacentHTML('beforeend',a.map(card).join(''));
  N.textContent=all.length?(all.length+(a.length>=PG?'+':'')+' eletricista'+(all.length>1?'s':'')+(q.value.trim()?' para "'+q.value.trim()+'"':'')):'';
  if(!all.length)L.innerHTML=`<p class="pf-vz">${q.value.trim()?'Nenhum eletricista encontrado para essa busca.':'Ainda não há perfis publicados.'}<br><small>Seja o primeiro: toque em <b>Meu perfil</b> e preencha o seu.</small></p>`;
  if(a.length>=PG)M.innerHTML='<button class="btn ghost w-full mt-2" data-more>Ver mais</button>'}
 q.oninput=()=>{clearTimeout(tm);tm=setTimeout(()=>go(true),320)};
 M.onclick=e=>{if(e.target.closest('[data-more]'))go(false)};
 const open1=e=>{if(e.target.closest('a'))return;const c=e.target.closest('[data-s]');if(c)page(c.dataset.s,{back:1})};
 L.onclick=open1;L.onkeydown=e=>{if(e.key=='Enter')open1(e)};
 C.onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;q.value=b.dataset.c;go(true)};
 const chips=()=>{const c=ME&&ME.cidade;C.innerHTML=c?`<button class="btn ghost" data-c="${E(c)}">📍 Minha cidade: ${E(c)}</button>`:'';if(q.value)C.innerHTML+=`<button class="btn ghost" data-c="">✕ Limpar busca</button>`};
 chips();go(true);
 loadMe().then(()=>{chips();if(ME&&ME.cidade&&!q.value&&!all.length)go(true)})}

/* ================= ABA: MEU PERFIL ================= */
async function mine(box,m,setTab){
 if(!logged()){box.innerHTML=`<div class="pf-vz"><div style="font-size:42px">👤</div><b>Entre na sua conta para criar seu perfil</b><p class="text-sm" style="color:#64748b;margin:6px 0 12px">Seu perfil fica salvo na conta e aparece para quem procurar eletricistas na sua cidade.</p><button class="btn or" data-login>Entrar / criar conta</button></div>`;
  box.querySelector('[data-login]').onclick=()=>{m.remove();try{show('vL')}catch(e){}};return}
 if(!navigator.onLine){box.innerHTML='<p class="pf-vz">📴 Você está offline. Conecte-se para editar o perfil.</p>';return}
 box.innerHTML='<p class="pf-vz">Carregando seu perfil...</p>';
 const id=uidTok();if(!id){box.innerHTML='<p class="pf-vz">Sessão inválida. Saia e entre novamente.</p>';return}
 let v=await loadMe()||{};
 /* sugestões a partir da aba Empresa (só se o perfil ainda estiver vazio) */
 let emp={};try{emp=JSON.parse(localStorage.getItem('dce_emp71'))||{}}catch(e){}
 const novo=!v.slug;
 const d={nome:v.nome||'',empresa:v.empresa!=null?v.empresa:(novo?emp.nome||'':''),whatsapp:v.whatsapp!=null?v.whatsapp:(novo?emp.tel||'':''),cidade:v.cidade||'',uf:v.uf||'',area:v.area||'',bio:v.bio||''};
 let fo=(v.fotos||[]).slice(),foto=v.foto||'',logo=v.logo||'';
 box.innerHTML=`<p class="text-sm" style="color:#64748b;margin:2px 0 8px">Tudo aqui é <b>opcional</b>: preencha só o que quiser mostrar. Quem procurar por eletricistas vai ver este perfil.</p>
 <div class="pf-ph"><div><div class="pf-pl">Sua foto</div><button type="button" class="pf-pic" data-pf>${foto?`<img src="${E(foto)}" alt="">`:'<span>📷</span>'}</button><button type="button" class="pf-rm" data-pfx ${foto?'':'hidden'}>remover</button></div>
 <div><div class="pf-pl">Foto / logo da empresa</div><button type="button" class="pf-pic sq" data-lg>${logo?`<img src="${E(logo)}" alt="">`:'<span>🏢</span>'}</button><button type="button" class="pf-rm" data-lgx ${logo?'':'hidden'}>remover</button></div></div>
 <label class="text-xs font-bold">Seu nome<input class="in" data-f="nome" maxlength="60" value="${E(d.nome)}" autocomplete="name"></label>
 <label class="text-xs font-bold">Empresa<input class="in" data-f="empresa" maxlength="80" value="${E(d.empresa)}" autocomplete="organization"></label>
 <label class="text-xs font-bold">Telefone / WhatsApp<input class="in" data-f="whatsapp" type="tel" inputmode="tel" maxlength="20" value="${E(d.whatsapp)}" placeholder="14 99999-9999" autocomplete="tel"></label>
 <div style="display:grid;grid-template-columns:1fr 92px;gap:8px"><label class="text-xs font-bold">Cidade<input class="in" data-f="cidade" maxlength="60" value="${E(d.cidade)}" placeholder="Ex.: Bauru"></label>
 <label class="text-xs font-bold">UF<select class="in" data-f="uf"><option value="">—</option>${UFS.map(u=>`<option${u==d.uf?' selected':''}>${u}</option>`).join('')}</select></label></div>
 <label class="text-xs font-bold">Área de atuação<input class="in" data-f="area" maxlength="80" value="${E(d.area)}" placeholder="Ex.: residencial e comercial, quadros, automação"></label>
 <label class="text-xs font-bold">Descrição<textarea class="in" rows="4" data-f="bio" maxlength="600" placeholder="Conte sua experiência, serviços e diferenciais.">${E(d.bio)}</textarea></label>
 <div class="text-xs font-bold" style="margin-top:10px">Fotos de obras (até 8)</div><div data-fo class="pf-fo"></div><button class="btn ghost" data-ad style="margin-top:6px">📷 Adicionar fotos de obras</button>
 <label class="pf-sw"><input type="checkbox" data-f="listado" ${v.listado===false?'':'checked'}> <span><b>Aparecer na lista de eletricistas</b><br><small>Quem buscar por nome, empresa ou cidade encontra você.</small></span></label>
 <label class="pf-sw"><input type="checkbox" data-f="publicado" ${v.publicado===false?'':'checked'}> <span><b>Perfil visível pelo link</b><br><small>Desmarque para esconder o perfil por completo.</small></span></label>
 <details style="margin-top:8px"><summary class="text-xs font-bold" style="cursor:pointer">🔗 Link personalizado (opcional)</summary><div class="text-xs" style="color:#64748b;margin-top:6px">${E(location.origin)}/eletricista/<input class="in" data-f="slug" maxlength="40" value="${E(v.slug||'')}" placeholder="gerado automaticamente"></div></details>
 <div data-l class="text-xs" style="margin-top:10px;color:#64748b"></div>
 <button class="btn or w-full mt-3 py-3" data-ok>💾 Salvar perfil</button>`;
 const q=s=>box.querySelector(s),F=k=>q('[data-f="'+k+'"]');
 const paint=()=>{q('[data-fo]').innerHTML=fo.map((u,i)=>`<div style="position:relative"><img src="${E(u)}" alt=""><button data-r="${i}" class="btn danger" style="position:absolute;top:3px;right:3px;min-height:0;padding:0 8px">✕</button></div>`).join('');
  q('[data-pf]').innerHTML=foto?`<img src="${E(foto)}" alt="">`:'<span>📷</span>';q('[data-pfx]').hidden=!foto;
  q('[data-lg]').innerHTML=logo?`<img src="${E(logo)}" alt="">`:'<span>🏢</span>';q('[data-lgx]').hidden=!logo;
  q('[data-l]').innerHTML=v.slug?`🔗 Seu link: <b>${E(location.origin)}/eletricista/${E(v.slug)}</b> <button class="btn ghost" data-cp style="min-height:0;padding:3px 10px">Copiar</button> <button class="btn ghost" data-ver style="min-height:0;padding:3px 10px">👁 Ver como cliente</button>`:''};paint();
 box.addEventListener('click',async e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.r!==undefined){fo.splice(+t.dataset.r,1);paint()}
  else if(t.dataset.pf!==undefined){const [f]=await pickImg();if(f){try{foto=await shrink(f,200,.8,1);paint()}catch(x){tst('Não consegui abrir essa imagem')}}}
  else if(t.dataset.pfx!==undefined){foto='';paint()}
  else if(t.dataset.lg!==undefined){const [f]=await pickImg();if(f){try{logo=await shrink(f,240,.85,1);paint()}catch(x){tst('Não consegui abrir essa imagem')}}}
  else if(t.dataset.lgx!==undefined){logo='';paint()}
  else if(t.dataset.ad!==undefined){for(const f of await pickImg(1)){if(fo.length>=8)break;try{fo.push(await shrink(f,720,.68))}catch(x){}}paint()}
  else if(t.dataset.cp!==undefined){try{await navigator.clipboard.writeText(location.origin+'/eletricista/'+v.slug);tst('Link copiado')}catch(x){}}
  else if(t.dataset.ver!==undefined)page(v.slug,{back:1});
  else if(t.dataset.ok!==undefined)salvar(t)});
 async function salvar(btn){
  const g=k=>F(k).value.trim(),nome=g('nome'),emp1=g('empresa'),listado=F('listado').checked;
  if(nome&&nome.length<2)return msg('O nome precisa ter pelo menos 2 letras (ou deixe em branco).');
  if(listado&&!nome&&!emp1)return msg('Para aparecer na lista de eletricistas, preencha ao menos o nome ou a empresa.');
  let sl=g('slug').toLowerCase(),auto=!sl&&!v.slug;
  if(!sl&&v.slug)sl=v.slug;
  const mk=()=>{const b=norm(nome||emp1||'eletricista').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,30)||'eletricista';return(b.length<3?'eletricista':b)+'-'+Math.random().toString(36).slice(2,6)};
  if(!sl)sl=mk();
  if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(sl)||sl.length<3||sl.length>40)return msg('Link inválido: use 3 a 40 letras minúsculas, números e hífen (ex.: joao-eletricista).');
  btn.disabled=true;btn.textContent='Salvando...';
  const st=(window.v77stats?window.v77stats():{});
  const body=()=>({user_id:id,slug:sl,nome:nz(nome),empresa:nz(emp1),cidade:nz(g('cidade')),uf:nz(F('uf').value),area:nz(g('area')),whatsapp:nz(g('whatsapp')),bio:nz(g('bio')),fotos:fo,foto:foto||null,logo:logo||null,stats:st,publicado:F('publicado').checked,listado,atualizado:new Date().toISOString()});
  try{let r,j,tries=0;
   for(;;){r=await rq('/rest/v1/vitrine?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body())},1);
    if(r.ok)break;j=await r.json().catch(()=>({}));
    if(/duplicate|23505/.test(JSON.stringify(j))&&auto&&tries++<3){sl=mk();continue}
    break}
   if(r.ok){const a=await r.json();v=(Array.isArray(a)&&a[0])||body();ME=v;F('slug').value=v.slug;paint();tst('🌟 Perfil salvo')}
   else if(/duplicate|23505/.test(JSON.stringify(j)))msg('Esse link já está em uso. Escolha outro.');
   else if(/column|42703|PGRST204|schema cache/i.test(JSON.stringify(j)))msg('O banco ainda não tem os campos novos. Rode o arquivo supabase_perfis.sql no Supabase (SQL Editor) e tente de novo.');
   else msg('Não foi possível salvar. '+(j&&j.message||''))}
  catch(x){msg('Falha de conexão ao salvar.')}
  btn.disabled=false;btn.textContent='💾 Salvar perfil'}}

/* ================= PÁGINA PÚBLICA ================= */
async function page(slg,o={}){const old=$('vV');if(old)old.remove();
 const el=document.createElement('div');el.id='vV';el.className='pf-page';el.innerHTML='<p style="padding:60px;text-align:center;color:#64748b">Carregando perfil...</p>';document.body.appendChild(el);
 const close=()=>{el.remove();if(o.route&&!o.back)location.href='/'};
 let v=null;try{const r=await rq('/rest/v1/rpc/get_vitrine',{method:'POST',body:JSON.stringify({p_slug:slg})});v=await r.json()}catch(e){}
 if(!v||!v.slug){el.innerHTML=`<div style="padding:60px 20px;text-align:center"><div style="font-size:48px">🔌</div><h2 style="font-weight:800;font-size:22px">Perfil não encontrado</h2><p style="color:#64748b">Este link não existe ou o perfil não está publicado.</p><button class="btn or" data-bk style="margin-top:14px">${o.back?'Voltar':'Ir para o DC CAD Pro'}</button></div>`;el.onclick=e=>{if(e.target.closest('[data-bk]'))close()};return}
 const nome=v.nome||v.empresa||'Eletricista';document.title=nome+' • Eletricista | DC CAD Pro';
 const st=v.stats||{},fo=v.fotos||[],lc=local(v);
 el.innerHTML=`<div class="pf-wrap"><button class="btn ghost pf-bk" data-bk>← ${o.back?'Voltar':'DC CAD Pro'}</button>
 <div class="pf-hero">${av(v,92)}<h1>${E(nome)}</h1>${v.nome&&v.empresa?`<div class="pf-sub">🏢 ${E(v.empresa)}</div>`:''}<div class="pf-sub">⚡ Eletricista${lc?' • 📍 '+E(lc):''}</div>${v.area?`<div class="pf-sub" style="opacity:.8">${E(v.area)}</div>`:''}<span class="pf-nv">${E(st.nivel||'🌱 Iniciante')}</span></div>
 ${v.logo&&v.foto?`<div class="pf-box pf-lg"><img src="${E(v.logo)}" alt="Logo de ${E(v.empresa||nome)}"><b>${E(v.empresa||'')}</b></div>`:''}
 ${v.bio?`<div class="pf-box" style="white-space:pre-line;line-height:1.5">${E(v.bio)}</div>`:''}
 <div class="pf-st">${[['📐',st.proj||0,'projetos elétricos'],['🔌',st.pts||0,'pontos desenhados']].map(a=>`<div class="pf-box" style="margin:0;text-align:center"><div style="font-size:26px">${a[0]}</div><div style="font-size:24px;font-weight:800">${a[1]}</div><div style="font-size:12px;color:#64748b">${a[2]}</div></div>`).join('')}</div>
 ${(st.selos||[]).length?`<div class="pf-box"><b>🏅 Selos</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${st.selos.map(x=>`<span class="pf-selo">${E(x)}</span>`).join('')}</div></div>`:''}
 ${fo.length?`<div class="pf-box"><b>📷 Obras executadas</b><div class="pf-gal">${fo.map((u,i)=>`<img data-i="${i}" src="${E(u)}" alt="Obra ${i+1}" loading="lazy">`).join('')}</div></div>`:''}
 <div class="pf-sh"><button class="btn ghost" data-sh>🔗 Compartilhar perfil</button></div>
 <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:18px">Perfil criado com <a href="/" style="color:#f26b21;font-weight:700">DC CAD Pro</a></p></div>
 ${v.whatsapp?`<div class="pf-cta"><a class="w" href="${E(wa(v.whatsapp,'Olá '+nome+', vi seu perfil no DC CAD Pro e gostaria de um orçamento.'))}" target="_blank" rel="noopener">💬 Pedir orçamento no WhatsApp</a><a class="t" href="tel:${E(tel(v.whatsapp))}" title="Ligar">📞</a></div>`:''}`;
 el.onclick=async e=>{
  if(e.target.closest('[data-bk]')){close();return}
  if(e.target.closest('[data-sh]')){const u=location.origin+'/eletricista/'+v.slug;try{if(navigator.share){await navigator.share({title:nome,url:u});return}}catch(x){if(x&&x.name=='AbortError')return}try{await navigator.clipboard.writeText(u);tst('Link copiado')}catch(x){msg(u)}return}
  const i=e.target.closest&&e.target.closest('img[data-i]');if(!i)return;
  const z=document.createElement('div');z.style.cssText='position:fixed;inset:0;z-index:10000;background:#000d;display:grid;place-items:center;padding:12px';z.innerHTML='<img src="'+E(fo[i.dataset.i])+'" style="max-width:100%;max-height:100%;border-radius:10px">';z.onclick=()=>z.remove();document.body.appendChild(z)}}

/* ---------- botões de entrada ---------- */
function bind(){
 const top=document.querySelector('#vP .top'),bUt=$('bUtP');
 if(top&&!$('bPf77')){const b=document.createElement('button');b.id='bPf77';b.className='btn ghost';b.title='Perfis de eletricistas';b.innerHTML='🌟<span class="lb">&nbsp;Eletricistas</span>';b.onclick=()=>open('find');top.insertBefore(b,bUt||top.children[2]||null)}
 const hn=document.querySelector('#vH .hnav');
 if(hn&&!$('bPfH')){const b=document.createElement('button');b.id='bPfH';b.className='hnv';b.innerHTML='🌟 Eletricistas';b.onclick=()=>open('find');const a=hn.querySelector('.hnv');hn.insertBefore(b,a||hn.querySelector('.btn.or'))}
 const n=$('bPf74');if(n){n.onclick=()=>open('meu');n.innerHTML='🌟<span class="lb">&nbsp;Meu perfil</span>'}}
bind();
window.perfis77={open,page,mine:()=>open('meu'),find:()=>open('find')};
{const m=location.pathname.match(/^\/eletricista\/([^\/]+)\/?$/);if(m)page(decodeURIComponent(m[1]).toLowerCase(),{route:1})}
})();
