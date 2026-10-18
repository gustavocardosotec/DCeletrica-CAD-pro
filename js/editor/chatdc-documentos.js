/* DC CAD Pro v9.0 alfa — chatdc-documentos.js: ChatDC NBR, fechamento de caixas, documentos PDF, wallbox, legenda dinâmica
   (bloco movido do index.html sem nenhuma alteração de lógica) */
/* ===== v7.3 alfa: ChatDC NBR, wallbox, fechamento de caixas, documentos comerciais ===== */
(()=>{
const $=id=>document.getElementById(id),Z=()=>S&&!$('vE').classList.contains('hidden'),V=()=>window.v7x,
nf=(n,d=2)=>(+n||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}),brl=n=>'R$ '+nf(n),
tst=m=>{let t=$('t73');if(!t){t=document.createElement('div');t.id='t73';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3000)},
mod=(t,h,w)=>{const m=document.createElement('div');m.className='modal full';m.style.zIndex=90;m.innerHTML=`<div style="max-width:${w||480}px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">${t}</h3><button class="btn ghost ml-auto" data-x>✕</button></div><div>${h}</div></div>`;m.addEventListener('click',e=>{if(e.target===m||e.target.hasAttribute('data-x'))m.remove()});document.body.appendChild(m);return m},
EMP=()=>{try{return JSON.parse(localStorage.getItem('dce_emp71'))||{}}catch(e){return{}}},
today=()=>new Date().toLocaleDateString('pt-BR'),longDate=()=>new Date().toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'}),
fld=(id,l,v,ty='text',ex='')=>`<label>${l}<input class="in mt-1" id="${id}" type="${ty}" value="${esc(v==null?'':v)}" ${ex}></label>`,
sel73=(id,l,a,v)=>`<label>${l}<select class="in mt-1" id="${id}">${a.map(x=>`<option ${x==v?'selected':''}>${esc(x)}</option>`).join('')}</select></label>`,
ta73=(id,l,v,r=3)=>`<label>${l}<textarea class="in mt-1" id="${id}" rows="${r}" style="font-size:14px">${esc(v==null?'':v)}</textarea></label>`,
gv=(m,id)=>m.querySelector('#'+id).value.trim(),isc=(m,id)=>m.querySelector('#'+id).checked;

/* ================= ChatDC NBR (painel fixo) ================= */
const wk=$('wk71'),ch=document.createElement('aside');ch.id='ch73';ch.className='hidden';
ch.innerHTML='<div class="h73"><div><b>🤖 ChatDC NBR</b><small>Comandos + NBR 5410 • funciona offline</small></div><button class="btn ghost" data-c="clr" title="Limpar">🗑</button><button class="btn ghost" data-c="x" title="Fechar">✕</button></div><div class="m73" id="m73"></div><div class="q73" id="q73"></div><div class="i73"><input id="i73" class="in" placeholder="Pergunte sobre a NBR 5410..." autocomplete="off"><button class="btn or" data-c="go">➤</button></div>';
wk.appendChild(ch);
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''),
KB=[
[/carro eletrico|wallbox|recarga|veiculo eletrico|\bev\b/,'<b>Carro elétrico (wallbox)</b>: circuito <b>exclusivo</b> por carregador, cabo e disjuntor pela corrente nominal dele (ex.: 32 A para 7,4 kW em 220 V; 16 A trifásico para 11 kW; 32 A trifásico para 22 kW), DR de 30 mA <b>tipo A + proteção CC de 6 mA</b> (ou tipo B), DPS e aterramento TN-S. Use Utilitários > 🚗 Carro elétrico e confirme a ABNT NBR 17019 e a regra da concessionária.'],
[/cor(es)?\b.*(fio|condutor|cabo)|(fio|condutor|cabo).*\bcor|fio terra|cor d[oa]/,'Neutro: <b>azul-claro</b>. Proteção (PE): <b>verde-amarelo</b> (ou verde). Fase: qualquer cor exceto azul, verde e verde-amarelo (comum: preto, vermelho ou branco). Retorno: cor distinta das demais (comum: amarelo).'],
[/secao minima|bitola minima|menor bitola|secao do neutro|secao do pe|neutro.*secao/,'Cobre: <b>1,5 mm²</b> em iluminação e <b>2,5 mm²</b> em força (tomadas e TUE). Neutro: mesma seção da fase até 25 mm². PE: igual à fase até 16 mm²; 16 mm² para fases de 16 a 35 mm²; metade da fase acima de 35 mm².'],
[/\bdps\b|surto|raio|sobretensao/,'A NBR 5410 exige DPS quando a alimentação é total ou parcialmente aérea e em outros casos de risco (ver NBR 5419). Em residências costuma-se instalar DPS classe II no quadro (ex.: 275 V), protegido por disjuntor e com condutor de terra curto. Recomendado mesmo quando não obrigatório.'],
[/\bdr\b|idr|diferencial/,'DR de alta sensibilidade (<b>30 mA</b>) é obrigatório em circuitos de banheiros, cozinhas, copas, áreas de serviço, áreas externas e locais molháveis; adotá-lo em todos os circuitos de tomadas é boa prática. DR tipo A é o usual (tipo B para cargas com corrente CC, como alguns carregadores e inversores). Teste o botão T todo mês.'],
[/aterramento|condutor de protecao|esquema tn|tn-s|tn-c|\bpe\b/,'Em residências o esquema usual é o <b>TN-S</b> (neutro e PE separados a partir do quadro). Todo circuito leva PE; o barramento PE do quadro liga ao eletrodo de aterramento e à equipotencialização principal. Nunca use o neutro como terra.'],
[/queda/,'Limites da NBR 5410: até <b>4%</b> nos circuitos terminais e até <b>5%</b> no total a partir do ponto de entrega. Monofásico: ΔV% = 2·ρ·L·I / (S·V) × 100 (ρ do cobre a 70 °C ≈ 0,0206 Ω·mm²/m). Ex.: "queda de tensão 3000w 127v 40m".'],
[/eletroduto|conduite|ocupacao/,'Ocupação máxima da seção do eletroduto (NBR 5410): <b>53%</b> com 1 condutor, <b>31%</b> com 2 e <b>40%</b> com 3 ou mais. Use Utilitários > 🧵 Eletroduto para achar o diâmetro mínimo.'],
[/reserva|quadro de distribuicao|\bqdc?\b|disjuntor geral/,'Reserva de espaço no quadro (NBR 5410): até 6 circuitos → 2 reservas; 7 a 12 → 3; 13 a 30 → 4; acima de 30 → 15% dos circuitos.'],
[/tomada|tug/,'<b>Tomadas</b>: salas e dormitórios 1 a cada 5 m de perímetro (ou fração); cozinha, copa e serviço 1 a cada 3,5 m; banheiro ao menos 1 junto ao lavatório; varandas, garagens e halls ao menos 1. Potência: 600 VA nas 3 primeiras tomadas de cozinha/serviço e banheiro (100 VA nas demais); 100 VA nos outros cômodos.'],
[/chuveiro|\btue\b|torneira|ar condicionado|forno/,'<b>TUE</b> (uso específico): equipamentos com corrente acima de 10 A (chuveiro, torneira elétrica, ar-condicionado, forno) têm circuito próprio, com disjuntor e cabo pela corrente do equipamento. Ex.: "chuveiro 5500w 220v".'],
[/iluminacao|luminaria|ponto de luz/,'Mínimo de 1 ponto de luz no teto por cômodo, comandado por interruptor. Carga mínima: 100 VA até 6 m²; acima disso, +60 VA a cada 4 m² inteiros. Ex.: "iluminação 14 m²".'],
[/disjuntor|curva (b|c)|sobrecarga/,'Condição de proteção: <b>Ib ≤ In ≤ Iz</b> (corrente de projeto, nominal do disjuntor e capacidade do cabo, já com fator de agrupamento). Use Utilitários > Cabo e disjuntor.']],
DEF='Não achei essa nas regras offline. Tente: "chuveiro 5500w 220v", "queda de tensão 3000w 127v 40m", "iluminação 14 m²", "tomadas", "DR", "DPS", "cores dos fios", "carro elétrico" ou "resumo do projeto".';
function local(q){const s=norm(q);
 if(/resumo|situacao|status/.test(s)&&S&&Z()){const cs=circs(),kva=cs.reduce((a,o)=>a+o.w,0)/1000,bad=cs.filter(o=>!o.ok);
  return `Projeto <b>${esc($('nm').value||'')}</b>: ${cs.length} circuitos, ${nf(kva,1)} kVA (${S.cfg.forn=='bi'?'bifásico':'monofásico'}), geral ${S.q.ig} A. ${bad.length?'⚠ Cabo menor que o disjuntor nos circuitos '+bad.map(o=>o.n).join(', ')+'.':'Sem alerta de cabo/disjuntor.'} Para a checagem completa use 🧰 > Auditar NBR.`}
 const kb=()=>{for(const[r,t]of KB)if(r.test(s))return t};
 if(/carro|wallbox|veiculo|recarga/.test(s))return kb();
 if(/\d/.test(s)){try{const a=V().ans(q);if(!/^Posso calcular/.test(a))return a}catch(e){}}
 return kb()||(()=>{try{const a=V().ans(q);if(!/^Posso calcular/.test(a))return a}catch(e){}return DEF})()}
async function ask73(q){if(window.ia77){try{const r=await window.ia77.run(q);if(r)return r}catch(e){console.error(e);return'Tive um problema ao executar isso. Tente descrever de outro jeito.'}}if(typeof CFG!='undefined'&&CFG.chatUrl){try{const r=await fetch(CFG.chatUrl,{method:'POST',headers:{'Content-Type':'application/json',apikey:CFG.key,Authorization:'Bearer '+((ses&&ses.access_token!='local'&&ses.access_token)||CFG.key)},body:JSON.stringify({q,ctx:S?{fase:S.cfg.fase,forn:S.cfg.forn,circuitos:circs().length}:{}})});const d=await r.json();if(d&&d.answer)return esc(d.answer).replace(/\n/g,'<br>')}catch(e){}}return local(q)}
const msgs=$('m73'),inp=$('i73'),add=(c,h)=>{msgs.insertAdjacentHTML('beforeend',`<div class="b73 ${c}">${h}</div>`);msgs.scrollTop=1e9;return msgs.lastElementChild};
let greeted=0;
async function send(q){q=(q||inp.value).trim();if(!q)return;inp.value='';add('u',esc(q));const tp=add('a','<span class="dts"><i></i><i></i><i></i></span>');const a=await ask73(q);tp.innerHTML=a;msgs.scrollTop=1e9}
function hello(){if(greeted)return;greeted=1;add('a','Olá! Sou o <b>ChatDC</b> 👋 Respondo dúvidas da NBR 5410 e <b>executo comandos</b> no seu desenho. Experimente:<div class="ia-ac"><button class="ia-chip" data-ia="cmd" data-cmd="faça uma planta genérica de 4 cômodos">🏠 Planta de 4 cômodos</button><button class="ia-chip" data-ia="cmd" data-cmd="coloque uma tomada média 127 na sala">🔌 Tomada média na sala</button><button class="ia-chip" data-ia="cmd" data-cmd="o que você faz?">❓ Ver comandos</button></div><small style="color:#64748b">Confira sempre a norma vigente.</small>')}
$('q73').innerHTML=['Planta de 4 cômodos','Tomada média 127 na sala','Luminária em todos os cômodos','Gerar elétrica','Chuveiro 5500W 220V','DR','Cores dos fios','Resumo do projeto'].map(x=>`<button>${x}</button>`).join('');
ch.addEventListener('click',e=>{const c=e.target.dataset.c,b=e.target.closest('#q73 button');if(b)send(b.textContent);else if(c=='go')send();else if(c=='x')chat(false);else if(c=='clr'){msgs.innerHTML='';greeted=0;hello()}});
inp.onkeydown=e=>{if(e.key=='Enter')send()};
function chat(v){const open=v===undefined?ch.classList.contains('hidden'):v;ch.classList.toggle('hidden',!open);try{localStorage.setItem('dce_ch73',open?'1':'0')}catch(e){}
 if(open){hello();const t=$('tp71');if(t&&document.documentElement.classList.contains('mob'))t.classList.add('hidden');setTimeout(()=>{if(!matchMedia('(pointer:coarse)').matches)inp.focus()},80)}setTimeout(()=>dispatchEvent(new Event('resize')),30)}
window.chat73=chat;$('bCh').onclick=()=>chat();
try{if(localStorage.getItem('dce_ch73')=='1'&&!document.documentElement.classList.contains('mob'))chat(true)}catch(e){}

/* ================= Fechamento de caixas ================= */
const FX=['cx','luz','tb','tm','ta','td','is','i3','i4','tue'],CLR={PE:'#16a34a',N:'#38bdf8',F:'#1f2937',R:'#eab308'};
const wgM=(n,s)=>(s>4?'221-61':'221-41')+({2:'2',3:'3',4:'5',5:'5'}[Math.min(n,5)]),
wgT=(n,s)=>{if(n<=1)return'Sem emenda';if(n==2)return`Ligação direta no borne ou WAGO ${wgM(2,s)}`;if(n<=5)return`WAGO ${wgM(n,s)}${n==4?' (5 vias)':''}`;const g=[];let m=n;while(m>5){g.push(5);m=m-3}g.push(m);return'Dividir em grupos ligados por condutor-ponte: '+g.map(x=>'WAGO '+wgM(x,s)).join(' + ')},
jn=(c,n,k)=>{n=Math.max(1,Math.min(n,8));const h=Math.max(40,n*11+12);let s=`<svg width="104" height="${h}" viewBox="0 0 104 ${h}" aria-hidden="true">`;for(let i=0;i<n;i++){const y=(i+1)*h/(n+1);s+=`<path d="M4 ${y} L58 ${h/2}" stroke="${c}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`}return s+`<rect x="56" y="${h/2-12}" width="38" height="24" rx="6" fill="#f1f5f9" stroke="#64748b"/><text x="75" y="${h/2+4}" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">${k}</text></svg>`};
function legs(t){return Math.max(1,S.items.filter(f=>f.t=='fio'&&((f.ids&&t.id&&f.ids.includes(t.id))||f.pts.some(q=>Math.hypot(q[0]-t.x,q[1]-t.y)<4))).length)}
function fecha(t){if(!t||t.t!='sym'||!FX.includes(t.k)){tst('Selecione uma caixa, ponto de luz, tomada ou interruptor');return}
 const L=legs(t),o=t.c?circs().find(x=>x.n==t.c):null,s=o?+o.cabo:2.5,k=t.k,R=[],r=(c,t2,n,x)=>R.push({c,t:t2,n,x}),extra=[];
 if(k=='cx'){r('PE','Terra (verde)',L);r('N','Neutros (azul-claro)',L);r('F','Fases do mesmo circuito (preto/vermelho)',L);r('R','Retornos (amarelo): só os do mesmo ponto',2);extra.push('Caixa de passagem: nunca misture fases ou retornos de circuitos diferentes; neutros e terras de circuitos distintos também devem ficar separados em emendas distintas.')}
 else if(k=='luz'){r('N','Neutros + lâmpada (azul-claro)',L+1);r('PE','Terra / luminária metálica (verde)',L);r('F','Fases de passagem (preto/vermelho)',L,L<2?'Fase sobe direto ao interruptor':'');r('R','Retorno do interruptor + lâmpada (amarelo)',2);extra.push('Caixa octogonal 4x4 (teto): a fase sobe ao interruptor e o retorno volta ao ponto de luz; a lâmpada fica entre retorno e neutro.')}
 else if(['tb','tm','ta','td'].includes(k)){r('F','Fases de passagem + tomada (preto/vermelho)',L+1);r('N','Neutros + tomada (azul-claro)',L+1);r('PE','Terra + tomada (verde)',L+1);extra.push('Caixa 4x2: use rabicho (pigtail) de cada emenda até o borne da tomada, assim o circuito não se interrompe ao retirar a tomada. Fase no borne do lado direito (tomadas 2P+T, padrão NBR 14136: fase e neutro conforme a marcação do produto).')}
 else if(k=='is'){r('F','Fase de chegada ao borne comum (preto)',1);r('R','Retorno ao ponto de luz (amarelo)',1);r('N','Neutros de passagem (azul-claro)',L,L<2?'Neutro não passa pela caixa do interruptor':'');extra.push('Interruptor simples (caixa 4x2): só fase e retorno; o neutro apenas passa, sem ligar ao interruptor.')}
 else if(k=='i3'){r('F','Fase de chegada ao borne comum (preto)',1);r('R','2 retornos viajantes entre os interruptores (amarelo/cinza)',2);r('R','Retorno ao ponto de luz, no comum do outro interruptor',1);extra.push('Paralelo (three-way): a fase entra no comum de um interruptor, os dois viajantes ligam os interruptores e o comum do outro leva o retorno à lâmpada.')}
 else if(k=='i4'){r('F','Fase de chegada ao comum do 1º paralelo (preto)',1);r('R','2 viajantes de entrada no intermediário (amarelo/cinza)',2);r('R','2 viajantes de saída para o 2º paralelo',2);extra.push('Intermediário (four-way): fica entre dois interruptores paralelos; ligue 2 viajantes na entrada e 2 na saída, sem cruzar com o comum.')}
 else{r('F','Fase(s) do circuito dedicado',1);r('N','Neutro (se 127/220 V monofásico)',1);r('PE','Terra (verde)',1);extra.push('TUE: circuito dedicado, ligação direta nos bornes; evite emendas na caixa. Para chuveiro, verifique a corrente e a seção do circuito no Quadro.')}
 const m=mod('🔌 Fechamento da caixa',`<p class="text-sm"><b>${esc(NM[k])}</b> • ${L} eletroduto(s) na caixa${o?' • Circ. '+esc(o.n)+' • '+s+' mm²':''}</p>${R.map(x=>`<div class="fx73">${jn(CLR[x.c],Math.min(x.n,8),x.n)}<div><b>${x.t}</b><br><span class="text-xs">${x.n} condutor(es)</span><br><span class="text-sm" style="color:#0f2a43;font-weight:700">${x.x||wgT(x.n,s)}</span></div></div>`).join('')}<p class="text-xs" style="color:#334155">${extra.join('<br>')}</p><p class="text-xs" style="color:#64748b">Esquema orientativo, calculado pelos eletrodutos desenhados. Conectores WAGO série 221: ${s>4?'linha 221-61x (até 6 mm²)':'linha 221-41x (até 4 mm²)'}. Confira o projeto e a instalação real.</p>`,520)}
window.fecha73=fecha;

/* ================= Documentos (PDF) ================= */
class PDF{constructor(){this.d=new jspdf.jsPDF({unit:'mm',format:'a4'});this.y=0;this.e=EMP();this.head()}
 head(){const d=this.d,e=this.e;let x=15;if(e.logo){try{const p=d.getImageProperties(e.logo),r=Math.min(24/p.width,22/p.height);d.addImage(e.logo,'JPEG',15,10,p.width*r,p.height*r);x=44}catch(_){}}
  d.setTextColor(15,42,67);d.setFont(undefined,'bold');d.setFontSize(15);d.text(e.nome||'Profissional / Empresa',x,16);d.setFont(undefined,'normal');d.setFontSize(8.5);d.setTextColor(90);
  [e.doc&&'CNPJ/CPF: '+e.doc,[e.tel&&'Tel/WhatsApp: '+e.tel,e.mail].filter(Boolean).join('   |   '),e.end].filter(Boolean).forEach((l,i)=>d.text(String(l),x,22+i*4.6));
  d.setDrawColor(242,107,33);d.setLineWidth(.8);d.line(15,36,195,36);d.setTextColor(20);this.y=46}
 need(h){if(this.y+h>276){this.d.addPage();this.y=18}}
 title(t,s){const d=this.d;d.setFont(undefined,'bold');d.setFontSize(16);d.setTextColor(15,42,67);d.text(t,105,this.y,{align:'center'});this.y+=6;if(s){d.setFont(undefined,'normal');d.setFontSize(9);d.setTextColor(100);d.text(s,105,this.y,{align:'center'});this.y+=5}d.setTextColor(20);this.y+=4}
 h2(t){this.need(12);const d=this.d;d.setFont(undefined,'bold');d.setFontSize(11);d.setTextColor(242,107,33);d.text(t,15,this.y);d.setTextColor(20);this.y+=5}
 p(t,o={}){const d=this.d,s=o.s||10,lh=o.lh||s*.5;d.setFont(undefined,o.b?'bold':'normal');d.setFontSize(s);d.setTextColor(...(o.c||[20,20,20]));d.splitTextToSize(String(t),o.w||180).forEach(l=>{this.need(lh);d.text(l,o.x||15,this.y,o.al?{align:o.al}:undefined);this.y+=lh});this.y+=o.gap==null?1.5:o.gap}
 kv(k,v){if(!v)return;const d=this.d;this.need(6);d.setFont(undefined,'bold');d.setFontSize(10);d.text(k+': ',15,this.y);const w=d.getTextWidth(k+': ');d.setFont(undefined,'normal');const L=d.splitTextToSize(String(v),180-w);d.text(L[0],15+w,this.y);this.y+=5;L.slice(1).forEach(l=>{this.need(5);d.text(l,15,this.y);this.y+=5})}
 table(cols,rows){const d=this.d,hd=()=>{this.need(14);d.setFillColor(15,42,67);d.rect(15,this.y-4.5,180,6.5,'F');d.setTextColor(255);d.setFont(undefined,'bold');d.setFontSize(9);cols.forEach(c=>d.text(c.h,c.al?c.x+c.w-1:c.x+1.5,this.y,c.al?{align:'right'}:undefined));d.setTextColor(20);this.y+=6.5};hd();
  rows.forEach((r,i)=>{d.setFont(undefined,'normal');d.setFontSize(9);const ls=cols.map((c,j)=>d.splitTextToSize(String(r[j]),c.w-3)),n=Math.max(...ls.map(a=>a.length)),h=n*4.2+2;if(this.y+h>276){d.addPage();this.y=18;hd()}
   if(i%2){d.setFillColor(244,247,250);d.rect(15,this.y-4,180,h,'F')}cols.forEach((c,j)=>ls[j].forEach((l,k)=>d.text(l,c.al?c.x+c.w-1:c.x+1.5,this.y+k*4.2,c.al?{align:'right'}:undefined)));this.y+=h});this.y+=3}
 sign(a,b){this.need(46);const d=this.d,y=this.y+22;d.setDrawColor(60);d.setLineWidth(.3);d.line(18,y,92,y);d.line(118,y,192,y);d.setFontSize(9);[[55,a],[155,b]].forEach(([x,s])=>{d.setFont(undefined,'bold');d.text(s[0],x,y+5,{align:'center'});d.setFont(undefined,'normal');(s.slice(1)).forEach((l,i)=>d.text(String(l),x,y+10+i*4.5,{align:'center'}))});this.y=y+24}
 save(n){const d=this.d,N=d.getNumberOfPages();for(let i=1;i<=N;i++){d.setPage(i);d.setFontSize(8);d.setTextColor(130);d.text('Documento gerado pelo DC CAD Pro',15,291);d.text('Página '+i+'/'+N,195,291,{align:'right'})}d.save(n)}}
const mk=()=>{if(!window.jspdf){alert('O gerador de PDF não carregou. Verifique a internet.');return null}return new PDF()},fn=s=>String(s||'projeto').replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'-')||'projeto';

/* extenso */
const U1=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','catorze','quinze','dezesseis','dezessete','dezoito','dezenove'],D1=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'],C1=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'],
e999=n=>{if(n==100)return'cem';const s=[],c=Math.floor(n/100),r=n%100;if(c)s.push(C1[c]);if(r)s.push(r<20?U1[r]:D1[Math.floor(r/10)]+(r%10?' e '+U1[r%10]:''));return s.join(' e ')};
function ext(v){const r=Math.round((+v||0)*100),ri=Math.floor(r/100),ce=r%100,mi=Math.floor(ri/1e6),mil=Math.floor(ri%1e6/1000),u=ri%1000,P=[];
 if(mi)P.push([e999(mi)+(mi==1?' milhão':' milhões'),1e6]);if(mil)P.push([mil==1?'mil':e999(mil)+' mil',1e3]);if(u)P.push([e999(u),u]);
 let t='';P.forEach((x,i)=>{t+=i?((i==P.length-1&&(u<100||u%100==0))||(i==P.length-1&&!u)?' e ':', ')+x[0]:x[0]});
 if(ri&&!u&&!mil&&mi)t+=' de';
 const a=ri?t+' '+(ri==1?'real':'reais'):'',c=ce?(ce==1?'um centavo':e999(ce)+' centavos'):'';return(a&&c?a+' e '+c:a||c||'zero real')}
const num=s=>{const v=parseFloat(String(s).replace(/\./g,'').replace(',','.'));return isNaN(v)?0:v};

function tot73(){const c=V().orcCalc(),cm=S.cm||{},sub=c.tm+c.mo,ds=sub*((+cm.desc)||0)/100;return{c,sub,ds,tot:sub-ds}}

/* --- Orçamento comercial --- */
function orc73(){if(!Z())return;if(!window.orc80||!window.orc80.fromProject)return orc73legacy();
 const h=S.hdr=S.hdr||{},cm=S.cm=Object.assign({val:'15',pz:'A combinar com o cliente',pg:'50% na aprovação do orçamento e 50% na conclusão dos serviços.',desc:0,gar:'90 dias',obs:'',hide:0},S.cm),ob=S.ob=S.ob||{};
 const T=tot73(),c=T.c;let its=c.rows.filter(r=>r.p>0);if(!its.length){its=c.rows;tst('Dica: preencha os preços em 💵 Orçamento (ou direto na folha)')}
 const itens=its.map(r=>({d:r.n+(r.u&&r.u!='un'?' ('+r.u+')':''),q:r.q,v:r.p}));if(c.mo>0)itens.push({d:'Mão de obra',q:1,v:c.mo});
 const obs=(cm.obs&&cm.obs!='Valores estimados com base no desenho; sujeitos a conferência em obra.'?String(cm.obs).trim():'');
 window.orc80.fromProject({id:ob.oid,cli:h.cli,doc:cm.cdoc,tel:cm.ctel,end:h.obra,itens,vd:cm.val,desc:cm.desc,pgto:cm.pg,obs}).then(id=>{if(id&&ob.oid!=id){ob.oid=id;auto()}}).catch(()=>{tst('Não consegui abrir o orçamento')})}
function orc73legacy(){if(!Z())return;const e=EMP(),h=S.hdr=S.hdr||{},cm=S.cm=Object.assign({val:'15',pz:'A combinar com o cliente',pg:'50% na aprovação do orçamento e 50% na conclusão dos serviços.',desc:0,gar:'90 dias',obs:'',hide:0},S.cm);
 const m=mod('📄 PDF do orçamento comercial',`<p class="text-xs" style="color:#64748b">Dados da empresa vêm de Configurações > Empresa. Preços e mão de obra: botão 💵 Orçamento.</p>
 <div class="qcc"><b class="text-sm">Cliente e obra</b>${fld('o_cli','Cliente',h.cli)}${fld('o_cdoc','CPF/CNPJ do cliente',cm.cdoc)}${fld('o_ctel','Telefone do cliente',cm.ctel,'tel')}${fld('o_obra','Endereço da obra',h.obra)}</div>
 <div class="qcc"><b class="text-sm">Condições</b><div class="grid grid-cols-2 gap-2">${fld('o_val','Validade (dias)',cm.val,'number','min="1"')}${fld('o_desc','Desconto (%)',cm.desc,'number','min="0" max="100" step="any"')}</div>${fld('o_pz','Prazo de execução',cm.pz)}${fld('o_gar','Garantia dos serviços',cm.gar)}${ta73('o_pg','Condições de pagamento',cm.pg,2)}${fld('o_pix','Chave PIX',e.pix||'')}${ta73('o_obs','Observações',cm.obs,2)}
 <label style="display:flex;gap:8px;align-items:center;cursor:pointer;margin-top:10px"><input type="checkbox" id="o_hide" ${cm.hide?'checked':''} style="width:18px;height:18px;accent-color:#f26b21"> Ocultar itens sem preço</label></div>
 <button class="btn or w-full mt-3" id="o_go">📄 Gerar PDF</button>`,520);
 m.querySelector('#o_go').onclick=()=>{h.cli=gv(m,'o_cli');h.obra=gv(m,'o_obra');Object.assign(cm,{cdoc:gv(m,'o_cdoc'),ctel:gv(m,'o_ctel'),val:gv(m,'o_val'),desc:+gv(m,'o_desc')||0,pz:gv(m,'o_pz'),gar:gv(m,'o_gar'),pg:gv(m,'o_pg'),obs:gv(m,'o_obs'),hide:isc(m,'o_hide')?1:0,pix:gv(m,'o_pix')});auto();
  const T=tot73(),c=T.c,rows=c.rows.filter(r=>!cm.hide||r.p);if(!T.tot)tst('Dica: preencha os preços em 💵 Orçamento');
  const P=mk();if(!P)return;const d=P.d,cs=circs();
  P.title('PROPOSTA COMERCIAL','Projeto e instalação elétrica • Emitida em '+today()+' • Válida por '+(cm.val||15)+' dias');
  P.h2('Cliente e projeto');P.kv('Cliente',h.cli);P.kv('CPF/CNPJ',cm.cdoc);P.kv('Telefone',cm.ctel);P.kv('Obra',h.obra);P.kv('Projeto',$('nm').value||'Projeto');P.kv('Concessionária',S.cfg.conc);
  P.kv('Instalação',nf(cs.reduce((a,o)=>a+o.w,0)/1000,1)+' kVA em '+cs.length+' circuitos ('+(S.cfg.forn=='bi'?'bifásico':'monofásico')+')');P.y+=3;
  P.h2('Materiais');P.table([{h:'Descrição',x:15,w:90},{h:'Qtd.',x:105,w:28},{h:'Unitário',x:133,w:28,al:1},{h:'Total',x:161,w:34,al:1}],rows.map(r=>[r.n,r.q+' '+r.u,r.p?brl(r.p):'-',r.p?brl(r.s):'-']));
  P.need(40);const L=(a,b,B,big)=>{P.need(7);d.setFont(undefined,B?'bold':'normal');d.setFontSize(big?13:10);if(big){d.setTextColor(242,107,33)}d.text(a,120,P.y);d.text(b,195,P.y,{align:'right'});d.setTextColor(20);P.y+=big?8:5.5};
  L('Materiais',brl(c.tm));L('Mão de obra'+(c.fixo?'':' ('+(S.mo==null?60:S.mo)+'% s/ materiais)'),brl(c.mo));if(T.ds)L('Desconto ('+nf(cm.desc,1)+'%)','- '+brl(T.ds));d.setDrawColor(200);d.line(120,P.y-3.5,195,P.y-3.5);L('TOTAL',brl(T.tot),1,1);P.y+=2;
  P.h2('Condições comerciais');P.kv('Pagamento',cm.pg);P.kv('Prazo de execução',cm.pz);P.kv('Garantia',cm.gar);P.kv('Validade da proposta',(cm.val||15)+' dias');if(cm.pix)P.kv('Chave PIX',cm.pix+(e.nome?' ('+e.nome+')':''));
  if(cm.obs&&cm.obs!='Valores estimados com base no desenho; sujeitos a conferência em obra.'){P.y+=2;P.p(cm.obs,{s:9,c:[90,90,90]})}
  P.y+=4;P.p('Declaro estar de acordo com os valores e condições acima.',{s:9,gap:0});P.sign(['Profissional responsável',e.nome||h.autor||'',e.doc||''],['Aceite do cliente',h.cli||'',cm.cdoc||'Data: ___/___/______']);
  P.save(fn($('nm').value)+'-orcamento.pdf');m.remove()}}
window.orc73=orc73;

/* --- Recibo --- */
function rec73(){if(!Z())return;const e=EMP(),h=S.hdr||{},T=tot73(),r=S.dc=S.dc||{},R=r.rec=Object.assign({pag:h.cli||'',doc:(S.cm&&S.cm.cdoc)||'',val:T.tot?nf(T.tot):'',ref:'serviços de instalação elétrica'+($('nm').value?' - '+$('nm').value:'')+(h.obra?' ('+h.obra+')':''),forma:'PIX',tipo:'Quitação total',cid:'',data:today()},r.rec);
 const m=mod('🧾 Recibo de pagamento',`${fld('r_pag','Recebido de (pagador)',R.pag)}${fld('r_doc','CPF/CNPJ do pagador',R.doc)}${fld('r_val','Valor (R$)',R.val,'text','inputmode="decimal"')}${ta73('r_ref','Referente a',R.ref,2)}${sel73('r_forma','Forma de pagamento',['PIX','Dinheiro','Transferência bancária','Cartão','Boleto','Cheque'],R.forma)}${sel73('r_tipo','Tipo',['Quitação total','Pagamento parcial'],R.tipo)}<div class="grid grid-cols-2 gap-2">${fld('r_cid','Cidade',R.cid)}${fld('r_data','Data',R.data)}</div><button class="btn or w-full mt-3" id="r_go">🧾 Gerar recibo</button>`);
 m.querySelector('#r_go').onclick=()=>{Object.assign(R,{pag:gv(m,'r_pag'),doc:gv(m,'r_doc'),val:gv(m,'r_val'),ref:gv(m,'r_ref'),forma:gv(m,'r_forma'),tipo:gv(m,'r_tipo'),cid:gv(m,'r_cid'),data:gv(m,'r_data')});const v=num(R.val);if(!R.pag||!(v>0)){tst('Informe o pagador e o valor');return}auto();
  const P=mk();if(!P)return;const d=P.d;P.title('RECIBO','Nº '+new Date().toISOString().slice(2,10).replace(/-/g,'')+(R.tipo=='Pagamento parcial'?' • Pagamento parcial':''));
  d.setDrawColor(242,107,33);d.setLineWidth(.6);d.roundedRect(60,P.y,90,14,3,3);d.setFont(undefined,'bold');d.setFontSize(16);d.setTextColor(15,42,67);d.text('VALOR: '+brl(v),105,P.y+9.3,{align:'center'});d.setTextColor(20);P.y+=26;
  P.p(`Recebi de ${R.pag}${R.doc?', inscrito(a) no CPF/CNPJ '+R.doc:''}, a importância de ${brl(v)} (${ext(v)}), referente a ${R.ref}.`,{s:11,lh:6.5,gap:3});
  P.p(`Forma de pagamento: ${R.forma}.`,{s:11,lh:6.5,gap:3});
  P.p(R.tipo=='Quitação total'?'Pelo que dou plena, geral e irrevogável quitação do valor acima.':'Este recibo refere-se a pagamento parcial, não representando quitação total do valor contratado.',{s:11,lh:6.5,gap:8});
  P.p((R.cid?R.cid+', ':'')+R.data+'.',{s:11,al:'right',x:195,gap:4});P.sign(['Emitente',e.nome||h.autor||'',e.doc||''],['Pagador (ciente)',R.pag,R.doc||'']);P.save(fn($('nm').value)+'-recibo.pdf');m.remove()}}

/* --- Garantia --- */
function gar73(){if(!Z())return;const e=EMP(),h=S.hdr||{},r=S.dc=S.dc||{},G=r.gar=Object.assign({cli:h.cli||'',doc:(S.cm&&S.cm.cdoc)||'',obra:h.obra||'',serv:'Instalação elétrica conforme projeto'+($('nm').value?' "'+$('nm').value+'"':''),prazo:'90 dias',ini:today(),cid:'',ex:''},r.gar);
 const m=mod('🛡️ Termo de garantia',`${fld('g_cli','Contratante',G.cli)}${fld('g_doc','CPF/CNPJ',G.doc)}${fld('g_obra','Local da obra',G.obra)}${ta73('g_serv','Serviço executado',G.serv,2)}<div class="grid grid-cols-2 gap-2">${sel73('g_prazo','Prazo de garantia',['90 dias','6 meses','1 ano','2 anos','3 anos','5 anos'],G.prazo)}${fld('g_ini','Início (conclusão)',G.ini)}</div>${fld('g_cid','Cidade',G.cid)}${ta73('g_ex','Cláusula adicional (opcional)',G.ex,2)}<p class="text-xs mt-2" style="color:#64748b">Modelo padrão: revise com seu jurídico e adapte ao seu contrato.</p><button class="btn or w-full mt-3" id="g_go">🛡️ Gerar termo</button>`);
 m.querySelector('#g_go').onclick=()=>{Object.assign(G,{cli:gv(m,'g_cli'),doc:gv(m,'g_doc'),obra:gv(m,'g_obra'),serv:gv(m,'g_serv'),prazo:gv(m,'g_prazo'),ini:gv(m,'g_ini'),cid:gv(m,'g_cid'),ex:gv(m,'g_ex')});if(!G.cli){tst('Informe o contratante');return}auto();
  const P=mk();if(!P)return;const em=e.nome||h.autor||'o prestador',cl=[['1. Objeto',`O presente termo garante os serviços de ${G.serv}, executados por ${em} para ${G.cli}${G.doc?' (CPF/CNPJ '+G.doc+')':''}${G.obra?', no endereço '+G.obra:''}.`],
  ['2. Prazo',`A garantia é de ${G.prazo}, contados a partir de ${G.ini}, data de conclusão e entrega dos serviços, sem prejuízo dos direitos previstos no Código de Defesa do Consumidor (Lei 8.078/1990).`],
  ['3. Cobertura','Defeitos de execução da instalação: emendas e conexões, fixação e passagem de condutores e eletrodutos, montagem do quadro e identificação dos circuitos, e ajustes necessários para o funcionamento conforme o projeto. O reparo é feito sem custo de mão de obra.'],
  ['4. Materiais','Os materiais e equipamentos (disjuntores, DR, DPS, tomadas, interruptores, luminárias etc.) seguem a garantia de seus fabricantes. Quando houver defeito de fabricação, o prestador orienta e auxilia o acionamento.'],
  ['5. Exclusões','A garantia não cobre: danos por mau uso, sobrecarga ou ligação de cargas acima das previstas no projeto; descargas atmosféricas e surtos da rede; falhas ou oscilações no fornecimento da concessionária; alterações, ampliações ou reparos feitos por terceiros; umidade, infiltração, impacto ou desgaste natural; equipamentos fornecidos pelo cliente.'],
  ['6. Como acionar',`Em caso de problema, entre em contato${e.tel?' pelo WhatsApp/telefone '+e.tel:''}${e.mail?' ou e-mail '+e.mail:''}, informando o endereço e descrevendo o ocorrido. Não permita que terceiros mexam na instalação antes da visita técnica, sob pena de perda da garantia.`],
  ['7. Recomendações','Teste o botão T dos DR todo mês; não sobrecarregue tomadas e extensões; em caso de cheiro de queimado, aquecimento ou disparos frequentes, desligue o circuito e chame um profissional habilitado.']];
  if(G.ex)cl.push(['8. Disposições adicionais',G.ex]);
  P.title('TERMO DE GARANTIA DOS SERVIÇOS','Prazo: '+G.prazo);cl.forEach(([t,x])=>{P.need(18);P.p(t,{b:1,s:10.5,gap:.5});P.p(x,{s:10,lh:5,gap:3})});
  P.p((G.cid?G.cid+', ':'')+longDate()+'.',{s:10,al:'right',x:195,gap:2});P.sign(['Prestador',em,e.doc||''],['Contratante',G.cli,G.doc||'']);P.save(fn($('nm').value)+'-garantia.pdf');m.remove()}}

/* --- Termo de recebimento / NBR 5410 --- */
const CHK=['Inspeção visual: condutores, dispositivos e componentes conforme o projeto','Continuidade dos condutores de proteção (PE) e ligações equipotenciais','Resistência de isolamento dos circuitos','Aterramento verificado (eletrodo e barramento PE do quadro)','DR testados (botão de teste e funcionamento)','DPS instalado conforme projeto (quando previsto)','Polaridade e identificação dos circuitos no quadro','Funcionamento de iluminação, tomadas e cargas dedicadas'];
function ter73(){if(!Z())return;const e=EMP(),h=S.hdr||{},r=S.dc=S.dc||{},T=r.ter=Object.assign({rt:e.nome||h.autor||'',reg:'',art:'',cli:h.cli||'',doc:(S.cm&&S.cm.cdoc)||'',obra:h.obra||'',cid:'',data:today(),ck:CHK.map(()=>1)},r.ter);
 const m=mod('✅ Termo de recebimento / NBR 5410',`${fld('t_rt','Responsável técnico / executor',T.rt)}<div class="grid grid-cols-2 gap-2">${fld('t_reg','Registro (CREA/CFT/CRT)',T.reg)}${fld('t_art','Nº da ART/TRT',T.art)}</div>${fld('t_cli','Cliente',T.cli)}${fld('t_doc','CPF/CNPJ do cliente',T.doc)}${fld('t_obra','Local da obra',T.obra)}
 <div class="qcc"><b class="text-sm">Verificações realizadas</b>${CHK.map((c,i)=>`<label style="display:flex;gap:8px;align-items:flex-start;cursor:pointer;font-size:13px;color:#1b2a3a;font-weight:500"><input type="checkbox" data-k="${i}" ${T.ck[i]?'checked':''} style="width:18px;height:18px;margin-top:1px;accent-color:#f26b21;flex:none"> ${c}</label>`).join('')}<p class="text-xs mt-2" style="color:#b42318">Marque só o que foi realmente verificado: o profissional responde pelo conteúdo.</p></div>
 <div class="grid grid-cols-2 gap-2">${fld('t_cid','Cidade',T.cid)}${fld('t_data','Data',T.data)}</div><button class="btn or w-full mt-3" id="t_go">✅ Gerar termo</button>`,520);
 m.querySelector('#t_go').onclick=()=>{Object.assign(T,{rt:gv(m,'t_rt'),reg:gv(m,'t_reg'),art:gv(m,'t_art'),cli:gv(m,'t_cli'),doc:gv(m,'t_doc'),obra:gv(m,'t_obra'),cid:gv(m,'t_cid'),data:gv(m,'t_data'),ck:[...m.querySelectorAll('[data-k]')].map(x=>x.checked?1:0)});if(!T.rt||!T.cli){tst('Informe o responsável e o cliente');return}auto();
  const P=mk();if(!P)return;const cs=circs();P.title('TERMO DE RECEBIMENTO DE OBRA','Declaração de conformidade com a ABNT NBR 5410');
  P.p(`Eu, ${T.rt}${T.reg?', registro profissional '+T.reg:''}${T.art?', ART/TRT nº '+T.art:''}, declaro que a instalação elétrica de baixa tensão executada${T.obra?' em '+T.obra:''}${$('nm').value?' (projeto "'+$('nm').value+'")':''}, para ${T.cli}${T.doc?' (CPF/CNPJ '+T.doc+')':''}, foi realizada conforme o projeto e inspecionada e ensaiada segundo a seção de verificação final da ABNT NBR 5410, com os resultados abaixo.`,{s:10.5,lh:5.5,gap:3});
  P.h2('Resumo da instalação');P.kv('Carga instalada',nf(cs.reduce((a,o)=>a+o.w,0)/1000,1)+' kVA');P.kv('Circuitos',String(cs.length));P.kv('Fornecimento',(S.cfg.forn=='bi'?'Bifásico':'Monofásico')+' '+VG());P.kv('Disjuntor geral / IDR',S.q.ig+' A / '+S.q.idr+' A');P.kv('DPS',S.q.dps);P.y+=3;
  P.h2('Verificações');CHK.forEach((c,i)=>P.p((T.ck[i]?'[X] ':'[  ] ')+c+(T.ck[i]?'':' (não verificado / não aplicável)'),{s:10,lh:5.2,gap:1}));P.y+=2;
  P.h2('Recebimento pelo cliente');P.p('O cliente declara ter recebido a obra, conferido o funcionamento dos pontos, recebido orientações de uso (teste mensal dos DR, limites de carga dos circuitos, não alterar a instalação sem profissional habilitado) e aceita os serviços executados.',{s:10,lh:5,gap:3});
  P.p('Este termo não substitui a ART/TRT nem laudos específicos exigidos pela concessionária ou por outras normas (como SPDA, NBR 5419).',{s:8.5,c:[100,100,100]});
  P.p((T.cid?T.cid+', ':'')+T.data+'.',{s:10,al:'right',x:195,gap:2});P.sign(['Responsável técnico',T.rt,T.reg||''],['Cliente (recebimento)',T.cli,T.doc||'']);P.save(fn($('nm').value)+'-termo-recebimento.pdf');m.remove()}}

function docs73(){if(!Z())return;const m=mod('📑 Documentos comerciais',`<p class="text-xs" style="color:#64748b">Usa os dados da empresa (Configurações > Empresa) e do cliente (cabeçalho do projeto). Tudo fica salvo no projeto.</p><div class="grid gap-2 mt-3">${[['o','📄','Orçamento comercial completo','Materiais, mão de obra, totais, PIX e assinaturas'],['r','🧾','Recibo de pagamento','Com valor por extenso'],['g','🛡️','Termo de garantia','90 dias a 5 anos'],['t','✅','Termo de recebimento / NBR 5410','Declaração de conformidade para o cliente assinar']].map(([k,i,t,s])=>`<button class="btn ghost" data-d="${k}" style="justify-content:flex-start;text-align:left;padding:12px 14px;white-space:normal"><span style="font-size:22px">${i}</span><span><b>${t}</b><br><span style="font-weight:400;font-size:12px;color:#64748b">${s}</span></span></button>`).join('')}</div>`);
 m.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const k=b.dataset.d;m.remove();({o:orc73,r:rec73,g:gar73,t:ter73})[k]()})}
window.docs73=docs73;$('bDc').onclick=docs73;

/* ================= Wallbox (utilitários) ================= */
{const W=[['3,7 kW • monofásico 16 A',16,1,220,3.7],['7,4 kW • monofásico 32 A',32,1,220,7.4],['11 kW • trifásico 16 A',16,3,380,11],['22 kW • trifásico 32 A',32,3,380,22]],
 SC2=[[2.5,24],[4,32],[6,41],[10,57],[16,76],[25,101],[35,125]],SC3=[[2.5,21],[4,28],[6,36],[10,50],[16,68],[25,89],[35,111]],BRK=[16,20,25,32,40,50,63],DRN=[25,40,63,80],
 CD={2.5:3.7,4:4.3,6:4.9,10:6.2,16:7.4,25:9.2,35:10.6},CT=[[20,16.4],[25,21],[32,27.4],[40,34.8],[50,44],[60,55]];
 window.wall73=(box)=>{box.innerHTML=`<p class="text-xs" style="color:#64748b">Preset para estações de recarga (wallbox). Circuito exclusivo, cobre/PVC 70 °C, método B1, TN-S. Carga contínua: o cabo leva margem de 25% sobre o disjuntor.</p><label>Carregador<select id="w_p" class="in mt-1">${W.map((x,i)=>`<option value="${i}" ${i==1?'selected':''}>${x[0]}</option>`).join('')}</select></label><div class="grid grid-cols-2 gap-2"><label>Distância até o quadro (m)<input id="w_l" class="in mt-1" type="number" min="0" value="15" inputmode="decimal"></label><label>Agrupamento (FCA)<select id="w_f" class="in mt-1"><option value="1">Sozinho (1,00)</option><option value=".8">2 circuitos (0,80)</option><option value=".7">3 circuitos (0,70)</option></select></label></div><div id="w_o" class="mt-3"></div>`;
  const go=()=>{const[,I,ph,V,KW]=W[+box.querySelector('#w_p').value],L=+box.querySelector('#w_l').value||0,fc=+box.querySelector('#w_f').value,tb=ph==3?SC3:SC2,In=BRK.find(x=>x>=I),qd=s=>L?(ph==3?Math.sqrt(3):2)*.0206*L*I/s/V*100:0;
   let k=tb.findIndex(r=>r[1]*fc>=In*1.25),up=false;if(k<0){box.querySelector('#w_o').innerHTML='<p class="text-sm" style="color:#b42318">Corrente acima da tabela: dimensione manualmente.</p>';return}while(L&&qd(tb[k][0])>4&&k<tb.length-1){k++;up=true}
   const s=tb[k][0],q=qd(s),pe=s<=16?s:16,n=ph==3?5:3,S2=(ph==3?4:2)*CD[s]**2+CD[pe]**2,dn=CT.find(([,D])=>S2/(D*D)*100<=40),dr=DRN.find(x=>x>=In);
   box.querySelector('#w_o').innerHTML=`<div class="r72"><div><small>Potência</small><b>${nf(KW,1)} kW</b></div><div><small>Disjuntor (curva C)</small><b>${In} A ${ph==3?'4P':'2P'}</b></div><div><small>Cabos (fase/neutro)</small><b>${nf(s,s%1?1:0)} mm²</b></div><div><small>Terra (PE)</small><b>${nf(pe,pe%1?1:0)} mm²</b></div><div style="grid-column:1/-1"><small>DR (30 mA)</small><b>${dr} A ${ph==3?'4P':'2P'} • tipo A + proteção CC 6 mA (ou tipo B)</b></div><div><small>Eletroduto mín. (${n} cabos)</small><b>${dn?'Ø '+dn[0]+' mm':'—'}</b></div><div style="${q>4?'background:#fdecea':''}"><small>Queda (${L} m)</small><b style="color:${q>4?'#b42318':'#15803d'}">${nf(q)} %</b></div></div>${up?'<p class="text-xs mt-2" style="color:#b45309">⚠ Seção aumentada para manter a queda em até 4%.</p>':''}<p class="text-xs mt-2" style="color:#64748b">Inclua DPS classe II no quadro, aterramento TN-S e circuito exclusivo. Confirme a ABNT NBR 17019, o manual do carregador e as regras da concessionária (carga e medição).</p>`};
  box.oninput=box.onchange=go;go()}}

/* ================= Legenda dinâmica: prancha PDF ================= */
/* aplicada em pdfGo (LEGu) */
window.LEGu=()=>{const u=new Set(S.items.filter(t=>t.t=='sym').map(t=>t.k));return LEG.filter(k=>u.has(k))};
window.WIREu=()=>{const f=S.items.filter(t=>t.t=='fio');return{tr:f.some(t=>t.tp=='tr'),tue:f.some(t=>t.tp=='tue'),rm:f.some(t=>t.tp!='tr'&&t.tp!='tue'),any:f.length>0}};

/* ================= Quick Actions: botão de fechamento ================= */
document.addEventListener('click',e=>{const b=e.target.closest('#qa72 [data-q="fx"]');if(b&&sel)fecha(sel)},true);
window.fx73=t=>t&&t.t=='sym'&&FX.includes(t.k);
})();
