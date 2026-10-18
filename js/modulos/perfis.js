/* DC CAD Pro v8.0 — Cartão digital privado do eletricista: página individual (/p/seunome), Pix, serviços, galeria e imagem para compartilhar. Sem busca/diretório público. */
(()=>{'use strict';
const $=id=>document.getElementById(id),
E=s=>String(s==null?'':s).replace(/[&<>\"']/g,c=>'&#'+c.charCodeAt(0)+';'),
norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),
nz=s=>{s=String(s||'').trim();return s?s:null},
UFS=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'],
TPN={cpf:'CPF',cnpj:'CNPJ',tel:'Celular',mail:'E-mail',aleat:'Chave aleatória'},
logged=()=>typeof ses!='undefined'&&ses&&ses.access_token&&ses.access_token!='local',
tst=m=>{let t=$('t77');if(!t){t=document.createElement('div');t.id='t77';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99999;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',2600)},
wa=(n,t)=>{n=String(n||'').replace(/\D/g,'');if(n.length<=11)n='55'+n;return'https://wa.me/'+n+(t?'?text='+encodeURIComponent(t):'')},
tel=n=>String(n||'').replace(/[^\d+]/g,''),
fmtTel=n=>{const d=String(n||'').replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'');return d.length==11?d.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3'):d.length==10?d.replace(/(\d{2})(\d{4})(\d{4})/,'($1) $2-$3'):String(n||'')},
uidTok=()=>{try{return JSON.parse(atob(ses.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).sub}catch(e){return null}},
LINK=s=>location.origin+'/p/'+s;

/* ---------- estilos novos (cartão) ---------- */
{const st=document.createElement('style');st.textContent=`
.pf-sv{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.pf-sv span{background:#eef3f8;border:1px solid #dbe3ec;border-radius:99px;padding:7px 14px;font-size:14px;font-weight:600}
.pf-px{display:flex;align-items:center;gap:10px;margin-top:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:12px}.pf-px div{flex:1;min-width:0}.pf-px small{display:block;color:#64748b;font-size:12px}.pf-px b{word-break:break-all;font-size:15px}
.pf-bt{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.pf-bt .btn{min-height:46px}
.pf-cd{display:block;width:100%;max-width:420px;margin:12px auto 0;border-radius:16px;box-shadow:0 10px 30px #0f2a4333}
.pf-bk{margin-top:4px}
@media(max-width:700px){.pf-bt{grid-template-columns:1fr}}`;document.head.appendChild(st)}

/* ---------- rede (com renovação de sessão) ---------- */
async function rq(p,o={},auth){
 const H=()=>({apikey:CFG.key,Authorization:'Bearer '+(auth&&logged()?ses.access_token:CFG.key),'Content-Type':'application/json'});
 const go=()=>fetch(CFG.url+p,{...o,headers:{...H(),...(o.headers||{})}});
 let r=await go();
 if(r.status==401&&auth&&logged()&&ses.refresh_token){try{const d=await api('/auth/v1/token?grant_type=refresh_token',{refresh_token:ses.refresh_token});if(d&&d.access_token){ses=d;localStorage.setItem('dce_ses',JSON.stringify(d));r=await go()}}catch(e){}}
 return r}

/* ---------- imagens pequenas ---------- */
const shrink=(f,max,q,bg)=>new Promise((ok,no)=>{const i=new Image,u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(i.width*k));c.height=Math.max(1,Math.round(i.height*k));const g=c.getContext('2d');if(bg){g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height)}g.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',q))};i.onerror=()=>{URL.revokeObjectURL(u);no()};i.src=u});
const pickImg=(multi)=>new Promise(r=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=!!multi;i.onchange=()=>r([...i.files]);i.click()});
const loadImg=u=>new Promise(r=>{if(!u)return r(null);const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u});

/* ---------- avatar / iniciais ---------- */
const COL=['#1b4f7a','#f26b21','#0f766e','#7c3aed','#be123c','#15803d','#b45309'];
const ini=v=>{const s=(v.nome||v.empresa||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();return s||'?'};
const av=(v,s=56)=>{const im=v.foto||v.logo;
 if(im)return`<span class="pf-av" style="width:${s}px;height:${s}px"><img src="${E(im)}" alt=""></span>`;
 const c=COL[(norm(v.nome||v.empresa||'x').charCodeAt(0)||0)%COL.length];
 return`<span class="pf-av" style="width:${s}px;height:${s}px;background:${c};color:#fff;font-weight:800;font-size:${Math.round(s*.38)}px">${E(ini(v))}</span>`};
const local=v=>[v.cidade,v.uf].filter(Boolean).join(' - ');

/* ---------- Pix salvos na conta (mesmos do módulo Pix e WhatsApp) ---------- */
const pixLocal=()=>{try{const d=JSON.parse(localStorage.getItem('dce_pay75'));return Array.isArray(d&&d.pix)?d.pix.filter(p=>p&&p.chave):[]}catch(e){return[]}};
async function pixAll(){let l=pixLocal();if(!l.length&&logged()&&navigator.onLine){try{const r=await rq('/rest/v1/pagamentos?select=dados&limit=1',{},1);if(r.ok){const a=await r.json(),d=a[0]&&a[0].dados;if(d&&Array.isArray(d.pix))l=d.pix.filter(p=>p&&p.chave)}}catch(e){}}return l}

/* ---------- janela ---------- */
function modal(){const old=$('mPf77');if(old)old.remove();
 const m=document.createElement('div');m.id='mPf77';m.className='modal full';m.style.zIndex=9100;
 m.innerHTML=`<div style="max-width:640px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">🪪 Meu cartão digital</h3><button class="btn ghost ml-auto" data-x aria-label="Fechar">✕</button></div><div data-b></div></div>`;
 m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-x]'))m.remove()});
 document.body.appendChild(m);return m}

let ME=null;
async function loadMe(){if(!logged()||!navigator.onLine)return ME;const id=uidTok();if(!id)return ME;
 try{const r=await rq('/rest/v1/vitrine?user_id=eq.'+id+'&select=*',{},1);if(r.ok){const a=await r.json();ME=Array.isArray(a)&&a[0]?a[0]:{}}}catch(e){}return ME}

function open(){const m=modal();mine(m.querySelector('[data-b]'),m)}

/* ================= IMAGEM DO CARTÃO (compartilhar no WhatsApp/redes) ================= */
function wrapT(g,t,x,y,w,lh,max){const ws=String(t).split(/\s+/);let l='',n=0;for(const p of ws){const k=l?l+' '+p:p;if(g.measureText(k).width>w&&l){g.fillText(l,x,y+n*lh);n++;l=p;if(n>=max)return n}else l=k}if(l&&n<max){g.fillText(l,x,y+n*lh);n++}return n}
function fitT(g,t,x,y,w,z,wt){z=z||60;g.font=(wt||800)+' '+z+'px Inter,system-ui,sans-serif';while(z>26&&g.measureText(t).width>w){z-=2;g.font=(wt||800)+' '+z+'px Inter,system-ui,sans-serif'}g.fillText(t,x,y)}
const rr=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
async function cardCanvas(d){
 try{await document.fonts.load('800 40px Inter')}catch(e){}
 const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const bg=g.createLinearGradient(0,0,W*.6,H);bg.addColorStop(0,'#0b2036');bg.addColorStop(.6,'#15446b');bg.addColorStop(1,'#1b5a8a');g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.strokeStyle='#ffffff12';g.lineWidth=1;for(let i=0;i<W;i+=40){g.beginPath();g.moveTo(i,0);g.lineTo(i,H);g.stroke()}for(let i=0;i<H;i+=40){g.beginPath();g.moveTo(0,i);g.lineTo(W,i);g.stroke()}
 g.fillStyle='#f26b21';g.fillRect(0,0,W,12);
 g.textAlign='center';g.fillStyle='#ffffffb0';g.font='700 28px Inter,system-ui,sans-serif';g.fillText('⚡ CARTÃO DIGITAL • ELETRICISTA',W/2,70);
 /* avatar */
 const im=await loadImg(d.foto||d.logo),cx=W/2,cy=250,R=130;
 g.save();g.beginPath();g.arc(cx,cy,R+8,0,7);g.fillStyle='#fff';g.fill();g.beginPath();g.arc(cx,cy,R,0,7);g.clip();
 if(im){const k=Math.max(2*R/im.width,2*R/im.height),w=im.width*k,h=im.height*k;g.drawImage(im,cx-w/2,cy-h/2,w,h)}
 else{g.fillStyle=COL[(norm(d.nome||d.empresa||'x').charCodeAt(0)||0)%COL.length];g.fillRect(cx-R,cy-R,2*R,2*R);g.fillStyle='#fff';g.font='800 110px Inter,system-ui,sans-serif';g.fillText(ini(d),cx,cy+38)}
 g.restore();
 g.fillStyle='#fff';g.textAlign='center';
 fitT(g,d.nome||d.empresa||'Eletricista',W/2,470,940,68);
 let y=470;
 if(d.nome&&d.empresa){y+=52;g.fillStyle='#ffd9c2';fitT(g,'🏢 '+d.empresa,W/2,y,900,38,700)}
 if(d.area){y+=46;g.fillStyle='#dbe7f3';g.font='500 30px Inter,system-ui,sans-serif';const n=wrapT(g,d.area,W/2,y,880,38,2);y+=(n-1)*38}
 const lc=local(d);if(lc){y+=46;g.fillStyle='#dbe7f3';g.font='600 30px Inter,system-ui,sans-serif';g.fillText('📍 '+lc,W/2,y)}
 if(d.nivel){y+=30;const t=String(d.nivel);g.font='800 26px Inter,system-ui,sans-serif';const w=g.measureText(t).width+44;rr(g,W/2-w/2,y,w,46,23);g.fillStyle='#f26b21';g.fill();g.fillStyle='#fff';g.fillText(t,W/2,y+32);y+=46}
 /* serviços */
 const sv=(d.servicos||[]).slice(0,6);
 if(sv.length){const py=Math.max(y+30,700);rr(g,60,py,W-120,Math.min(300,60+Math.ceil(sv.length/2)*54+20),28);g.fillStyle='#ffffff';g.fill();
  g.fillStyle='#0f2a43';g.textAlign='left';g.font='800 30px Inter,system-ui,sans-serif';g.fillText('Serviços',96,py+50);
  g.font='600 27px Inter,system-ui,sans-serif';g.fillStyle='#1b2a3a';
  sv.forEach((s,i)=>{const col=i%2,row=Math.floor(i/2),x=96+col*470,yy=py+100+row*54;g.fillStyle='#f26b21';g.fillText('✔',x,yy);g.fillStyle='#1b2a3a';let t=String(s);while(g.measureText(t).width>400&&t.length>4)t=t.slice(0,-2);if(t!==String(s))t=t.trim()+'…';g.fillText(t,x+40,yy)})}
 /* rodapé: whatsapp + QR */
 const fy=1050;rr(g,60,fy,W-120,240,30);g.fillStyle='#fff';g.fill();
 let qx=W-60-40-190;
 let hasQR=false;
 if(d.link&&typeof qrcode=='function'){try{const q=qrcode(0,'M');q.addData(d.link);q.make();const n=q.getModuleCount(),s=190/n;g.fillStyle='#0f2a43';for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))g.fillRect(qx+k*s,fy+25+r*s,Math.ceil(s),Math.ceil(s));hasQR=true}catch(e){}}
 g.textAlign='left';
 if(d.whatsapp){rr(g,96,fy+36,hasQR?560:860,84,42);g.fillStyle='#16a34a';g.fill();g.fillStyle='#fff';g.font='800 36px Inter,system-ui,sans-serif';g.fillText('💬 '+fmtTel(d.whatsapp),126,fy+92)}
 g.fillStyle='#64748b';g.font='600 24px Inter,system-ui,sans-serif';
 if(d.link){let t=d.link.replace(/^https?:\/\//,'');const mw=hasQR?560:860;while(g.measureText(t).width>mw&&t.length>8)t=t.slice(0,-2);g.fillText(t,96,fy+160);g.font='500 22px Inter,system-ui,sans-serif';g.fillText(hasQR?'Aponte a câmera para o QR Code →':'Acesse o link para ver meu perfil',96,fy+196)}
 if(hasQR){g.textAlign='center';g.fillStyle='#64748b';g.font='600 20px Inter,system-ui,sans-serif';g.fillText('Meu perfil',qx+95,fy+226)}
 g.textAlign='center';g.fillStyle='#ffffff90';g.font='600 22px Inter,system-ui,sans-serif';g.fillText('Feito com DC CAD Pro • dccadpro.com',W/2,1322);
 return c}
async function showCard(d){
 const m=document.createElement('div');m.className='modal full';m.style.zIndex=9300;
 m.innerHTML=`<div style="max-width:520px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">🖼 Cartão para compartilhar</h3><button class="btn ghost ml-auto" data-x>✕</button></div><p class="pf-vz" data-ld>Montando o cartão…</p><div data-w></div></div>`;
 m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-x]'))m.remove()});document.body.appendChild(m);
 let c;try{c=await cardCanvas(d)}catch(e){m.querySelector('[data-ld]').textContent='Não consegui montar o cartão.';return}
 const nm=(norm(d.nome||d.empresa||'cartao').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'cartao')+'-cartao.png';
 const blob=await new Promise(r=>c.toBlob(r,'image/png'));
 m.querySelector('[data-ld]').remove();
 m.querySelector('[data-w]').innerHTML=`<img class="pf-cd" src="${c.toDataURL('image/png')}" alt="Cartão digital"><div class="pf-bt"><button class="btn or" data-sh>📲 Compartilhar</button><button class="btn ghost" data-dl>⬇ Baixar imagem (PNG)</button></div>${d.link?`<button class="btn ghost w-full mt-2" data-cl>🔗 Copiar link do perfil</button>`:''}`;
 m.querySelector('[data-w]').onclick=async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.dl!==undefined){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nm;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
  else if(b.dataset.cl!==undefined){try{await navigator.clipboard.writeText(d.link);tst('Link copiado')}catch(x){tst(d.link)}}
  else if(b.dataset.sh!==undefined){try{const f=new File([blob],nm,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:d.nome||d.empresa||'Cartão digital',text:d.link||''});return}}catch(x){if(x&&x.name=='AbortError')return}
   const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nm;document.body.appendChild(a);a.click();a.remove();tst('Imagem baixada: envie pelo WhatsApp')}}}

/* ================= MEU CARTÃO (edição) ================= */
async function mine(box,m){
 if(!logged()){box.innerHTML=`<div class="pf-vz"><div style="font-size:42px">🪪</div><b>Entre na sua conta para criar seu cartão digital</b><p class="text-sm" style="color:#64748b;margin:6px 0 12px">Seu cartão fica salvo na conta e vale em qualquer aparelho. Só quem receber o seu link consegue ver.</p><button class="btn or" data-login>Entrar / criar conta</button></div>`;
  box.querySelector('[data-login]').onclick=()=>{m.remove();try{show('vL')}catch(e){}};return}
 if(!navigator.onLine){box.innerHTML='<p class="pf-vz">📴 Você está offline. Conecte-se para editar o cartão.</p>';return}
 box.innerHTML='<p class="pf-vz">Carregando seu cartão...</p>';
 const id=uidTok();if(!id){box.innerHTML='<p class="pf-vz">Sessão inválida. Saia e entre novamente.</p>';return}
 let v=await loadMe()||{};const pixes=await pixAll();
 let emp={};try{emp=JSON.parse(localStorage.getItem('dce_emp71'))||{}}catch(e){}
 const novo=!v.slug,sx=v.stats||{};
 const d={nome:v.nome||'',empresa:v.empresa!=null?v.empresa:(novo?emp.nome||'':''),whatsapp:v.whatsapp!=null?v.whatsapp:(novo?emp.tel||'':''),cidade:v.cidade||'',uf:v.uf||'',area:v.area||'',bio:v.bio||''};
 let fo=(v.fotos||[]).slice(),foto=v.foto||'',logo=v.logo||'';
 const curPix=sx.pix&&sx.pix.chave?sx.pix:null;
 const pxOpt=pixes.map((p,i)=>`<option value="${i}"${curPix&&String(curPix.chave)==String(p.chave)?' selected':''}>${E((p.rotulo||p.nome||'Pix')+' • '+(TPN[p.tipo]||'Chave')+' • '+p.chave)}</option>`).join('')+(curPix&&!pixes.some(p=>String(p.chave)==String(curPix.chave))?`<option value="cur" selected>${E((curPix.nome||'Pix')+' • '+curPix.chave)}</option>`:'');
 box.innerHTML=`<p class="text-sm" style="color:#64748b;margin:2px 0 8px">Seu cartão é <b>privado</b>: não existe lista nem busca de eletricistas. Só quem receber o seu link (ou a imagem do cartão) vê esta página. Tudo é opcional.</p>
 <div class="pf-ph"><div><div class="pf-pl">Sua foto</div><button type="button" class="pf-pic" data-pf>${foto?`<img src="${E(foto)}" alt="">`:'<span>📷</span>'}</button><button type="button" class="pf-rm" data-pfx ${foto?'':'hidden'}>remover</button></div>
 <div><div class="pf-pl">Foto / logo da empresa</div><button type="button" class="pf-pic sq" data-lg>${logo?`<img src="${E(logo)}" alt="">`:'<span>🏢</span>'}</button><button type="button" class="pf-rm" data-lgx ${logo?'':'hidden'}>remover</button></div></div>
 <label class="text-xs font-bold">Seu nome<input class="in" data-f="nome" maxlength="60" value="${E(d.nome)}" autocomplete="name"></label>
 <label class="text-xs font-bold">Empresa<input class="in" data-f="empresa" maxlength="80" value="${E(d.empresa)}" autocomplete="organization"></label>
 <label class="text-xs font-bold">Telefone / WhatsApp<input class="in" data-f="whatsapp" type="tel" inputmode="tel" maxlength="20" value="${E(d.whatsapp)}" placeholder="14 99999-9999" autocomplete="tel"></label>
 <div style="display:grid;grid-template-columns:1fr 92px;gap:8px"><label class="text-xs font-bold">Cidade<input class="in" data-f="cidade" maxlength="60" value="${E(d.cidade)}" placeholder="Ex.: Bauru"></label>
 <label class="text-xs font-bold">UF<select class="in" data-f="uf"><option value="">—</option>${UFS.map(u=>`<option${u==d.uf?' selected':''}>${u}</option>`).join('')}</select></label></div>
 <label class="text-xs font-bold">Área de atuação<input class="in" data-f="area" maxlength="80" value="${E(d.area)}" placeholder="Ex.: residencial e comercial, quadros, automação"></label>
 <label class="text-xs font-bold">Sobre você (bio)<textarea class="in" rows="4" data-f="bio" maxlength="600" placeholder="Conte sua experiência e diferenciais.">${E(d.bio)}</textarea></label>
 <label class="text-xs font-bold">Serviços prestados <span style="font-weight:500;color:#64748b">(um por linha, até 12)</span><textarea class="in" rows="5" data-f="servicos" placeholder="Instalação de quadros de distribuição&#10;Troca de fiação&#10;Chuveiro e torneira elétrica&#10;Projeto elétrico residencial">${E((sx.servicos||[]).join('\n'))}</textarea></label>
 <div class="text-xs font-bold" style="margin-top:10px">Fotos de QDC e obras (até 8)</div><div data-fo class="pf-fo"></div><button class="btn ghost" data-ad style="margin-top:6px">📷 Adicionar fotos</button>
 <label class="text-xs font-bold" style="display:block;margin-top:12px">Chave Pix no cartão<select class="in" data-f="pix"><option value="">Não mostrar Pix</option>${pxOpt}</select></label>
 <p class="text-xs" style="color:#64748b;margin-top:4px">${pixes.length?'Escolha um dos Pix cadastrados em Pix e WhatsApp. A chave escolhida fica visível para quem abrir o seu link.':'Você ainda não cadastrou nenhuma chave Pix. Cadastre em <b>Pix e WhatsApp</b> e volte aqui.'}</p>
 <label class="pf-sw"><input type="checkbox" data-f="publicado" ${v.publicado===false?'':'checked'}> <span><b>Cartão visível pelo link</b><br><small>Desmarque para desativar o link por completo.</small></span></label>
 <details style="margin-top:8px"><summary class="text-xs font-bold" style="cursor:pointer">🔗 Link personalizado (opcional)</summary><div class="text-xs" style="color:#64748b;margin-top:6px">${E(location.origin)}/p/<input class="in" data-f="slug" maxlength="40" value="${E(v.slug||'')}" placeholder="gerado automaticamente"></div></details>
 <div data-l class="text-xs" style="margin-top:10px;color:#64748b"></div>
 <div class="pf-bt"><button class="btn or" data-ok>💾 Salvar cartão</button><button class="btn ghost" data-cd>🖼 Gerar imagem do cartão</button></div>`;
 const q=s=>box.querySelector(s),F=k=>q('[data-f="'+k+'"]');
 const paint=()=>{q('[data-fo]').innerHTML=fo.map((u,i)=>`<div style="position:relative"><img src="${E(u)}" alt=""><button data-r="${i}" class="btn danger" style="position:absolute;top:3px;right:3px;min-height:0;padding:0 8px">✕</button></div>`).join('');
  q('[data-pf]').innerHTML=foto?`<img src="${E(foto)}" alt="">`:'<span>📷</span>';q('[data-pfx]').hidden=!foto;
  q('[data-lg]').innerHTML=logo?`<img src="${E(logo)}" alt="">`:'<span>🏢</span>';q('[data-lgx]').hidden=!logo;
  q('[data-l]').innerHTML=v.slug?`🔗 Seu link: <b style="word-break:break-all">${E(LINK(v.slug))}</b><div class="pf-chips"><button class="btn ghost" data-cp>Copiar</button><button class="btn ghost" data-ver>👁 Ver como cliente</button><button class="btn ghost" data-wz>📲 Enviar no WhatsApp</button></div>`:'';};paint();
 const servs=()=>F('servicos').value.split(/\n+/).map(s=>s.trim().slice(0,40)).filter(Boolean).slice(0,12);
 const pixSel=()=>{const s=F('pix').value;if(s==='')return null;if(s==='cur')return curPix;const p=pixes[+s];return p?{tipo:p.tipo||'aleat',chave:String(p.chave),nome:p.nome||''}:null};
 const cur=()=>({nome:F('nome').value.trim(),empresa:F('empresa').value.trim(),whatsapp:F('whatsapp').value.trim(),cidade:F('cidade').value.trim(),uf:F('uf').value,area:F('area').value.trim(),foto,logo,servicos:servs(),nivel:(window.v77stats?window.v77stats().nivel:''),link:v.slug?LINK(v.slug):''});
 box.addEventListener('click',async e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.r!==undefined){fo.splice(+t.dataset.r,1);paint()}
  else if(t.dataset.pf!==undefined){const [f]=await pickImg();if(f){try{foto=await shrink(f,200,.8,1);paint()}catch(x){tst('Não consegui abrir essa imagem')}}}
  else if(t.dataset.pfx!==undefined){foto='';paint()}
  else if(t.dataset.lg!==undefined){const [f]=await pickImg();if(f){try{logo=await shrink(f,240,.85,1);paint()}catch(x){tst('Não consegui abrir essa imagem')}}}
  else if(t.dataset.lgx!==undefined){logo='';paint()}
  else if(t.dataset.ad!==undefined){for(const f of await pickImg(1)){if(fo.length>=8)break;try{fo.push(await shrink(f,720,.68))}catch(x){}}paint()}
  else if(t.dataset.cp!==undefined){try{await navigator.clipboard.writeText(LINK(v.slug));tst('Link copiado')}catch(x){tst(LINK(v.slug))}}
  else if(t.dataset.ver!==undefined)page(v.slug,{back:1});
  else if(t.dataset.wz!==undefined)window.open('https://wa.me/?text='+encodeURIComponent('Conheça meu cartão digital: '+LINK(v.slug)),'_blank');
  else if(t.dataset.cd!==undefined){if(!v.slug)tst('Dica: salve o cartão primeiro para o QR Code do link aparecer.');showCard(cur())}
  else if(t.dataset.ok!==undefined)salvar(t)});
 async function salvar(btn){
  const g=k=>F(k).value.trim(),nome=g('nome'),emp1=g('empresa');
  if(nome&&nome.length<2)return msg('O nome precisa ter pelo menos 2 letras (ou deixe em branco).');
  let sl=g('slug').toLowerCase(),auto=!sl&&!v.slug;
  if(!sl&&v.slug)sl=v.slug;
  const mk=()=>{const b=norm(nome||emp1||'eletricista').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,30)||'eletricista';return(b.length<3?'eletricista':b)+'-'+Math.random().toString(36).slice(2,6)};
  if(!sl)sl=mk();
  if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(sl)||sl.length<3||sl.length>40)return msg('Link inválido: use 3 a 40 letras minúsculas, números e hífen (ex.: joao-eletricista).');
  btn.disabled=true;btn.textContent='Salvando...';
  const st=Object.assign({},v.stats||{},(window.v77stats?window.v77stats():{}),{servicos:servs(),pix:pixSel()});
  const body=()=>({user_id:id,slug:sl,nome:nz(nome),empresa:nz(emp1),cidade:nz(g('cidade')),uf:nz(F('uf').value),area:nz(g('area')),whatsapp:nz(g('whatsapp')),bio:nz(g('bio')),fotos:fo,foto:foto||null,logo:logo||null,stats:st,publicado:F('publicado').checked,listado:false,atualizado:new Date().toISOString()});
  try{let r,j,tries=0;
   for(;;){r=await rq('/rest/v1/vitrine?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body())},1);
    if(r.ok)break;j=await r.json().catch(()=>({}));
    if(/duplicate|23505/.test(JSON.stringify(j))&&auto&&tries++<3){sl=mk();continue}
    break}
   if(r.ok){const a=await r.json();v=(Array.isArray(a)&&a[0])||body();ME=v;F('slug').value=v.slug;paint();tst('🪪 Cartão salvo')}
   else if(/duplicate|23505/.test(JSON.stringify(j)))msg('Esse link já está em uso. Escolha outro.');
   else if(/column|42703|PGRST204|schema cache/i.test(JSON.stringify(j)))msg('O banco ainda não tem os campos do perfil. Rode o arquivo supabase_perfis.sql no Supabase (SQL Editor) e tente de novo.');
   else msg('Não foi possível salvar. '+(j&&j.message||''))}
  catch(x){msg('Falha de conexão ao salvar.')}
  btn.disabled=false;btn.textContent='💾 Salvar cartão'}}

/* ================= PÁGINA INDIVIDUAL (/p/seunome) ================= */
async function page(slg,o={}){const old=$('vV');if(old)old.remove();
 const el=document.createElement('div');el.id='vV';el.className='pf-page';el.innerHTML='<p style="padding:60px;text-align:center;color:#64748b">Carregando cartão...</p>';document.body.appendChild(el);
 const close=()=>{el.remove();if(o.route&&!o.back)location.href='/'};
 let v=null;try{const r=await rq('/rest/v1/rpc/get_vitrine',{method:'POST',body:JSON.stringify({p_slug:slg})});v=await r.json()}catch(e){}
 if(!v||!v.slug){el.innerHTML=`<div style="padding:60px 20px;text-align:center"><div style="font-size:48px">🔌</div><h2 style="font-weight:800;font-size:22px">Cartão não encontrado</h2><p style="color:#64748b">Este link não existe ou o cartão não está ativo.</p><button class="btn or" data-bk style="margin-top:14px">${o.back?'Voltar':'Ir para o DC CAD Pro'}</button></div>`;el.onclick=e=>{if(e.target.closest('[data-bk]'))close()};return}
 const nome=v.nome||v.empresa||'Eletricista';document.title=nome+' • Eletricista | DC CAD Pro';
 try{let mr=document.querySelector('meta[name=robots]');if(!mr){mr=document.createElement('meta');mr.name='robots';document.head.appendChild(mr)}mr.content='noindex,nofollow'}catch(e){}
 const st=v.stats||{},fo=v.fotos||[],lc=local(v),sv=Array.isArray(st.servicos)?st.servicos:[],px=st.pix&&st.pix.chave?st.pix:null;
 el.innerHTML=`<div class="pf-wrap">${o.back?`<button class="btn ghost pf-bk" data-bk>← Voltar</button>`:''}
 <div class="pf-hero">${av(v,92)}<h1>${E(nome)}</h1>${v.nome&&v.empresa?`<div class="pf-sub">🏢 ${E(v.empresa)}</div>`:''}<div class="pf-sub">⚡ Eletricista${lc?' • 📍 '+E(lc):''}</div>${v.area?`<div class="pf-sub" style="opacity:.8">${E(v.area)}</div>`:''}<span class="pf-nv">${E(st.nivel||'🌱 Iniciante')}</span></div>
 ${v.logo&&v.foto?`<div class="pf-box pf-lg"><img src="${E(v.logo)}" alt="Logo de ${E(v.empresa||nome)}"><b>${E(v.empresa||'')}</b></div>`:''}
 ${v.bio?`<div class="pf-box" style="white-space:pre-line;line-height:1.5">${E(v.bio)}</div>`:''}
 ${sv.length?`<div class="pf-box"><b>🛠 Serviços prestados</b><div class="pf-sv">${sv.map(x=>`<span>${E(x)}</span>`).join('')}</div></div>`:''}
 ${px?`<div class="pf-box"><b>💳 Chave Pix</b><div class="pf-px"><div><small>${E(TPN[px.tipo]||'Chave')}${px.nome?' • '+E(px.nome):''}</small><b>${E(px.chave)}</b></div><button class="btn ghost" data-cpx>📋 Copiar</button></div></div>`:''}
 <div class="pf-st">${[['📐',st.proj||0,'projetos elétricos'],['🔌',st.pts||0,'pontos desenhados']].map(a=>`<div class="pf-box" style="margin:0;text-align:center"><div style="font-size:26px">${a[0]}</div><div style="font-size:24px;font-weight:800">${a[1]}</div><div style="font-size:12px;color:#64748b">${a[2]}</div></div>`).join('')}</div>
 ${(st.selos||[]).length?`<div class="pf-box"><b>🏅 Selos</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${st.selos.map(x=>`<span class="pf-selo">${E(x)}</span>`).join('')}</div></div>`:''}
 ${fo.length?`<div class="pf-box"><b>📷 Quadros e obras executadas</b><div class="pf-gal">${fo.map((u,i)=>`<img data-i="${i}" src="${E(u)}" alt="Obra ${i+1}" loading="lazy">`).join('')}</div></div>`:''}
 <div class="pf-sh"><button class="btn ghost" data-sh>🔗 Compartilhar cartão</button></div>
 <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:18px">Cartão criado com <a href="/" style="color:#f26b21;font-weight:700">DC CAD Pro</a></p></div>
 ${v.whatsapp?`<div class="pf-cta"><a class="w" href="${E(wa(v.whatsapp,'Olá '+nome+', vi seu cartão digital e gostaria de um orçamento.'))}" target="_blank" rel="noopener">💬 Pedir orçamento no WhatsApp</a><a class="t" href="tel:${E(tel(v.whatsapp))}" title="Ligar">📞</a></div>`:''}`;
 el.onclick=async e=>{
  if(e.target.closest('[data-bk]')){close();return}
  if(e.target.closest('[data-cpx]')){try{await navigator.clipboard.writeText(px.chave);tst('Chave Pix copiada')}catch(x){msg(px.chave)}return}
  if(e.target.closest('[data-sh]')){const u=LINK(v.slug);try{if(navigator.share){await navigator.share({title:nome,url:u});return}}catch(x){if(x&&x.name=='AbortError')return}try{await navigator.clipboard.writeText(u);tst('Link copiado')}catch(x){msg(u)}return}
  const i=e.target.closest&&e.target.closest('img[data-i]');if(!i)return;
  const z=document.createElement('div');z.style.cssText='position:fixed;inset:0;z-index:10000;background:#000d;display:grid;place-items:center;padding:12px';z.innerHTML='<img src="'+E(fo[i.dataset.i])+'" style="max-width:100%;max-height:100%;border-radius:10px">';z.onclick=()=>z.remove();document.body.appendChild(z)}}

/* ---------- botões de entrada (sem lista pública) ---------- */
function bind(){
 const top=document.querySelector('#vP .top'),bUt=$('bUtP');
 if(top&&!$('bPf77')){const b=document.createElement('button');b.id='bPf77';b.className='btn ghost';b.title='Meu cartão digital';b.innerHTML='🪪<span class="lb">&nbsp;Meu cartão</span>';b.onclick=()=>open();top.insertBefore(b,bUt||top.children[2]||null)}
 else if($('bPf77')){const b=$('bPf77');b.title='Meu cartão digital';b.innerHTML='🪪<span class="lb">&nbsp;Meu cartão</span>';b.onclick=()=>open()}
 const h=$('bPfH');if(h)h.remove();
 const n=$('bPf74');if(n){n.onclick=()=>open();n.innerHTML='🪪<span class="lb">&nbsp;Meu cartão</span>'}}
bind();
window.perfis77={open,page,mine:()=>open(),find:()=>open(),card:showCard};
{const m=location.pathname.match(/^\/(?:p|eletricista)\/([^\/]+)\/?$/);if(m)page(decodeURIComponent(m[1]).toLowerCase(),{route:1})}

})();
