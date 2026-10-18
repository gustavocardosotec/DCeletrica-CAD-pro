/* DC CAD Pro — Navbar reestruturada (PC: menus "Ferramentas" e conta | Celular: drawer lateral + barra inferior). Não altera banco/imagens. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const TOOLS=[['🧮','Utilitários',{id:'bUtP'}],['💳','Pix e WhatsApp',{id:'bPay75'}],['🪪','Meu cartão',{id:'bPf77'}],['📷','Relatório fotográfico',{fn:()=>window.docs&&window.docs.open('laudo')}],['🧾','Recibo de pagamento',{fn:()=>window.docs&&window.docs.open('recibo')}],['📂','Laudos e recibos salvos',{fn:()=>window.docs&&window.docs.open()}],['📲','Instalar app',{fn:()=>inst(),show:()=>!!(dp||(ios&&!standalone))}],['🌿','Campo',{r:/Campo/}],['📋','Novidades',{id:'bNv'}],['💬','Feedback',{id:'bFb'}],['🆘','Suporte',{id:'bSp'}]];
const ACC=[['📬','Feedbacks',{id:'bAdm',adm:1}],['📨','Caixa de suporte',{id:'bSpA',adm:1}],['👥','Contas',{id:'bCt',adm:1}],['⚙️','Configurações',{id:'bCfg'}],['☁️','Criar conta',{id:'bCa'}],['⎋','Sair',{id:'bOut',danger:1}]];
let dp=null;const ios=/iPad|iPhone|iPod/.test(navigator.userAgent),standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e});addEventListener('appinstalled',()=>{dp=null});
const inst=async()=>{if(dp){dp.prompt();try{await dp.userChoice}catch(e){}dp=null}else if(ios)alert('No iPhone: toque em Compartilhar (quadrado com seta) e depois em "Adicionar à Tela de Início".')};
const css=`
#vP .top.nvb{gap:10px;padding:10px 20px;padding-top:calc(10px + env(safe-area-inset-top))}
#vP .top.nvb>*:not(.nvbk){display:none!important}
.nvbk{flex:none}
.nvbc{flex:1;display:flex;justify-content:center;align-items:center;gap:6px}
.nvbb{display:inline-flex;align-items:center;gap:6px;min-height:42px;padding:8px 16px;border-radius:10px;font-size:14px;font-weight:700;color:#0f2a43;background:transparent;white-space:nowrap}
.nvbb:hover{background:#eef3f8}.nvbb.on{background:#fde9dc;color:#d95a14}
.nvbb.pri{background:#f26b21;color:#fff}.nvbb.pri:hover{background:#d95a14}
.nvbd{position:relative}
.nvbm{display:none;position:absolute;top:calc(100% + 6px);min-width:240px;background:#fff;border:1px solid #dbe3ec;border-radius:14px;box-shadow:0 14px 34px #0f2a4333;padding:6px;z-index:80}
.nvbd.open .nvbm{display:block}.nvbr .nvbm{right:0}.nvbc .nvbm{left:50%;transform:translateX(-50%)}
.nvbi{display:flex;align-items:center;gap:10px;width:100%;text-align:left;min-height:44px;padding:8px 12px;border-radius:9px;font-size:14px;font-weight:600;color:#1b2a3a}
.nvbi:hover{background:#eef3f8}.nvbi.danger{color:#b42318}.nvbi i{font-style:normal;width:22px;text-align:center}
.nvbh{padding:6px 12px 4px;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.5px}
.nvbsp{height:1px;background:#dbe3ec;margin:4px 6px}
.nvbr .nvbb{max-width:220px;overflow:hidden;text-overflow:ellipsis}
.nvbmob{display:none}
#nvbdr{position:fixed;inset:0;z-index:9000;background:#0f2a4399;backdrop-filter:blur(2px);display:none}
#nvbdr.open{display:block}
#nvbdr>div{position:absolute;left:0;top:0;bottom:0;width:min(86vw,320px);background:#fff;overflow:auto;padding:calc(14px + env(safe-area-inset-top)) 10px calc(20px + env(safe-area-inset-bottom));box-shadow:8px 0 30px #0005;animation:nvbin .2s ease-out}
@keyframes nvbin{from{transform:translateX(-100%)}to{transform:none}}
#nvbdr .nvbi{min-height:50px;font-size:15px}
#nvbdr .hd{display:flex;align-items:center;gap:8px;padding:4px 8px 12px;font-weight:800;color:#0f2a43}
#nvbdr .hd small{display:block;font-weight:500;color:#64748b;font-size:12px;word-break:break-all}
#nvbbn{display:none}
@media(max-width:820px){
 .nvbc,.nvbr{display:none!important}
 .nvbmob{display:inline-flex}
 #vP .top.nvb{padding:8px 12px;padding-top:calc(8px + env(safe-area-inset-top))}
 #vP .top.nvb .logo{font-size:15px;flex:1;min-width:0}
 #nvbhb{min-width:46px;min-height:46px;font-size:22px;border-radius:12px;background:#fff;border:1px solid #dbe3ec;justify-content:center}
 #nvbbn{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:40;background:#fff;border-top:1px solid #dbe3ec;padding:4px 6px calc(4px + env(safe-area-inset-bottom));box-shadow:0 -4px 16px #0f2a4318}
 body:not([data-v=vP]) #nvbbn{display:none}
 #nvbbn button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:56px;border-radius:12px;font-size:11px;font-weight:700;color:#64748b}
 #nvbbn button i{font-style:normal;font-size:22px}
 #nvbbn button.on{color:#d95a14;background:#fde9dc}
 #vP{padding-bottom:84px}
}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const top=document.querySelector('#vP .top');if(!top)return;
const find=it=>it.id?$(it.id):[...top.querySelectorAll('button')].find(b=>!b.classList.contains('nvbk')&&it.r.test(b.textContent));
const ok=it=>{if(it.fn)return it.show?it.show():true;const e=find(it);if(!e||e.style.display=='none')return false;if(it.adm){const w=$('admW');if(w&&w.style.display=='none')return false}return true};
const close=()=>{document.querySelectorAll('.nvbd.open').forEach(d=>d.classList.remove('open'));$('nvbdr').classList.remove('open')};
const run=it=>{close();setTimeout(()=>{if(it.fn)return it.fn();const e=find(it);if(e)e.click()},40)};
const items=(list,box)=>{box.innerHTML='';list.forEach(([ic,lb,it])=>{if(!ok(it))return;const b=document.createElement('button');b.className='nvbi'+(it.danger?' danger':'');b.innerHTML='<i>'+ic+'</i><span>'+lb+'</span>';b.onclick=()=>run(it);box.appendChild(b)})};
const goCad=()=>{close();if(typeof show=='function')show('vP');scrollTo({top:0,behavior:'smooth'})};
const goOrc=()=>run({id:'bOrc80'});
const who=()=>(($('us')||{}).textContent||'').trim()||'Minha conta';
top.classList.add('nvb');
const logo=top.querySelector('.logo');if(logo)logo.classList.add('nvbk');
/* PC: centro */
const c=document.createElement('div');c.className='nvbc nvbk';
c.innerHTML='<button class="nvbb on" id="nvbcad">📐 CAD</button><button class="nvbb" id="nvborc">🧾 Orçamentos</button><div class="nvbd"><button class="nvbb" data-m="t">🧰 Ferramentas ▾</button><div class="nvbm"></div></div>';
/* PC: conta */
const r=document.createElement('div');r.className='nvbr nvbk nvbd';
r.innerHTML='<button class="nvbb" data-m="a">👤 <span id="nvbu"></span> ▾</button><div class="nvbm"></div>';
/* Celular: hambúrguer */
const hb=document.createElement('button');hb.id='nvbhb';hb.className='nvbk nvbmob nvbb';hb.setAttribute('aria-label','Menu');hb.textContent='☰';
top.append(c,r,hb);
c.querySelector('#nvbcad').onclick=goCad;c.querySelector('#nvborc').onclick=goOrc;
const dm=(btn,list)=>{btn.onclick=e=>{e.stopPropagation();const d=btn.parentElement,o=d.classList.contains('open');close();if(!o){if(btn.dataset.m=='a')$('nvbu').textContent=who();items(list,d.querySelector('.nvbm'));d.classList.add('open')}}};
dm(c.querySelector('[data-m=t]'),TOOLS);dm(r.querySelector('[data-m=a]'),ACC);
$('nvbu')&&($('nvbu').textContent=who());
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.nvbd'))document.querySelectorAll('.nvbd.open').forEach(d=>d.classList.remove('open'))},true);
/* Drawer */
const dr=document.createElement('div');dr.id='nvbdr';
dr.innerHTML='<div><div class="hd"><span style="font-size:22px">👤</span><div><span id="nvbdn"></span><small>DC CAD Pro</small></div></div><button class="nvbi" data-g="cad"><i>📐</i><span>Projetos CAD &amp; IA</span></button><button class="nvbi" data-g="orc"><i>🧾</i><span>Orçamentos</span></button><div class="nvbsp"></div><div class="nvbh">Ferramentas</div><div data-l="t"></div><div class="nvbsp"></div><div class="nvbh">Conta</div><div data-l="a"></div></div>';
document.body.appendChild(dr);
dr.onclick=e=>{if(e.target===dr)close()};
dr.querySelector('[data-g=cad]').onclick=goCad;dr.querySelector('[data-g=orc]').onclick=goOrc;
const openDr=()=>{$('nvbdn').textContent=who();items(TOOLS,dr.querySelector('[data-l=t]'));items(ACC,dr.querySelector('[data-l=a]'));dr.classList.add('open')};
hb.onclick=openDr;
/* Barra inferior */
const bn=document.createElement('nav');bn.id='nvbbn';
bn.innerHTML='<button class="on" data-b="cad"><i>📐</i>CAD</button><button data-b="orc"><i>🧾</i>Orçamentos</button><button data-b="pix"><i>💳</i>Pix</button><button data-b="more"><i>☰</i>Mais</button>';
document.body.appendChild(bn);
bn.querySelector('[data-b=cad]').onclick=goCad;bn.querySelector('[data-b=orc]').onclick=goOrc;
bn.querySelector('[data-b=pix]').onclick=()=>run({id:'bPay75'});bn.querySelector('[data-b=more]').onclick=openDr;
/* atalhos do app instalado: /?go=orc | campo | laudo | recibo */
{const go=new URLSearchParams(location.search).get('go');if(go){let n=0;const t=setInterval(()=>{const vp=$('vP');if(vp&&!vp.classList.contains('hidden')){clearInterval(t);try{history.replaceState(null,'','/')}catch(e){}const f={orc:goOrc,campo:()=>run({r:/Campo/}),laudo:()=>window.docs&&window.docs.open('laudo'),recibo:()=>window.docs&&window.docs.open('recibo')}[go];if(f)f()}else if(++n>60)clearInterval(t)},300)}}
/* Novidades */
const mn=$('mNv');if(mn&&!$('nvnovo')){const old=mn.querySelector('div>div[style*="border:2px"]');
 if(old){old.querySelectorAll('span').forEach(x=>{if(x.textContent.trim()=='ATUAL')x.remove()});
 const card=(id,v,cur,t,sub,li)=>{const n=document.createElement('div');n.id=id;n.style.cssText='border:2px solid #f26b21;border-radius:14px;padding:14px;margin-top:12px;background:#fff';
  n.innerHTML='<div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px"><span style="background:#f26b21;color:#fff;font-weight:800;font-size:13px;padding:3px 10px;border-radius:8px">'+v+'</span>'+(cur?'<span style="background:#f26b21;color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:99px;margin-left:8px">ATUAL</span>':'')+'</div><div style="font-weight:800;font-size:16px;margin-top:8px">'+t+'</div><div style="font-size:12px;color:#64748b">'+sub+'</div><ul style="font-size:13px;margin:8px 0 0 0;padding-left:0;list-style:none">'+li.map(x=>'<li style="margin:5px 0">'+x+'</li>').join('')+'</ul>';old.before(n)};
 card('nvnovo','8.2 alfa',1,'📷 Laudos, recibos e app instalável','Fechamento da v8.2',['📷 <b>Relatório fotográfico e termo de conclusão</b>: fotos de <b>antes e depois</b> direto da câmera do celular, observações, assinatura do cliente na tela e PDF pronto. Ferramentas ▾ → Relatório fotográfico.','🧾 <b>Recibo de pagamento</b> em PDF ou imagem (com valor por extenso) para enviar no WhatsApp. Ao marcar um orçamento como <b>Pago</b>, o app oferece gerar o recibo na hora.','☁️ Laudos e recibos ficam salvos na sua conta e aparecem no PC e no celular. Sem internet, ficam no aparelho e sobem sozinhos depois.','🪪 <b>Cartão digital privado</b> (/p/seunome): bio, fotos de QDC e obras, serviços, Pix e WhatsApp, com imagem para compartilhar. Não existe lista nem busca de eletricistas.','💰 <b>Mão de obra</b> (hora técnica e preço por ponto), 🛒 <b>lista de compras</b> por categoria, 📖 <b>guia de bolso</b> (eletrodutos a 40%, cores de cabos) e 🔌 <b>esquemas de ligação</b> (three-way, four-way, sensor, fotocélula, DR, DPS, contatora): em Ferramentas ▾ → Campo.','📲 <b>App na tela inicial</b>: botão “Instalar app” no menu, atalhos (Orçamentos, Campo, Laudo, Recibo) e carregamento mais rápido, inclusive offline.']);
 card('nvnovo81','8.1 alfa',0,'🧭 Menu novo e orçamentos turbinados','Parte 1 da v8.1',['🖥️ <b>PC</b>: CAD e Orçamentos no centro, ferramentas em <b>Ferramentas ▾</b> e conta no menu da direita.','📱 <b>Celular</b>: menu ☰ lateral e barra inferior (CAD, Orçamentos, Pix e Mais).','✏️ <b>Folha editável</b> do orçamento, com totais e QR Pix automáticos.','📄 <b>PDF em 1 página</b> e download direto no PC e no celular.','🗂️ <b>Status</b>: Em Aberto, Enviado, Aprovado, Pago e Cancelado. ⧉ <b>Clonar</b> com 1 toque.','📅 <b>Validade da proposta</b> e <b>condições de pagamento</b>.'])}}
})();
