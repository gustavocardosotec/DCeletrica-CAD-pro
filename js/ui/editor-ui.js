/* DC CAD Pro v9.0.1 — editor-ui.js: novo layout da tela do editor (PC e celular)
   Não muda nenhuma função do CAD: só REORGANIZA onde cada botão fica.
   Os botões originais (mesmos IDs e mesmos comandos) são movidos para:
     - barra superior (#eui-top)   - trilho de ferramentas (#eui-rail)
     - barra de status (#eui-sb)   - botões de inserir (#eui-dock)
   O que sobra do cabeçalho antigo fica escondido e é acionado pelo menu "⋯" (#eui-more) e pelo trilho.
   Carrega DEPOIS de todos os scripts do editor (eles criam botões que este arquivo precisa encontrar). */
(()=>{'use strict';
const $=id=>document.getElementById(id),vE=$('vE'),root=document.documentElement;
if(!vE)return;
const eh=vE.querySelector('.eh'),wk=$('wk71'),main=vE.querySelector('main');
if(!eh||!wk||!main)return;
const MB=()=>root.classList.contains('mob');
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const click=id=>{const b=$(id);if(b)b.click()};

/* ---------- 1) Barra superior ---------- */
const top=el('header');top.id='eui-top';
const gl=el('div','eg eg-l'),gc=el('div','eg eg-c'),gr=el('div','eg eg-r');top.append(gl,gc,gr);
const take=(id,g,c,t)=>{const b=$(id);if(!b)return null;b.classList.add('eb');if(c)c.split(' ').forEach(k=>b.classList.add(k));if(t)b.title=t;g.appendChild(b);return b};
const dv=()=>el('span','dv');
/* esquerda: voltar + nome do projeto */
take('bBk',gl,'','Voltar aos projetos');
{const nm=$('nm');if(nm){nm.classList.remove('nmi');nm.setAttribute('placeholder','Nome do projeto');gl.appendChild(nm)}}
/* centro: desfazer/refazer + exibir */
take('bUn',gc,'','Desfazer (Ctrl+Z)');take('bRd',gc,'','Refazer (Ctrl+Y)');gc.appendChild(dv());take('bVw',gc,'','O que mostrar na tela');
/* direita: projeto + ações principais + mais */
take('bQd',gr,'','Quadro, concessionária e circuitos');take('bDc',gr,'','Documentos: orçamento, recibo, garantia e termos');take('bCalc',gr,'','Calculadora rápida (NBR 5410)');gr.appendChild(dv());
take('bGe',gr,'pri','Gerar a parte elétrica do desenho');take('bSh',gr,'sec','Gerar PDF do projeto');take('bSv',gr,'','Salvar');
let mb=$('bMoreE');if(!mb){mb=el('button','sp');mb.id='bMoreE';mb.type='button';mb.textContent='⋯'}
mb.classList.remove('btn','ghost','mobonly');mb.classList.add('eb');mb.title='Mais opções';mb.setAttribute('aria-label','Mais opções');gr.appendChild(mb);
vE.prepend(top);

/* ---------- 2) Trilho de ferramentas (esquerda no PC, embaixo no celular) ---------- */
const rail=el('aside');rail.id='eui-rail';rail.setAttribute('aria-label','Ferramentas de desenho');
const rm=el('div','er-main'),rq=el('div','er-quick'),re=el('div','er-end');rail.append(rm,rq,re);
{const bt=$('bt71'),qk=$('qk71');if(bt){bt.title='Todas as ferramentas (busca e categorias)';rm.appendChild(bt)}if(qk)rq.appendChild(qk)}
const px=(id,ic,lb,t,cls)=>{const b=el('button','er-b'+(cls?' '+cls:''),'<i>'+ic+'</i><span>'+lb+'</span>');b.type='button';b.dataset.p=id;b.title=t;b.setAttribute('aria-label',t);b.onclick=()=>click(id);re.appendChild(b);return b};
px('b72','📐','Desenho','Régua, pincel, destaque, marca d’água e WhatsApp');
px('b7','🛠','Avançado','Auditar NBR, orçamento, unifilar, camadas e mais');
px('bFt','⛶','Enquadrar','Enquadrar tudo na tela','fit');
const bch=px('bCh','🤖','ChatDC','ChatDC NBR: assistente da NBR 5410');
wk.insertBefore(rail,wk.firstChild);
{const ch=$('ch73');if(ch){const s=()=>bch.classList.toggle('on',!ch.classList.contains('hidden'));s();new MutationObserver(s).observe(ch,{attributes:true,attributeFilter:['class']})}}

/* ---------- 3) Barra de status (só PC): dica da ferramenta, tempo, nuvem, estado e zoom ---------- */
const sb=el('div');sb.id='eui-sb';
{const h=$('hint');if(h)sb.appendChild(h)}
const sbr=el('div','sbr');sb.appendChild(sbr);
{const st=$('st'),cl=$('cl7');if(st){const list=[];let x=(cl&&cl.parentNode===eh)?cl:st;while(x){list.push(x);if(x===st)break;x=x.nextElementSibling}list.forEach(e=>sbr.appendChild(e))}}
const zm=el('div','zm'),zv=el('button','','100%');zv.id='eui-zv';zv.type='button';zv.title='Enquadrar tudo';zv.onclick=()=>click('bFt');
{const a=$('bZm'),b=$('bZp'),f=$('bFt');if(a){a.title='Menos zoom';zm.appendChild(a)}zm.appendChild(zv);if(b){b.title='Mais zoom';zm.appendChild(b)}if(f){f.title='Enquadrar tudo';zm.appendChild(f)}}
sbr.appendChild(zm);wk.after(sb);
let lz=null;setInterval(()=>{if(vE.classList.contains('hidden'))return;let z=null;try{z=(typeof S!=='undefined'&&S&&S.v)?S.v.z:null}catch(e){}if(z==null||z===lz)return;lz=z;zv.textContent=Math.round(z*100)+'%'},250);

/* ---------- 4) Botões "Concluir" e "Inserir no centro" ---------- */
const dock=el('div');dock.id='eui-dock';[$('bEnd'),$('bAd')].forEach(b=>{if(b)dock.appendChild(b)});main.appendChild(dock);

/* ---------- 5) Menu "⋯ Mais" (dropdown no PC, folha de baixo no celular) ---------- */
/* máscara: 0 = PC e celular | 1 = só celular (no PC já está na tela) */
const SEC=[
 ['Arquivo',[['💾','Salvar','bSv',1],['📄','Gerar PDF','bSh',1],['⬇','Baixar projeto (.dccad)','bDl',0],['⬆','Abrir arquivo','bUl',0]]],
 ['Projeto',[['⚙️','Quadro e circuitos','bQd',1],['📑','Documentos','bDc',0],['🧮','Calculadora','bCalc',0],['🧰','Utilitários','bUt',0]]],
 ['Desenho',[['📐','Régua, pincel e mais','b72',1],['🛠','Auditar NBR e mais','b7',1],['🤖','ChatDC NBR','bCh',1]]],
 ['Vista',[['⛶','Enquadrar tudo','bFt',1],['👁','Exibir na tela','bVw',0],['＋','Zoom +','bZp',1],['−','Zoom −','bZm',1]]],
 ['Editar',[['↶','Desfazer','bUn',1],['↷','Refazer','bRd',1],['⧉','Duplicar','bDu',0],['⟳','Girar','bRo',0]]],
 ['Ajuda',[['💬','Enviar feedback','bFb2',0],['🆘','Suporte','bSp2',0]]]
];
const closeMore=()=>{const o=$('eui-more');if(o)o.remove()};
function openMore(){
 const had=$('eui-more');closeMore();if(had&&!MB())return;
 const mob=MB(),o=el('div'),sh=el('div','sh');o.id='eui-more';sh.innerHTML='<div class="gp"></div><h4></h4>';
 sh.querySelector('h4').textContent=($('nm')&&$('nm').value)||'Projeto';
 let first=true;
 SEC.forEach(([t,its])=>{
  const rows=its.filter(([,,id,m])=>{const s=$(id);return s&&s.style.display!=='none'&&(!m||mob)});
  if(!rows.length)return;
  if(!first&&!mob)sh.appendChild(el('hr'));first=false;
  const h=el('h5');h.textContent=t;sh.appendChild(h);
  const row=el('div','row');
  rows.forEach(([ic,lb,id])=>{const s=$(id),b=el('button','mi'+(s.classList.contains('has')?' has':''),'<i>'+ic+'</i><span></span>');b.type='button';b.lastChild.textContent=lb;b.onclick=()=>{closeMore();setTimeout(()=>s.click(),50)};row.appendChild(b)});
  sh.appendChild(row)});
 o.appendChild(sh);o.onclick=e=>{if(e.target===o)closeMore()};document.body.appendChild(o)}
mb.onclick=e=>{e.stopPropagation();openMore()};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMore()});
/* bolinha vermelha quando há resposta do suporte */
{const syncDot=()=>{const has=['bSp','bSp2'].some(i=>$(i)&&$(i).classList.contains('has'));mb.classList.toggle('has',has)};
 ['bSp','bSp2'].forEach(i=>{const b=$(i);if(b)new MutationObserver(syncDot).observe(b,{attributes:true,attributeFilter:['class']})});syncDot()}
window.euiMore=openMore;

/* ---------- 6) Detalhes ---------- */
/* resumo da carga começa recolhido (uma pílula pequena); o usuário expande quando quiser */
try{if(localStorage.getItem('dce_rc')===null)localStorage.setItem('dce_rc','1')}catch(e){}
/* o desenho acompanha qualquer mudança de tamanho do espaço (painéis abrindo/fechando, teclado do celular...) */
if('ResizeObserver' in window){let t=0;new ResizeObserver(()=>{clearTimeout(t);t=setTimeout(()=>dispatchEvent(new Event('resize')),30)}).observe(main)}
})();
