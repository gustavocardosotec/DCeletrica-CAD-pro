/* DC CAD Pro v8.0 — Campo: lista de compras, guia NBR 5410, esquemas de ligação e precificação de mão de obra */
(()=>{'use strict';
if(window.campo80)return;
const $=id=>document.getElementById(id),
E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'),
nf=(n,d=2)=>(+n||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}),
brl=n=>'R$ '+nf(n),
pn=v=>{v=String(v==null?'':v).trim();if(!v)return 0;if(v.includes(','))v=v.replace(/\./g,'').replace(',','.');const n=parseFloat(v);return isFinite(n)?n:0},
tst=m=>{let t=$('t81');if(!t){t=document.createElement('div');t.id='t81';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99999;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',2600)},
logged=()=>typeof ses!='undefined'&&ses&&ses.access_token&&ses.access_token!='local',
Z=()=>typeof S!='undefined'&&S&&$('vE')&&!$('vE').classList.contains('hidden'),
uidTok=()=>{try{return JSON.parse(atob(ses.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).sub}catch(e){return null}},
down=(blob,nm)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nm;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)},
slugN=s=>String(s||'projeto').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'projeto';

/* ---------- estilos ---------- */
{const st=document.createElement('style');st.textContent=`
.cp-sc{overflow-x:auto;border:1px solid #dbe3ec;border-radius:12px;margin-top:8px;-webkit-overflow-scrolling:touch}
.cp-t{width:100%;border-collapse:collapse;font-size:13px}.cp-t th,.cp-t td{padding:8px 9px;border-bottom:1px solid #e6edf4;text-align:center;white-space:nowrap}
.cp-t th{background:#eef3f8;font-size:12px}.cp-t td:first-child,.cp-t th:first-child{text-align:left;font-weight:700;position:sticky;left:0;background:#fff;box-shadow:1px 0 0 #e6edf4}.cp-t th:first-child{background:#eef3f8}
.cp-t td.l{text-align:left;white-space:normal;min-width:150px;font-size:12px;color:#475569}.cp-t td.hi{background:#fff4ec;font-weight:800;color:#d95a14}
.cp-cat{margin-top:14px}.cp-ch{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;padding:6px 2px}.cp-ch small{margin-left:auto;color:#64748b;font-weight:600}
.cp-it{display:flex;align-items:center;gap:12px;min-height:54px;padding:8px 12px;margin-top:6px;border:1px solid #dbe3ec;border-radius:12px;background:#fff;cursor:pointer;-webkit-user-select:none;user-select:none}
.cp-it input{width:24px;height:24px;accent-color:#f26b21;flex:none;pointer-events:none}.cp-it.ok{background:#f0fdf4;opacity:.75}.cp-it.ok .n{text-decoration:line-through}
.cp-it .n{flex:1;min-width:0;font-size:14px;word-break:break-word}.cp-it .q{flex:none;font-weight:800;background:#eef3f8;border-radius:99px;padding:4px 11px;font-size:13px;white-space:nowrap}
.cp-it .x{flex:none;width:36px;height:36px;border-radius:10px;color:#b42318;font-weight:800;background:#fdecea}
.cp-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:8px}.cp-g label{font-size:12px;font-weight:600;color:#64748b;display:block}.cp-g .in{margin-top:3px}
.cp-h{font-size:14px;font-weight:800;margin-top:16px}
.cp-kp{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.cp-k{border:1px solid #dbe3ec;border-radius:14px;padding:12px 8px;text-align:center;background:#fff}.cp-k b{display:block;font-size:19px;color:#0f2a43}.cp-k span{font-size:11px;color:#64748b}.cp-k.or{background:#fff4ec;border-color:#f26b21}.cp-k.or b{color:#d95a14}
.cp-dg{border:1px solid #dbe3ec;border-radius:16px;padding:12px;margin-top:12px;background:#fff}.cp-dg svg{width:100%;height:auto;display:block;background:#f8fafc;border-radius:10px}.cp-dg h4{font-weight:800;font-size:16px;margin-bottom:8px}.cp-dg p{font-size:13px;color:#475569;margin-top:8px;line-height:1.5}
.cp-lg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:#475569;margin-top:10px}.cp-lg i{display:inline-block;width:20px;height:4px;border-radius:2px;vertical-align:middle;margin-right:5px}
.cp-cor{display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #dbe3ec;border-radius:12px;margin-top:8px;background:#fff}.cp-cor i{flex:none;width:46px;height:46px;border-radius:10px;border:1px solid #0003}.cp-cor b{display:block;font-size:14px}.cp-cor span{font-size:12px;color:#64748b;line-height:1.4}
.cp-bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.cp-bar .btn{flex:1 1 120px}
.cp-nt{font-size:12px;color:#64748b;margin-top:8px;line-height:1.5}.cp-ok{display:inline-block;background:#dcfce7;color:#15803d;font-weight:800;padding:3px 10px;border-radius:99px;font-size:12px}
.cp-sy{font-size:12px;color:#64748b;margin-top:6px}`;document.head.appendChild(st)}

/* ---------- janela ---------- */
function win(title,tabs,cur,render,w){
 document.querySelectorAll('.mCp81').forEach(x=>x.remove());
 const m=document.createElement('div');m.className='modal full mCp81';m.style.zIndex=9200;
 m.innerHTML=`<div style="max-width:${w||720}px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">${title}</h3><button class="btn ghost ml-auto" data-x aria-label="Fechar">✕</button></div>${tabs?`<div class="tb72">${tabs.map(([k,n])=>`<button data-tab="${k}">${n}</button>`).join('')}</div>`:''}<div data-b></div></div>`;
 const box=m.querySelector('[data-b]'),set=t=>{cur=t;m.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab==t));box.innerHTML='';box.onclick=null;box.oninput=null;box.onchange=null;render(t,box,m)};
 m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-x]')){m.remove();return}const b=e.target.closest('[data-tab]');if(b&&m.contains(b)&&b.parentElement.classList.contains('tb72')&&!b.closest('[data-b]'))set(b.dataset.tab)});
 document.body.appendChild(m);set(cur);return m}

/* =====================================================================
   1) LISTA DE COMPRAS por categoria
   ===================================================================== */
const CATS=[['cabos','🔌','Cabos',/^cabo/i],['disj','🛡️','Disjuntores e proteção',/disjuntor|\bdr\b|\bdps\b/i],['caixas','📦','Caixas e quadros',/caixa|quadro|qdc|passagem/i],['tom','🔘','Tomadas',/tomada|tue/i],['infra','🧵','Infraestrutura',/eletroduto|conduite|conduíte|curva|luva|abra[cç]adeira/i],['out','💡','Interruptores, luminárias e outros',/.*/]];
const catOf=n=>CATS.find(c=>c[3].test(n))||CATS[CATS.length-1];
const qv=x=>parseFloat(String(x).replace(',','.'))||0;
function getList(){
 const cm=S.cmp=S.cmp||{};cm.chk=cm.chk||{};cm.ex=cm.ex||[];const mg=+cm.mg||0;let rows=[];
 try{rows=window.v7x.orcCalc().rows.map(r=>({n:r.n,u:r.u,q:qv(r.q)}))}catch(e){}
 rows.forEach(r=>{if(r.u=='m')r.q=Math.ceil(r.q*(1+mg/100));r.k='a:'+r.n});
 cm.ex.forEach(x=>rows.push({n:x.n,u:x.u||'un',q:+x.q||1,k:'x:'+x.id,ex:x.id,c:x.c}));
 rows.forEach(r=>{const c=r.c?CATS.find(k=>k[0]==r.c)||CATS[CATS.length-1]:catOf(r.n);r.cat=c;r.ok=!!cm.chk[r.k]});
 const out=CATS.map(c=>({c,items:rows.filter(r=>r.cat===c)})).filter(g=>g.items.length);
 return{out,all:rows,cm}}
const qs=r=>r.u=='m'?String(r.q)+' m':String(r.q).replace('.',',')+' '+(r.u||'un');
function listText(L,nm){const t=['🛒 *Lista de compras — '+nm+'*'];L.out.forEach(g=>{t.push('','*'+g.c[1]+' '+g.c[2]+'*');g.items.forEach(r=>t.push((r.ok?'✅':'☐')+' '+qs(r)+' — '+r.n))});t.push('','_DC CAD Pro_');return t.join('\n')}
function listCsv(L){const q=s=>'"'+String(s).replace(/"/g,'""')+'"',a=[['Categoria','Item','Quantidade','Unidade','Comprado'].map(q).join(';')];L.out.forEach(g=>g.items.forEach(r=>a.push([g.c[2],r.n,String(r.q).replace('.',','),r.u||'un',r.ok?'sim':'não'].map(q).join(';'))));return'\ufeff'+a.join('\r\n')}
function listPdf(L,nm){
 if(!window.jspdf){tst('O gerador de PDF não carregou. Verifique a internet.');return}
 const d=new jspdf.jsPDF({unit:'mm',format:'a4'});let y=0;
 d.setFillColor(15,42,67);d.rect(0,0,210,28,'F');d.setTextColor(255);d.setFont(undefined,'bold');d.setFontSize(17);d.text('Lista de compras de materiais',15,13);d.setFont(undefined,'normal');d.setFontSize(10);d.text(String(nm).slice(0,70)+'  •  '+new Date().toLocaleDateString('pt-BR'),15,21);
 d.setTextColor(20);y=40;
 L.out.forEach(g=>{if(y>262){d.addPage();y=20}d.setFont(undefined,'bold');d.setFontSize(12);d.setFillColor(238,243,248);d.rect(15,y-5,180,8,'F');d.text(g.c[2],17,y);y+=9;d.setFont(undefined,'normal');d.setFontSize(10);
  g.items.forEach(r=>{if(y>280){d.addPage();y=20}d.setDrawColor(90);d.rect(16,y-3.4,3.8,3.8);if(r.ok){d.line(16.5,y-1.5,17.8,y);d.line(17.8,y,19.4,y-3)}d.text(String(r.n).slice(0,78),23,y);d.text(qs(r),194,y,{align:'right'});d.setDrawColor(225);d.line(15,y+2,195,y+2);y+=7});y+=4});
 d.setFontSize(8);d.setTextColor(120);d.text('Quantidades estimadas a partir do desenho. Confira em obra antes de comprar.',15,Math.min(y+4,290));
 d.save('lista-compras-'+slugN(nm)+'.pdf')}
function compras(box){
 if(!Z()){box.innerHTML=`<div class="pf-vz"><div style="font-size:42px">🛒</div><b>Abra um projeto para gerar a lista</b><p class="text-sm" style="color:#64748b;margin:6px 0 0">A lista é montada automaticamente a partir dos pontos, circuitos e eletrodutos do desenho. Abra um projeto e toque em <b>🧰 Campo</b> (ou <b>🛒 Lista de compras</b> no menu ⋯).</p></div>`;return}
 const nm=($('nm')&&$('nm').value)||'Projeto';
 const paint=()=>{const L=getList(),tot=L.all.length,ok=L.all.filter(r=>r.ok).length,cm=L.cm;
  box.innerHTML=`<p class="text-xs" style="color:#64748b;margin-top:4px"><b>${E(nm)}</b> — ${tot?ok+' de '+tot+' itens comprados':'nenhum item no desenho ainda'}. Toque no item para marcar como comprado. Metragens aproximadas.</p>
  <div class="cp-g"><label>Margem de perda nos metros<select class="in" data-mg>${[0,5,10,15,20].map(v=>`<option value="${v}"${(+cm.mg||0)==v?' selected':''}>${v?v+'% a mais':'sem margem'}</option>`).join('')}</select></label></div>
  ${L.out.map(g=>`<div class="cp-cat"><div class="cp-ch"><span>${g.c[1]}</span>${E(g.c[2])}<small>${g.items.filter(r=>r.ok).length}/${g.items.length}</small></div>${g.items.map(r=>`<div class="cp-it${r.ok?' ok':''}" data-k="${E(r.k)}" role="checkbox" aria-checked="${r.ok}" tabindex="0"><input type="checkbox" ${r.ok?'checked':''} tabindex="-1"><span class="n">${E(r.n)}</span><span class="q">${E(qs(r))}</span>${r.ex?`<button class="x" data-rx="${E(r.ex)}" aria-label="Remover">✕</button>`:''}</div>`).join('')}</div>`).join('')}
  <div class="cp-h">➕ Adicionar item extra</div>
  <div class="cp-g"><label>Item<input class="in" data-xn maxlength="80" placeholder="Ex.: Fita isolante"></label><label>Qtd.<input class="in" data-xq inputmode="decimal" value="1"></label><label>Unid.<select class="in" data-xu><option>un</option><option>m</option><option>cx</option><option>pç</option><option>rolo</option></select></label><label>Categoria<select class="in" data-xc>${CATS.map(c=>`<option value="${c[0]}">${c[2]}</option>`).join('')}</select></label></div>
  <button class="btn ghost w-full mt-2" data-add>＋ Adicionar à lista</button>
  <div class="cp-bar"><button class="btn or" data-zap>📲 WhatsApp</button><button class="btn ghost" data-cp>📋 Copiar</button><button class="btn ghost" data-pdf>📄 PDF</button><button class="btn ghost" data-csv>📊 Planilha (CSV)</button></div>
  <p class="cp-sy">☁️ Os itens marcados e extras ficam salvos no projeto e aparecem em todos os seus aparelhos.</p>`};
 const save=()=>{try{auto()}catch(e){}};
 paint();
 box.onclick=async e=>{const t=e.target;
  const rx=t.closest('[data-rx]');if(rx){const cm=S.cmp;cm.ex=cm.ex.filter(x=>x.id!=rx.dataset.rx);delete cm.chk['x:'+rx.dataset.rx];save();paint();return}
  const it=t.closest('[data-k]');if(it){const cm=S.cmp,k=it.dataset.k;if(cm.chk[k])delete cm.chk[k];else cm.chk[k]=1;save();const y=box.parentElement.scrollTop||0;paint();return}
  if(t.closest('[data-add]')){const n=box.querySelector('[data-xn]').value.trim();if(!n)return tst('Digite o nome do item');const cm=S.cmp;cm.ex.push({id:Math.random().toString(36).slice(2,8),n:n.slice(0,80),q:pn(box.querySelector('[data-xq]').value)||1,u:box.querySelector('[data-xu]').value,c:box.querySelector('[data-xc]').value});save();paint();return}
  const L=getList();
  if(t.closest('[data-zap]'))window.open('https://wa.me/?text='+encodeURIComponent(listText(L,nm)),'_blank');
  else if(t.closest('[data-cp]')){const tx=listText(L,nm);try{await navigator.clipboard.writeText(tx);tst('Lista copiada')}catch(x){tst('Não consegui copiar')}}
  else if(t.closest('[data-pdf]'))listPdf(L,nm);
  else if(t.closest('[data-csv]'))down(new Blob([listCsv(L)],{type:'text/csv;charset=utf-8'}),'lista-compras-'+slugN(nm)+'.csv')};
 box.onkeydown=e=>{if((e.key=='Enter'||e.key==' ')&&e.target.matches&&e.target.matches('[data-k]')){e.preventDefault();e.target.click()}};
 box.onchange=e=>{if(e.target.matches('[data-mg]')){S.cmp.mg=+e.target.value||0;save();paint()}}}

/* =====================================================================
   2) GUIA DE BOLSO NBR 5410
   ===================================================================== */
const SEC=[1.5,2.5,4,6,10,16,25,35,50,70,95,120],
IZ2=[17.5,24,32,41,57,76,101,125,151,192,232,269],
IZ3=[15.5,21,28,36,50,68,89,111,134,171,207,239],
BRK=[10,16,20,25,32,40,50,63,70,80,100,125,160,200,250],
USO={1.5:'Iluminação',2.5:'Tomadas (TUG) e TUE pequena',4:'Chuveiro/torneira até ~6 kW em 220 V',6:'Chuveiro até ~8 kW em 220 V, ar-condicionado',10:'TUE grande, alimentação de quadro',16:'Alimentador de quadro',25:'Alimentador / entrada',35:'Entrada de energia'},
CD={1.5:3,2.5:3.7,4:4.3,6:4.9,10:6.2,16:7.4,25:9.2,35:10.6,50:12.5,70:14.5},
CT=[[16,12.4],[20,16.4],[25,21],[32,27.4],[40,34.8],[50,44],[60,55]],
mxB=iz=>[...BRK].reverse().find(b=>b<=iz)||'—';
const ar=d=>Math.PI/4*d*d;
function guiaBit(b){
 b.innerHTML=`<p class="cp-nt">Cobre, isolação PVC 70 °C, método B1 (eletroduto embutido em alvenaria), 30 °C. A coluna <b>Disjuntor máx.</b> é o maior disjuntor comercial que não passa da capacidade do cabo (2 condutores carregados). O dimensionamento final depende da carga, do agrupamento e da queda de tensão.</p>
 <div class="cp-sc"><table class="cp-t"><tr><th>Cabo mm²</th><th>Iz 2 cond. (A)</th><th>Iz 3 cond. (A)</th><th>Disjuntor máx.</th><th>Uso típico</th></tr>${SEC.map((s,i)=>`<tr><td>${String(s).replace('.',',')}</td><td>${nf(IZ2[i],1)}</td><td>${nf(IZ3[i],1)}</td><td class="hi">${mxB(IZ2[i])} A</td><td class="l">${E(USO[s]||'')}</td></tr>`).join('')}</table></div>
 <p class="cp-nt">Mínimos da NBR 5410: 1,5 mm² em iluminação e 2,5 mm² em força (cobre). Queda de tensão máxima: 4% até o ponto mais distante (instalação alimentada pela rede). DR de 30 mA obrigatório em áreas molhadas, tomadas externas e circuitos de TUG/TUE em geral.</p>`}
function guiaDuto(b){
 const need=(s,n)=>{const a=n*ar(CD[s]);const d=CT.find(c=>a<=.4*ar(c[1]));return{d,pct:d?Math.round(a/ar(d[1])*100):null}};
 b.innerHTML=`<p class="cp-nt">Taxa de ocupação máxima de <b>40%</b> da área interna do eletroduto (3 ou mais cabos). Mesmos diâmetros dos Utilitários do app.</p>
 <div class="cp-g"><label>Seção do cabo<select class="in" data-s>${Object.keys(CD).map(s=>`<option value="${s}"${s=='2.5'?' selected':''}>${String(s).replace('.',',')} mm²</option>`).join('')}</select></label><label>Qtd. de cabos<input class="in" data-n type="number" min="1" max="40" value="6" inputmode="numeric"></label></div>
 <div data-r class="cp-kp"></div>
 <div class="cp-h">Máx. de cabos por eletroduto (40%)</div>
 <div class="cp-sc"><table class="cp-t"><tr><th>Cabo mm²</th>${CT.map(c=>`<th>Ø${c[0]}</th>`).join('')}</tr>${Object.keys(CD).map(s=>`<tr><td>${String(s).replace('.',',')}</td>${CT.map(c=>`<td>${Math.floor(.4*ar(c[1])/ar(CD[s]))}</td>`).join('')}</tr>`).join('')}</table></div>
 <p class="cp-nt">Ø = diâmetro nominal do eletroduto (mm). Valores aproximados (diâmetro externo do cabo com isolação). 1 cabo ocupa até 53% e 2 cabos até 31% pela norma; a tabela usa 40% como regra de bolso.</p>`;
 const go=()=>{const s=b.querySelector('[data-s]').value,n=Math.max(1,+b.querySelector('[data-n]').value||1),r=need(s,n),o=b.querySelector('[data-r]');
  o.innerHTML=r.d?`<div class="cp-k or"><b>Ø ${r.d[0]} mm</b><span>eletroduto mínimo</span></div><div class="cp-k"><b>${r.pct}%</b><span>ocupação (máx. 40%)</span></div>`:`<div class="cp-k or" style="grid-column:1/-1"><b>Acima de Ø 60 mm</b><span>divida os cabos em mais de um eletroduto</span></div>`};
 b.oninput=go;b.onchange=go;go()}
function guiaCor(b){
 const C=[['#2563eb','Neutro (N)','Azul-claro. Cor exclusiva do neutro.'],['#16a34a','Proteção / terra (PE)','Verde-amarelo (ou verde). Exclusiva do terra.'],['#111827','Fase (F)','Preto, vermelho, branco ou cinza (qualquer cor, menos azul-claro, verde e verde-amarelo). Em trifásico, use cores diferentes em cada fase.'],['#dc2626','Fase (F) — exemplo','Vermelho. Diferencie as fases R, S e T (ex.: preto, vermelho e cinza).'],['#f3f4f6','Fase (F) — exemplo','Branco ou cinza são aceitos como fase.'],['#eab308','Retorno (interruptor → lâmpada)','Amarelo, laranja ou outra cor de convenção. Não é cor fixa da norma, mas não pode ser azul-claro, verde ou verde-amarelo.'],['linear-gradient(90deg,#2563eb 70%,#84cc16 70%)','PEN (neutro + terra)','Azul-claro com marcação verde-amarela nas pontas (circuito TN-C).']];
 b.innerHTML=`<p class="cp-nt">Cores dos condutores conforme a NBR 5410 (item 6.1.5.3). Nunca use azul-claro, verde ou verde-amarelo como fase.</p>${C.map(c=>`<div class="cp-cor"><i style="background:${c[0]}"></i><div><b>${E(c[1])}</b><span>${E(c[2])}</span></div></div>`).join('')}`}
function guia(box){
 const sub=[['bit','🔌 Bitola × disjuntor'],['duto','🧵 Eletroduto 40%'],['cor','🎨 Cores dos cabos']];let cur='bit';
 box.innerHTML=`<div class="tb72" data-sub>${sub.map(([k,n])=>`<button data-st="${k}">${n}</button>`).join('')}</div><div data-g></div>`;
 const g=box.querySelector('[data-g]'),set=k=>{cur=k;box.querySelectorAll('[data-st]').forEach(x=>x.classList.toggle('on',x.dataset.st==k));g.oninput=null;g.onchange=null;({bit:guiaBit,duto:guiaDuto,cor:guiaCor})[k](g)};
 box.querySelector('[data-sub]').onclick=e=>{const b=e.target.closest('[data-st]');if(b)set(b.dataset.st)};
 box.oninput=e=>{if(g.oninput)g.oninput(e)};box.onchange=e=>{if(g.onchange)g.onchange(e)};set(cur)}

/* =====================================================================
   3) ESQUEMAS DE LIGAÇÃO (SVG)
   ===================================================================== */
const K={F:'#dc2626',N:'#2563eb',R:'#d97706',G:'#16a34a',V:'#7c3aed',X:'#334155'};
const w=(pts,c,d)=>`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"${d?' stroke-dasharray="5 4"':''}/>`,
tx=(x,y,s,o)=>{o=o||{};return`<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-size="${o.z||11}" font-weight="${o.b?700:500}" fill="${o.c||'#334155'}" font-family="Inter,system-ui,sans-serif">${E(s)}</text>`},
bx=(x,y,wd,h,s,o)=>{o=o||{};return`<rect x="${x}" y="${y}" width="${wd}" height="${h}" rx="7" fill="${o.f||'#fff'}" stroke="#334155" stroke-width="2"/>`+(s?tx(x+wd/2,y+h/2+4,s,{b:1,z:o.z||11}):'')},
dt=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="3.8" fill="${c||'#334155'}"/>`,
src=(x,y,s,c)=>`<circle cx="${x}" cy="${y}" r="9" fill="${c}"/>`+tx(x,y+4,s,{b:1,z:11,c:'#fff'}),
tm=(x,y)=>`<circle cx="${x}" cy="${y}" r="3" fill="#fff" stroke="#334155" stroke-width="1.6"/>`,
lamp=(x,y)=>`<circle cx="${x}" cy="${y}" r="14" fill="#fef9c3" stroke="#334155" stroke-width="2"/><path d="M${x-10} ${y-10}L${x+10} ${y+10}M${x+10} ${y-10}L${x-10} ${y+10}" stroke="#334155" stroke-width="2"/>`,
svg=(b,h)=>`<svg viewBox="0 0 380 ${h||230}" xmlns="http://www.w3.org/2000/svg" role="img">${b}</svg>`;
const DG=[
{t:'Three-way (interruptor paralelo)',d:'Comanda 1 lâmpada de 2 pontos. A fase entra no comum (C) do primeiro paralelo; o retorno sai do comum do segundo. Os 2 fios entre os interruptores são os viajantes. O neutro vai direto à lâmpada.',
 s:()=>svg(w([[28,190],[90,190],[90,134]],K.F)+w([[28,214],[352,214],[352,175],[330,175]],K.N)+w([[75,90],[75,62],[285,62],[285,90]],K.V)+w([[105,90],[105,72],[255,72],[255,90]],K.V)+w([[270,134],[270,175],[302,175]],K.R)+bx(60,90,60,44,'S1')+bx(240,90,60,44,'S2')+lamp(316,175)+src(28,190,'F',K.F)+src(28,214,'N',K.N)+tx(75,84,'1')+tx(105,84,'2')+tx(285,84,'1')+tx(255,84,'2')+tx(90,150,'C')+tx(270,150,'C')+tx(316,150,'Lâmpada',{z:10}))},
{t:'Four-way (intermediário)',d:'Para 3 ou mais pontos: paralelo – intermediário – paralelo. Os 2 viajantes entram de um lado do intermediário e saem do outro (dentro dele os fios se cruzam ao acionar). Para mais pontos, repita o intermediário.',
 s:()=>svg(w([[22,116],[44,116]],K.F)+w([[348,116],[348,176],[314,176]],K.R)+w([[286,176],[270,176],[270,214],[22,214]],K.N)+w([[100,100],[130,100],[130,86],[160,86]],K.V)+w([[100,132],[160,132]],K.V)+w([[236,86],[264,86],[264,100],[292,100]],K.V)+w([[236,132],[292,132]],K.V)+bx(44,88,56,56,'S1')+bx(160,70,76,76,'')+`<path d="M170 92L226 124M170 124L226 92" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>`+tx(198,64,'S2 (four-way)',{b:1})+bx(292,88,56,56,'S3')+lamp(300,176)+src(22,116,'F',K.F)+src(22,214,'N',K.N)+tx(76,82,'three-way',{z:9})+tx(320,82,'three-way',{z:9})+tx(300,200,'Lâmpada',{z:10}),230)},
{t:'Dimmer',d:'Ligado em série com a lâmpada: a fase entra no dimmer e a saída segue para a lâmpada. Use lâmpada dimerizável e respeite a potência mínima e máxima do modelo. O neutro não passa pelo dimmer (confira o manual do fabricante).',
 s:()=>svg(w([[22,100],[120,100]],K.F)+w([[220,100],[262,100]],K.R)+w([[290,100],[336,100],[336,180],[22,180]],K.N)+bx(120,70,100,60,'')+`<circle cx="170" cy="92" r="13" fill="#eef3f8" stroke="#334155" stroke-width="2"/><path d="M170 92L177 84" stroke="#334155" stroke-width="2.4"/>`+tx(170,122,'Dimmer',{b:1})+lamp(276,100)+src(22,100,'F',K.F)+src(22,180,'N',K.N)+tx(72,92,'entrada',{z:10})+tx(241,92,'saída',{z:10})+tx(276,128,'Lâmpada dimerizável',{z:10}),210)},
{t:'Sensor de presença (3 fios)',d:'Fase e neutro alimentam o sensor; a saída (retorno) vai à lâmpada. Alguns modelos têm só 2 fios (ligados em série, no lugar do interruptor) ou aceitam interruptor em paralelo (bypass). Siga o manual do modelo.',
 s:()=>svg(w([[22,78],[120,78]],K.F)+w([[22,196],[340,196]],K.N)+w([[60,196],[60,130],[120,130]],K.N)+dt(60,196,K.N)+w([[230,78],[262,78]],K.R)+w([[290,78],[340,78],[340,196]],K.N)+bx(120,56,110,96,'')+tx(175,100,'Sensor de',{b:1})+tx(175,114,'presença',{b:1})+tx(128,82,'F',{a:'start',b:1})+tx(128,134,'N',{a:'start',b:1})+tx(222,82,'R',{a:'end',b:1})+lamp(276,78)+src(22,78,'F',K.F)+src(22,196,'N',K.N),220)},
{t:'Fotocélula (relé fotoelétrico)',d:'Acende a carga ao anoitecer e apaga ao amanhecer. Fase (entrada), neutro e saída para a carga. Confira a corrente máxima do contato: para cargas grandes, use a fotocélula comandando uma contatora.',
 s:()=>svg(w([[22,78],[120,78]],K.F)+w([[22,196],[340,196]],K.N)+w([[60,196],[60,130],[120,130]],K.N)+dt(60,196,K.N)+w([[230,78],[262,78]],K.R)+w([[290,78],[340,78],[340,196]],K.N)+bx(120,56,110,96,'')+`<circle cx="175" cy="86" r="8" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/><path d="M175 70v-5M175 102v5M159 86h-5M191 86h5M164 75l-4-4M186 97l4 4M186 75l4-4M164 97l-4 4" stroke="#d97706" stroke-width="1.8" stroke-linecap="round"/>`+tx(175,122,'Fotocélula',{b:1})+tx(175,136,'relé fotoelétrico',{z:9})+tx(128,82,'F',{a:'start',b:1})+tx(128,134,'N',{a:'start',b:1})+tx(222,82,'C',{a:'end',b:1})+lamp(276,78)+src(22,78,'F',K.F)+src(22,196,'N',K.N),220)},
{t:'DR (diferencial residual)',d:'Fase e neutro passam pelo DR; o terra (PE) não passa. O neutro depois do DR não pode ser ligado a outro DR nem ao neutro geral. DR de 30 mA protege pessoas; teste todo mês no botão T.',
 s:()=>svg(w([[22,70],[70,70]],K.F)+w([[154,70],[196,70]],K.F)+w([[240,70],[300,70]],K.F)+w([[22,130],[70,130]],K.N)+w([[154,130],[300,130]],K.N)+w([[22,196],[328,196],[328,154]],K.G)+bx(70,46,84,108,'')+tx(112,90,'DR',{b:1,z:15})+tx(112,106,'30 mA',{z:11})+`<circle cx="112" cy="132" r="9" fill="#fef3c7" stroke="#334155" stroke-width="1.6"/>`+tx(112,136,'T',{b:1,z:10})+bx(196,54,44,32,'DJ')+bx(300,46,56,108,'Carga')+src(22,70,'F',K.F)+src(22,130,'N',K.N)+src(22,196,'PE',K.G),220)},
{t:'DPS (protetor de surtos)',d:'Ligado entre fase/neutro e o barramento de terra (PE), com cabo curto e reto (a seção segue o fabricante, em geral 4 mm² ou mais). Fica protegido por disjuntor, conforme o fabricante. No quadro residencial usa-se DPS classe II.',
 s:()=>svg(w([[22,50],[358,50]],K.F)+w([[22,84],[358,84]],K.N)+w([[22,196],[358,196]],K.G)+bx(56,38,38,24,'DJ',{z:10})+`<path d="M172 50V78a6 6 0 0 1 0 12V120" fill="none" stroke="${K.F}" stroke-width="2.6" stroke-linecap="round"/>`+w([[228,84],[228,120]],K.N)+w([[200,164],[200,196]],K.G)+dt(172,50,K.F)+dt(228,84,K.N)+dt(200,196,K.G)+bx(150,120,100,44,'DPS',{z:14})+tx(26,44,'Fase',{a:'start',z:10,b:1})+tx(26,78,'Neutro',{a:'start',z:10,b:1})+tx(26,190,'Terra (PE)',{a:'start',z:10,b:1})+tx(75,76,'DJ do DPS',{z:9}),220)},
{t:'Contatora (partida com selo)',d:'Comando: botão Desliga (NF) em série com Liga (NA); o contato auxiliar 13–14 em paralelo com o Liga faz o selo. A bobina (A1–A2) fecha o contato de potência (1–2) que alimenta a carga. A tensão da bobina deve ser a do comando.',
 s:()=>svg(w([[14,40],[120,40]],K.F)+w([[176,40],[300,40]],K.F)+w([[328,60],[328,215],[14,215]],K.N)+w([[40,40],[40,110],[58,110]],K.F)+w([[112,110],[142,110]],K.F)+w([[196,110],[250,110]],K.F)+w([[127,110],[127,150],[142,150]],K.F)+w([[196,150],[214,150],[214,110]],K.F)+w([[250,142],[230,142],[230,215]],K.N)+w([[280,96],[280,76],[148,76],[148,54]],'#94a3b8',1)+dt(40,40,K.F)+dt(127,110,K.F)+dt(214,110,K.F)+dt(230,215,K.N)+bx(120,26,56,28,'1 — 2',{z:11})+bx(300,24,56,36,'Carga')+bx(58,98,54,24,'Desl. NF',{z:9})+bx(142,98,54,24,'Liga NA',{z:9})+bx(142,138,54,24,'13 — 14',{z:9})+bx(250,96,60,60,'')+tx(280,130,'Bobina',{b:1})+tx(256,114,'A1',{a:'start',z:10})+tx(256,148,'A2',{a:'start',z:10})+tx(214,70,'aciona',{z:9,c:'#64748b'})+src(14,40,'F',K.F)+src(14,215,'N',K.N),232)}];
function esq(box){
 box.innerHTML=`<p class="cp-nt">Diagramas funcionais simplificados (não mostram o terra de cada ponto). Toque em um diagrama para ampliar.</p><div class="cp-lg"><span><i style="background:${K.F}"></i>Fase</span><span><i style="background:${K.N}"></i>Neutro</span><span><i style="background:${K.R}"></i>Retorno</span><span><i style="background:${K.V}"></i>Viajantes</span><span><i style="background:${K.G}"></i>Terra</span></div>`+DG.map((g,i)=>`<div class="cp-dg" data-i="${i}"><h4>${E(g.t)}</h4>${g.s()}<p>${E(g.d)}</p></div>`).join('');
 box.onclick=e=>{const c=e.target.closest('[data-i]');if(!c)return;const g=DG[+c.dataset.i],z=document.createElement('div');z.className='modal';z.style.zIndex=9400;z.innerHTML=`<div style="max-width:760px"><div class="flex items-center gap-2"><h3 class="text-lg font-extrabold">${E(g.t)}</h3><button class="btn ghost ml-auto" data-x>✕</button></div><div class="cp-dg" style="border:0;padding:0">${g.s()}<p>${E(g.d)}</p></div></div>`;z.onclick=ev=>{if(ev.target===z||ev.target.closest('[data-x]'))z.remove()};document.body.appendChild(z)}}

/* =====================================================================
   4) PRECIFICAÇÃO DE MÃO DE OBRA (salva na conta)
   ===================================================================== */
const PK='dce_preco81',DEF=()=>({meta:6000,f:[0,0,0,0,0,0],imp:6,lucro:10,dias:22,horas:8,prod:65,hpt:1.5,t:0}),
FX=[['Veículo e combustível'],['Celular e internet'],['Contador / taxas (MEI, DAS)'],['Ferramentas, EPI e reposição'],['Seguro e outros fixos'],['Reserva (férias/13º)']],
TIPOS=[['Tomada ou interruptor',1],['Ponto de luz',1.2],['Ponto de TV, rede ou campainha',1],['Ponto TUE (chuveiro, ar, forno)',2],['Circuito novo no quadro',2.5],['Montagem de quadro (por circuito)',1.5]];
let P=(()=>{try{const x=JSON.parse(localStorage.getItem(PK));if(x&&typeof x=='object'&&Array.isArray(x.f))return Object.assign(DEF(),x)}catch(e){}return DEF()})(),pt=null,pushing=0;
const keepP=()=>{try{localStorage.setItem(PK,JSON.stringify(P))}catch(e){}};
async function arq(p,o){const go=()=>fetch(CFG.url+p,{...o,headers:{apikey:CFG.key,Authorization:'Bearer '+ses.access_token,'Content-Type':'application/json'}});let r=await go();
 if(r.status==401&&ses.refresh_token){try{const d=await api('/auth/v1/token?grant_type=refresh_token',{refresh_token:ses.refresh_token});if(d&&d.access_token){ses=d;localStorage.setItem('dce_ses',JSON.stringify(d));r=await go()}}catch(e){}}return r}
async function pushP(){if(!logged()||!navigator.onLine)return false;try{const r=await arq('/auth/v1/user',{method:'PUT',body:JSON.stringify({data:{preco81:P}})});return r.ok}catch(e){return false}}
async function pullP(){if(!logged()||!navigator.onLine)return false;try{const id=uidTok();if(P.uid&&id&&P.uid!==id){P=DEF();keepP()}
 const r=await arq('/auth/v1/user',{method:'GET'});if(!r.ok)return false;const j=await r.json(),m=j&&j.user_metadata&&j.user_metadata.preco81;
 if(m&&Array.isArray(m.f)&&(m.t||0)>(P.t||0)){P=Object.assign(DEF(),m,{uid:id});keepP();return true}
 if((P.t||0)>((m&&m.t)||0)){P.uid=id;keepP();pushP()}}catch(e){}return false}
const savedP=()=>{P.t=Date.now();try{const id=uidTok();if(id&&logged())P.uid=id}catch(e){}keepP();clearTimeout(pt);pt=setTimeout(async()=>{if(!logged())return;const ok=await pushP();const s=document.querySelector('.mCp81 [data-sy]');if(s)s.textContent=ok?'☁️ Salvo na sua conta':'💾 Salvo neste aparelho (sobe para a conta quando houver internet)'},800)};
addEventListener('online',()=>{if(logged()&&P.t)pushP()});
const calcP=()=>{const fx=P.f.reduce((a,b)=>a+(+b||0),0),den=Math.max(.05,1-((+P.imp||0)+(+P.lucro||0))/100),rec=((+P.meta||0)+fx)/den,hf=Math.max(1,(+P.dias||1)*(+P.horas||1)*((+P.prod||1)/100)),hora=rec/hf,hpt=+P.hpt||0;return{fx,rec,hf,hora,dia:rec/Math.max(1,+P.dias||1),pt:hora*hpt,npt:hpt>0?hf/hpt:0}};
function preco(box){
 const nI=(k,l,v,s)=>`<label>${l}<input class="in" data-k="${k}" inputmode="decimal" value="${E(String(v).replace('.',','))}"${s?' '+s:''}></label>`;
 box.innerHTML=`<p class="cp-nt">Informe quanto quer ganhar por mês e seus custos fixos. O app calcula o valor da <b>hora técnica</b>, da <b>diária</b> e do <b>ponto elétrico</b> (só mão de obra, sem material).</p>
 <div class="cp-h">🎯 Meta e tempo de trabalho</div>
 <div class="cp-g">${nI('meta','Quero ganhar líquido por mês (R$)',P.meta)}${nI('dias','Dias trabalhados por mês',P.dias)}${nI('horas','Horas por dia',P.horas)}${nI('prod','% do tempo faturável',P.prod)}</div>
 <p class="cp-nt">% faturável: tempo realmente trabalhando em obra, descontando deslocamento, orçamentos e compras (comum: 60% a 75%).</p>
 <div class="cp-h">🧾 Custos fixos por mês (R$)</div>
 <div class="cp-g">${FX.map((f,i)=>`<label>${f[0]}<input class="in" data-f="${i}" inputmode="decimal" value="${P.f[i]?E(String(P.f[i]).replace('.',',')):''}" placeholder="0"></label>`).join('')}</div>
 <div class="cp-h">📊 Impostos, reserva e produtividade</div>
 <div class="cp-g">${nI('imp','Impostos / taxas (%)',P.imp)}${nI('lucro','Reserva e lucro (%)',P.lucro)}${nI('hpt','Horas para instalar 1 ponto',P.hpt)}</div>
 <div data-r></div><div data-t></div>
 <div class="cp-bar"><button class="btn or" data-cp>📋 Copiar resumo</button></div><p class="cp-sy" data-sy>${logged()?'☁️ Seus números ficam salvos na conta e aparecem em todos os aparelhos.':'💾 Salvo neste aparelho. Entre na conta para sincronizar com o celular/PC.'}</p>`;
 const draw=()=>{const c=calcP();box.querySelector('[data-r]').innerHTML=`<div class="cp-kp"><div class="cp-k or"><b>${brl(c.hora)}</b><span>hora técnica</span></div><div class="cp-k or"><b>${brl(c.pt)}</b><span>ponto elétrico (base)</span></div><div class="cp-k"><b>${brl(c.dia)}</b><span>diária (${nf(P.horas,0)} h)</span></div><div class="cp-k"><b>${brl(c.rec)}</b><span>faturamento mínimo/mês</span></div><div class="cp-k"><b>${brl(c.fx)}</b><span>custos fixos/mês</span></div><div class="cp-k"><b>${nf(c.npt,0)}</b><span>pontos/mês para bater a meta</span></div></div>`;
  box.querySelector('[data-t]').innerHTML=`<div class="cp-h">🔌 Sugestão por tipo de serviço (mão de obra)</div><div class="cp-sc"><table class="cp-t"><tr><th>Serviço</th><th>Fator</th><th>Valor</th></tr>${TIPOS.map(t=>`<tr><td style="white-space:normal;min-width:170px">${E(t[0])}</td><td>×${String(t[1]).replace('.',',')}</td><td class="hi">${brl(c.pt*t[1])}</td></tr>`).join('')}</table></div><p class="cp-nt">Fatores sugeridos sobre o ponto-base. Ajuste conforme a dificuldade da obra (laje, alvenaria, altura, acabamento).</p>`;return c};
 draw();
 box.oninput=e=>{const t=e.target;if(t.dataset.f!==undefined)P.f[+t.dataset.f]=pn(t.value);else if(t.dataset.k)P[t.dataset.k]=pn(t.value);else return;draw();savedP()};
 box.onclick=async e=>{if(!e.target.closest('[data-cp]'))return;const c=calcP(),tx=`💰 *Minha precificação de mão de obra*\nHora técnica: *${brl(c.hora)}*\nPonto elétrico: *${brl(c.pt)}*\nDiária: *${brl(c.dia)}*\nFaturamento mínimo/mês: ${brl(c.rec)}\n\n_DC CAD Pro_`;try{await navigator.clipboard.writeText(tx);tst('Resumo copiado')}catch(x){tst('Não consegui copiar')}};
 pullP().then(ch=>{if(ch&&document.body.contains(box)&&!box.contains(document.activeElement))preco(box)})}

/* =====================================================================
   Entradas: janela principal, botões, menu mobile, Novidades
   ===================================================================== */
const TABS=[['compras','🛒 Lista de compras'],['guia','📘 Guia NBR 5410'],['esq','🔌 Esquemas'],['preco','💰 Mão de obra']];
function open(tab){return win('🧰 Campo & NBR 5410',TABS,tab||'compras',(t,box)=>({compras,guia,esq,preco})[t](box),760)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&logged()){const b=document.querySelector('.mCp81 [data-k="meta"]');if(!b)return;const m=document.querySelector('.mCp81 [data-b]');pullP().then(ch=>{if(ch&&m&&!m.contains(document.activeElement))preco(m)})}});

function bind(){
 const top=document.querySelector('#vP .top'),ut=$('bUtP');
 if(top&&!$('bCp81')){const b=document.createElement('button');b.id='bCp81';b.className='btn ghost';b.title='Campo: lista de compras, guia NBR, esquemas e preços';b.innerHTML='🧰<span class="lb">&nbsp;Campo</span>';b.onclick=()=>open();top.insertBefore(b,ut?ut.nextSibling:null)}
 const hn=document.querySelector('#vH .hnav');
 if(hn&&!$('bCpH')){const b=document.createElement('button');b.id='bCpH';b.className='hnv';b.innerHTML='🧰 Campo &amp; NBR';b.onclick=()=>open('guia');hn.insertBefore(b,hn.querySelector('.btn.or'))}}
function tile(g,ic,lb,fn,c){const b=document.createElement('button');b.className='t '+(c||'');b.innerHTML='<i>'+ic+'</i><span>'+lb+'</span>';b.onclick=()=>{const o=$('mSh');if(o)o.remove();setTimeout(fn,60)};g.appendChild(b)}
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(!n||n.id!=='mSh')continue;const g=n.querySelector('.g');if(!g)continue;
 g.querySelectorAll('button').forEach(b=>{const s=b.querySelector('span');if(s&&s.textContent.trim()=='Eletricistas'){s.textContent='Meu cartão';const i=b.querySelector('i');if(i)i.textContent='🪪'}});
 if(Z())tile(g,'🛒','Lista de compras',()=>open('compras'),'or');
 tile(g,'🧰','Campo & NBR',()=>open(Z()?'compras':'guia'))}}).observe(document.body,{childList:true});

bind();
window.campo80={open,compras:()=>open('compras'),guia:()=>open('guia'),esquemas:()=>open('esq'),preco:()=>open('preco'),diagramas:DG,calc:calcP};
})();
