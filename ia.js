/* DC CAD Pro — ChatDC com comandos: "faça uma planta genérica de 4 cômodos", "coloque uma tomada média 127 na sala"... (funciona offline) */
(()=>{'use strict';
const $=id=>document.getElementById(id),
Z=()=>typeof S!='undefined'&&S&&!$('vE').classList.contains('hidden'),
norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),
reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),
H=s=>esc(s),
wb=(s,w)=>new RegExp('(^|[^a-z0-9])'+reEsc(w)+'s?($|[^a-z0-9])').test(s);

/* ---------- números por extenso ---------- */
const NW={um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5,seis:6,sete:7,oito:8,nove:9,dez:10,onze:11,doze:12},
NWR='\\d{1,2}|'+Object.keys(NW).join('|'),
toN=x=>/^\d+$/.test(x)?+x:(NW[x]||1);

/* ---------- itens que a IA sabe inserir ---------- */
const PL={tb:['tomada baixa','tomadas baixas'],tm:['tomada média','tomadas médias'],ta:['tomada alta','tomadas altas'],td:['tomada dupla','tomadas duplas'],tue:['ponto de TUE','pontos de TUE'],
is:['interruptor simples','interruptores simples'],i3:['interruptor paralelo','interruptores paralelos'],i4:['interruptor four way','interruptores four way'],
luz:['luminária','luminárias'],porta:['porta','portas'],janela:['janela','janelas'],aber:['abertura','aberturas'],qgd:['quadro geral','quadros gerais'],cx:['caixa de passagem','caixas de passagem'],
camp:['campainha','campainhas'],tec:['tecla de campainha','teclas de campainha'],sp:['sensor de presença','sensores de presença'],sm:['interruptor inteligente','interruptores inteligentes'],
cam:['câmera','câmeras'],ap:['ponto Wi-Fi','pontos Wi-Fi'],cor:['motor de cortina','motores de cortina'],tv:['ponto de TV/dados','pontos de TV/dados']};
/* [regex no texto sem acento, tipo, propriedades]. A ordem importa: o mais específico primeiro. */
const SY=[
 [/chuveiro/,'tue',{nm:'Chuveiro',p:5500,v:220}],
 [/ar[ -]?condicionado|\bsplit\b|\bar cond/,'tue',{nm:'Ar cond.',p:1200,v:127}],
 [/air ?fryer|fritadeira/,'tue',{nm:'Airfryer',p:1500,v:127}],
 [/micro[ -]?ondas/,'tue',{nm:'Micro-ondas',p:1400,v:127}],
 [/forno/,'tue',{nm:'Forno elétrico',p:2000,v:127}],
 [/torneira/,'tue',{nm:'Torneira elétrica',p:3200,v:220}],
 [/\btue\b|carga dedicada|circuito dedicado|ponto de forca/,'tue',{nm:'Carga',p:1500}],
 [/tomada.{0,12}dupla|\btomada dupla/,'td',{}],
 [/tomada.{0,12}baixa/,'tb',{}],[/tomada.{0,12}media/,'tm',{}],[/tomada.{0,12}alta/,'ta',{}],
 [/tecla (da )?campainha|botao (da )?campainha|cigarra/,'tec',{}],[/campainha/,'camp',{}],
 [/interruptor.{0,14}(paralelo|three|3 vias|duas vias)|three way/,'i3',{}],
 [/four way|4 vias|intermediario/,'i4',{}],
 [/interruptor.{0,14}(inteligente|wifi|wi-fi)/,'sm',{}],
 [/interruptor|tecla/,'is',{}],
 [/luminaria|lampada|ponto de luz|iluminacao|plafon|lustre|\bspots?\b|\bluz\b|\bluzes\b/,'luz',{}],
 [/quadro (geral|de distribuicao|de luz)|\bqdc?\b|\bqgd\b/,'qgd',{}],
 [/caixa de passagem|\bcx\b/,'cx',{}],
 [/sensor de presenca|\bsensor\b/,'sp',{}],[/camera|cftv/,'cam',{}],
 [/wi-?fi|roteador|access point|ponto de rede/,'ap',{}],[/cortina/,'cor',{}],[/\btv\b|televisao|ponto de dados|internet/,'tv',{}],
 [/\bportas?\b/,'porta',{}],[/janela/,'janela',{}],[/abertura|\bvao\b/,'aber',{}],
 [/tomada/,'tb',{def:1}]];
const parseSym=s=>{for(const[r,k,o]of SY)if(r.test(s))return{k,...o};return null};

/* ---------- cômodos ---------- */
const WET=['cozinha','servico','banheiro','copa','lavanderia','lavabo','wc'],
TYPEW=['sala de jantar','sala de estar','area de servico','area externa','sala','cozinha','quarto','suite','banheiro','wc','lavabo','servico','lavanderia','copa','hall','garagem','varanda','sacada','escritorio','closet','corredor','jantar','estar','despensa','quintal'];
const rooms=()=>S.items.filter(t=>t.t=='room'&&t.h>0&&t.w>0);
function RL(){const R=rooms(),m=new Map();
 S.items.filter(t=>t.t=='txt'&&!t.note&&t.s).forEach(l=>{const c=R.filter(r=>l.x>r.x&&l.x<r.x+r.w&&l.y>r.y&&l.y<r.y+r.h).sort((a,b)=>a.w*a.h-b.w*b.h)[0];if(c&&!m.has(c))m.set(c,l.s)});
 return R.map((r,i)=>({r,name:m.get(r)||('Cômodo '+(i+1)),named:m.has(r)})).sort((a,b)=>a.r.y-b.r.y||a.r.x-b.r.x)}
const inside=(r,t,m=20)=>t.x>=r.x-m&&t.x<=r.x+r.w+m&&t.y>=r.y-m&&t.y<=r.y+r.h+m;

/* acha o(s) cômodo(s) citado(s) no texto. Devolve {list, ask?, unknown?} */
function pickRooms(s){const L=RL();if(!L.length)return{none:1,list:[]};
 if(/todos os comodos|cada comodo|em todos|todas as salas|todos os quartos|todos os banheiros/.test(s)){
  let l=L;const tw=TYPEW.find(w=>wb(s,w)&&/todos|todas/.test(s));if(tw&&!/todos os comodos/.test(s))l=L.filter(x=>norm(x.name).includes(tw));return{list:l.length?l:L}}
 let hit=L.filter(x=>wb(s,norm(x.name)));
 if(hit.length>1){const mx=Math.max(...hit.map(x=>x.name.length));hit=hit.filter(x=>x.name.length==mx)}
 if(!hit.length){for(const w of TYPEW){if(wb(s,w)){const c=L.filter(x=>norm(x.name).includes(w));if(c.length){hit=c;const m=s.match(new RegExp(reEsc(w)+'s?\\s*(?:n[o°º.]?\\s*)?(\\d{1,2})\\b'));if(m&&c.length>1&&c[+m[1]-1])hit=[c[+m[1]-1]];break}}}}
 if(!hit.length){const m=s.match(/(?:comodo|ambiente)\s+([a-z0-9]+(?:\s+\d+)?)/);if(m)return{unknown:m[1],list:[]}}
 if(!hit.length&&/\b(aqui|neste|selecionad|este comodo)/.test(s)&&sel){const r=sel.t=='room'?sel:rooms().find(x=>inside(x,sel,0));if(r){const x=L.find(y=>y.r===r);if(x)hit=[x]}}
 if(!hit.length&&L.length==1)hit=L;
 if(hit.length>1)return{ask:hit,list:[]};
 return{list:hit}}

/* ---------- geometria (igual ao gerador do app) ---------- */
const wp=(r,s,d)=>{const W=r.w,Hh=r.h,Pm=2*(W+Hh);s=((s%Pm)+Pm)%Pm;if(s<W)return{x:r.x+s,y:r.y+d,rot:0};s-=W;if(s<Hh)return{x:r.x+W-d,y:r.y+s,rot:90};s-=Hh;if(s<W)return{x:r.x+W-s,y:r.y+Hh-d,rot:180};s-=W;return{x:r.x+d,y:r.y+Hh-s,rot:270}},
ws=(r,q,tol)=>{const W=r.w,Hh=r.h;return Math.abs(q.y-r.y)<tol&&q.x>=r.x-4&&q.x<=r.x+W+4?q.x-r.x:Math.abs(q.x-r.x-W)<tol&&q.y>=r.y-4&&q.y<=r.y+Hh+4?W+q.y-r.y:Math.abs(q.y-r.y-Hh)<tol&&q.x>=r.x-4&&q.x<=r.x+W+4?W+Hh+r.x+W-q.x:Math.abs(q.x-r.x)<tol&&q.y>=r.y-4&&q.y<=r.y+Hh+4?2*W+Hh+r.y+Hh-q.y:null},
cd=(a,b,Pm)=>{const d=Math.abs(((a-b)%Pm+Pm)%Pm);return Math.min(d,Pm-d)};
const obstacles=r=>{const o=[];S.items.forEach(q=>{if(q.t!='sym')return;const s=ws(r,q,DRK.includes(q.k)?10:18);if(s!==null)o.push({s,h:DRK.includes(q.k)?(q.len||90)/2+16:18,door:DRK.includes(q.k)})});return o};
const cornersOk=(r,s)=>{const W=r.w,Hh=r.h,Pm=2*(W+Hh);return[0,W,W+Hh,2*W+Hh].every(b=>cd(s,b,Pm)>=28)};

/* melhor ponto na parede: o mais longe dos outros pontos e dos cantos */
function wallPoint(r,k){const W=r.w,Hh=r.h,Pm=2*(W+Hh),O=obstacles(r);let best=null;
 if(k=='is'||k=='i3'||k=='i4'||k=='camp'||k=='tec'){ /* interruptor: ao lado da porta */
  const dr=O.find(x=>x.door&&S.items.some(q=>q.t=='sym'&&q.k=='porta'&&ws(r,q,10)===x.s)),s0=dr?dr.s+dr.h+30:40;
  for(let j=0;j<120;j++){const c=s0+(j%2?-1:1)*Math.ceil(j/2)*10;if(cornersOk(r,c)&&O.every(x=>cd(c,x.s,Pm)>x.h+20)){return wp(r,c,14)}}}
 for(let s=0;s<Pm;s+=5){if(!cornersOk(r,s))continue;const md=O.length?Math.min(...O.map(x=>cd(s,x.s,Pm)-x.h)):cd(s,0,Pm);if(O.length&&md<20)continue;if(!best||md>best.md)best={s,md}}
 if(!best)best={s:W/2};
 return wp(r,best.s,k=='qgd'?8:14)}

/* porta / janela: escolhe a parede (porta: parede com vizinho; janela: parede externa) */
function openingPoint(r,k){const W=r.w,Hh=r.h,all=rooms().filter(o=>o!==r),
 wl=[{n:'b',rot:180,s0:W+Hh,L:W,m:[r.x+W/2,r.y+Hh+14]},{n:'l',rot:270,s0:2*W+Hh,L:Hh,m:[r.x-14,r.y+Hh/2]},{n:'t',rot:0,s0:0,L:W,m:[r.x+W/2,r.y-14]},{n:'r',rot:90,s0:W,L:Hh,m:[r.x+W+14,r.y+Hh/2]}],
 Pm=2*(W+Hh),O=obstacles(r);
 wl.forEach(w=>{w.int=all.some(o=>w.m[0]>o.x&&w.m[0]<o.x+o.w&&w.m[1]>o.y&&w.m[1]<o.y+o.h);w.n_=O.filter(x=>x.s>=w.s0-2&&x.s<=w.s0+w.L+2).length});
 const want=k=='porta'?1:0,order=wl.map((w,i)=>({w,i,sc:(w.int==!!want?0:10)+w.n_*3+i*.1})).sort((a,b)=>a.sc-b.sc),w=order[0].w,
 len=Math.max(50,Math.min(k=='janela'?100:90,w.L-40)),lo=w.s0+len/2+14,hi=w.s0+w.L-len/2-14;let best=null;
 for(let s=lo;s<=hi;s+=5){const md=O.length?Math.min(...O.map(x=>cd(s,x.s,Pm)-x.h)):cd(s,w.s0+w.L/2,Pm)*-1;if(O.length&&md<len/2)continue;const sc=O.length?md:md;if(!best||sc>best.sc)best={s,sc}}
 const s=best?best.s:w.s0+w.L/2,p=wp(r,s,0);return{x:p.x,y:p.y,rot:w.rot,len}}

/* teto: luminária, caixa, sensor, câmera */
const CEIL=['luz','cx','sp','cam'],GRID=[[.5,.5],[.25,.5],[.75,.5],[.5,.25],[.5,.75],[.25,.25],[.75,.75],[.25,.75],[.75,.25]];
function ceilPoint(r,k){const ex=S.items.filter(t=>t.t=='sym'&&CEIL.includes(t.k)&&inside(r,t,0));
 for(const[fx,fy]of GRID){const x=r.x+r.w*fx,y=r.y+r.h*fy;if(ex.every(t=>Math.hypot(t.x-x,t.y-y)>45))return{x,y,rot:0}}
 return{x:r.x+r.w/2,y:r.y+r.h/2,rot:0}}

/* ---------- criar um símbolo num cômodo ---------- */
function mkSym(x,k,o){const r=x.r,nm=norm(x.name),wet=WET.some(w=>nm.includes(w));
 const t={t:'sym',k,x:0,y:0,rot:0,c:CI[k]||'',p:PW[k]||'',cmd:'a',v:o.v?String(o.v):V0(),len:90,id:uid()};
 if(k=='porta'||k=='janela'||k=='aber'){const q=openingPoint(r,k);Object.assign(t,q,{c:'',p:'',len:q.len});return t}
 const q=CEIL.includes(k)?ceilPoint(r,k):wallPoint(r,k);Object.assign(t,{x:q.x,y:q.y,rot:CEIL.includes(k)?0:q.rot});
 if(k=='luz'){const ar=r.w*r.h/U/U;t.p=o.p?o.p+'VA':(ar<=6?100:100+60*Math.ceil((ar-6)/4))+'VA';t.c='1'}
 else if(k=='tb'||k=='tm'||k=='ta'){const n=S.items.filter(i=>i.t=='sym'&&['tb','tm','ta','td'].includes(i.k)&&inside(r,i,12)).length;t.p=o.p?o.p+'VA':((wet&&n<3)?600:100)+'VA'}
 else if(k=='td'){t.p=o.p?o.p+'VA':'200VA'}
 else if(k=='tue'){t.nm=o.nm||'Carga';t.p=(o.p||1500)+'W';t.sub=0}
 return t}

/* ---------- interpretação do texto ---------- */
const ADD=/\b(coloque|coloca|colocar|adicione|adiciona|adicionar|insira|inserir|inclua|incluir|ponha|poe|bote|instale|instalar|crie|criar|faca|fazer|desenhe|desenhar|monte|montar|gere|gerar|quero|preciso de|preciso|me de|pode (colocar|adicionar|por|inserir))\b/,
REM=/\b(remova|remover|apague|apagar|tire|tirar|exclua|excluir|delete|deletar|retire|retirar|limpe|limpar)\b/;
const qty=s=>{const m=s.match(new RegExp('\\b('+NWR+')\\s+(?:tomada|tomadas|luminaria|luminarias|lampada|lampadas|ponto|pontos|interruptor|interruptores|chuveiro|chuveiros|porta|portas|janela|janelas|sensor|sensores|camera|cameras|ar|forno|fornos|airfryer|air|tue|spot|spots|caixa|caixas|campainha|campainhas|tv|torneira|micro|split|cortina|cortinas|abertura|aberturas|roteador|quadro|tecla|teclas)'));return m?Math.min(12,toN(m[1])):1},
volt=s=>{const m=s.match(/\b(127|220|110)\s*(?:v|volts?)?\b/);return m?(m[1]=='110'?127:+m[1]):null},
power=s=>{const m=s.match(/(\d[\d.,]*)\s*(kw|w|watts?|va)\b/);if(!m)return null;let n=parseFloat(m[1].replace(/\./g,'').replace(',','.'));if(m[2]=='kw')n*=1000;return Math.round(n)||null},
dims=s=>{const m=s.match(/(\d+(?:[.,]\d+)?)\s*(?:m\b)?\s*(?:x|por|\*)\s*(\d+(?:[.,]\d+)?)/);if(!m)return null;let a=parseFloat(m[1].replace(',','.')),b=parseFloat(m[2].replace(',','.'));if(a>30)a/=100;if(b>30)b/=100;return a>=1&&b>=1&&a<=30&&b<=30?[a,b]:null};
const chip=(t,cmd)=>`<button class="ia-chip" data-ia="cmd" data-cmd="${H(cmd)}">${t}</button>`,
done=(t,more)=>`${t}<div class="ia-ac">${chip('↶ Desfazer','desfazer')}${more||''}</div>`;
const finish=()=>{pp(1);auto();draw()};

/* ---------- plano genérico ---------- */
const SZ={sala:[4.5,3.5],cozinha:[3,3.5],quarto:[3.5,3],banheiro:[2,2.5],servico:[2.2,2.5],varanda:[3,2],garagem:[3,5],escritorio:[3,3],hall:[2,2],copa:[3,3],suite:[3.5,3.5],closet:[2,2],lavabo:[1.5,2],corredor:[1.2,3]},
ORDER=['Sala','Cozinha','Banheiro','Quarto','Quarto','Área de serviço','Varanda','Banheiro','Quarto','Escritório','Garagem','Quarto'],
tkey=n=>{const s=norm(n);return s.includes('servico')||s.includes('lavanderia')?'servico':Object.keys(SZ).find(k=>s.includes(k))||'quarto'},
numerar=a=>{const c={};a.forEach(n=>c[n]=(c[n]||0)+1);const u={};return a.map(n=>{if(c[n]<2)return n;u[n]=(u[n]||0)+1;return n+' '+u[n]})};
function planNames(s){let n=null,q=null;
 let m=s.match(new RegExp('\\b('+NWR+')\\s*(?:comodos|ambientes|pecas|divisoes|compartimentos)'));if(m)n=toN(m[1]);
 m=s.match(new RegExp('\\b('+NWR+')\\s*(?:quartos?|dormitorios?|suites?)'));if(m)q=toN(m[1]);
 const ex=[];if(/garagem/.test(s))ex.push('Garagem');if(/varanda|sacada/.test(s))ex.push('Varanda');if(/escritorio/.test(s))ex.push('Escritório');if(/area de servico|lavanderia/.test(s))ex.push('Área de serviço');if(/suite/.test(s)&&q==null)ex.push('Suíte');
 let a;
 if(q!=null){a=['Sala','Cozinha','Banheiro'];if(q>=2)a.push('Área de serviço');for(let i=0;i<q;i++)a.push('Quarto');if(q>=3)a.push('Banheiro');
  ex.forEach(e=>{if(!a.includes(e))a.push(e)})}
 else if(n!=null){a=ORDER.slice(0,Math.min(12,n));ex.forEach(e=>{if(!a.includes(e)&&a.length<12)a.push(e)})}
 else return null;
 return numerar(a)}
function makePlan(names){const R=rooms(),x0=R.length?Math.max(...R.map(r=>r.x+r.w))+100:100,y0=R.length?Math.min(...R.map(r=>r.y)):100,m=v=>Math.round(v*100/5)*5,
 social=[],intima=[];names.forEach(n=>{const k=tkey(n);(['sala','cozinha','servico','varanda','garagem','copa','hall'].includes(k)?social:intima).push({n,k})});
 if(!social.length&&intima.length>1)social.push(intima.shift());
 const rows=[social,intima].filter(a=>a.length),items=[],made=[];let y=y0;
 rows.forEach((row,ri)=>{const h=Math.max(...row.map(o=>SZ[o.k][1])),pref=row[0];let x=x0;
  row.forEach((o,i)=>{const[w]=SZ[o.k],r={t:'room',x:m(x/100)>0?Math.round(x/5)*5:x,y:Math.round(y/5)*5,w:m(w),h:m(h)};items.push(r);
   items.push({t:'txt',x:r.x+r.w/2,y:r.y+r.h/2+38,s:o.n,big:1});made.push({r,o,ri,i,first:i==0&&ri==0});x+=m(w)});
  y+=m(h)});
 const syms=[];
 made.forEach(({r,o,ri,i,first})=>{const mk=(k,x,yy,rot,len)=>syms.push({t:'sym',k,x,y:yy,rot,c:'',p:'',cmd:'a',v:V0(),len,id:uid()});
  const dl=o.k=='banheiro'||o.k=='lavabo'?70:80;
  if(first)mk('porta',r.x+r.w*.28,r.y,0,90); /* entrada */
  else if(ri==0)mk('porta',r.x,r.y+r.h*.5,270,dl);
  else mk('porta',r.x+Math.min(r.w*.4,r.w-dl/2-12),r.y,0,dl);
  const jl=Math.min(o.k=='banheiro'||o.k=='lavabo'?50:100,r.w-40);
  if(ri==0)mk('janela',r.x+r.w*.72,r.y,0,jl);else mk('janela',r.x+r.w/2,r.y+r.h,180,jl)});
 S.items.push(...items,...syms);sel=null;
 return{n:made.length,x0,y0}}

/* quarto/cômodo avulso */
const NOMES={'sala de jantar':'Sala de jantar','sala de estar':'Sala de estar','area de servico':'Área de serviço','area externa':'Área externa',sala:'Sala',cozinha:'Cozinha',quarto:'Quarto',suite:'Suíte',banheiro:'Banheiro',wc:'WC',lavabo:'Lavabo',servico:'Área de serviço',lavanderia:'Lavanderia',copa:'Copa',hall:'Hall',garagem:'Garagem',varanda:'Varanda',sacada:'Sacada',escritorio:'Escritório',closet:'Closet',corredor:'Corredor',jantar:'Sala de jantar',estar:'Sala de estar',despensa:'Despensa',quintal:'Quintal'};
function addRoom(s){const w=TYPEW.find(w=>wb(s,w));if(!w)return null;
 let nome=NOMES[w]||w;const nm=s.match(new RegExp(reEsc(w)+'s?\\s*(?:n[o°º.]?\\s*)?(\\d{1,2})\\b(?!\\s*(?:x|por|m\\b))'));if(nm)nome+=' '+nm[1];
 const k=tkey(nome),d=dims(s)||SZ[k]||[3,3],R=rooms(),W=Math.round(d[0]*100/5)*5,Hh=Math.round(d[1]*100/5)*5;
 let x=100,y=100;if(R.length){const rm=R.reduce((a,b)=>b.x+b.w>a.x+a.w?b:a);x=rm.x+rm.w;y=rm.y}
 const r={t:'room',x,y,w:W,h:Hh};S.items.push(r,{t:'txt',x:x+W/2,y:y+Hh/2+38,s:nome,big:1});sel=r;return{nome,w:d[0],h:d[1]}}

/* ---------- ações ---------- */
const fmt=n=>(+n).toLocaleString('pt-BR',{maximumFractionDigits:1});
const askRoom=(list,q,verbo)=>`Em qual cômodo? ${verbo||''}<div class="ia-ac">${list.map(x=>chip(H(x.name),q+' no cômodo '+x.name)).join('')}</div>`;
const roomList=()=>RL().map(x=>x.name);

async function actSym(s,q0,mode){const sy=parseSym(s);if(!sy)return undefined;
 const rr=pickRooms(s);
 if(rr.none)return'Ainda não há cômodos no projeto. Peça por exemplo: <b>"faça uma planta genérica de 4 cômodos"</b> e depois insira os itens.';
 if(rr.unknown)return`Não encontrei o cômodo <b>${H(rr.unknown)}</b>. Cômodos do projeto: ${roomList().map(n=>'<b>'+H(n)+'</b>').join(', ')}.`;
 if(rr.ask)return askRoom(rr.ask,q0,'Há mais de um cômodo com esse nome.');
 let list=rr.list;
 if(!list.length){const L=RL();return askRoom(L,q0)}
 if(mode=='rem'){let n=0;const k=sy.k,sels=sy.def?['tb','tm','ta','td']:[k];
  const tgt=list.flatMap(x=>S.items.filter(t=>t.t=='sym'&&sels.includes(t.k)&&inside(x.r,t,12)));
  if(!tgt.length)return`Não há ${PL[k][1]} em ${list.map(x=>'<b>'+H(x.name)+'</b>').join(', ')}.`;
  if(!await yes(`Remover ${tgt.length} ${tgt.length>1?PL[k][1]:PL[k][0]} de ${list.map(x=>x.name).join(', ')}?`))return'Tudo bem, não removi nada.';
  S.items=S.items.filter(t=>!tgt.includes(t));sel=null;finish();return done(`🗑 Removi <b>${tgt.length}</b> ${tgt.length>1?PL[k][1]:PL[k][0]}.`)}
 const n=qty(s),v=volt(s),pw=power(s),out=[];let k=sy.k;
 if(sy.def&&!/tomada/.test(s))k=sy.k;
 const o={v:v||sy.v,p:pw||sy.p,nm:sy.nm};
 if(k=='tue'&&!v&&sy.v&&!AV().includes(sy.v))o.v=null; /* projeto sem 220 V: usa a tensão do projeto */
 let last=null;
 for(const x of list)for(let i=0;i<n;i++){const t=mkSym(x,k,o);S.items.push(t);last=t;out.push(x.name)}
 sel=last;finish();
 const tot=n*list.length,nomeK=tot>1?PL[k][1]:PL[k][0],uv=last.v,pot=last.p||'';
 const un=[...new Set(out)];
 let nota='';if(v&&!AV().includes(v))nota=`<br><small>⚠ O projeto está em ${AV().join('/')} V. Para usar ${v} V mude o fornecimento em <b>⚙ Quadro</b>.</small>`;
 if(k=='tue'&&o.nm)nota+=`<br><small>Circuito dedicado: confira o disjuntor e o cabo em <b>⚙ Quadro</b>.</small>`;
 const dt=k=='porta'||k=='janela'||k=='aber'?'':` (${uv} V${pot?', '+pot:''})`;
 return done(`✅ Adicionei <b>${tot} ${nomeK}</b>${dt} ${list.length>1?'em <b>'+list.length+' cômodos</b>':'em <b>'+H(un[0])+'</b>'}.${nota}`,k=='tue'?'':chip('⚡ Gerar elétrica','gerar a elétrica'))}

async function actRoom(s){const w=TYPEW.find(w=>wb(s,w));if(!w)return undefined;
 const r=addRoom(s);if(!r)return undefined;finish();try{$('bFt').click()}catch(e){}
 return done(`🏠 Criei o cômodo <b>${H(r.nome)}</b> (${fmt(r.w)} × ${fmt(r.h)} m), encostado no último cômodo.`,chip('🚪 Porta na '+H(r.nome.toLowerCase()),'coloque uma porta na '+r.nome)+chip('💡 Luminária','coloque uma luminária na '+r.nome))}

async function actPlan(s,q0){const names=planNames(s);
 if(!names)return`Quantos cômodos? Posso montar uma planta genérica pelo número de cômodos ou de quartos.<div class="ia-ac">${[2,3,4,5,6].map(n=>chip(n+' cômodos','faça uma planta genérica de '+n+' cômodos')).join('')}${chip('Casa de 2 quartos','faça uma planta de casa com 2 quartos')}${chip('Casa de 3 quartos','faça uma planta de casa com 3 quartos')}</div>`;
 const r=makePlan(names);finish();try{$('bFt').click()}catch(e){}
 return done(`🏠 Pronto! Montei uma planta com <b>${r.n} cômodos</b>: ${names.map(n=>H(n)).join(', ')} — com portas, janelas e os nomes de cada cômodo.<br><small>Você pode arrastar as paredes para ajustar as medidas.</small>`,chip('⚡ Gerar elétrica','gerar a elétrica')+chip('🔌 Tomada média na sala','coloque uma tomada média 127 na sala'))}

async function actGerar(){await gerar();return'⚡ Pronto! A elétrica foi gerada (se você cancelou alguma pergunta, rode de novo). Veja os circuitos em <b>⚙ Quadro</b>.'}

function actCount(s){const R=RL();
 if(/comodos/.test(s))return`O projeto tem <b>${R.length}</b> cômodo${R.length==1?'':'s'}${R.length?': '+R.map(x=>'<b>'+H(x.name)+'</b>').join(', '):''}.`;
 if(/circuitos/.test(s)){try{return`O projeto tem <b>${circs().length}</b> circuito(s).`}catch(e){return undefined}}
 const sy=parseSym(s);const kinds=/interruptor/.test(s)?['is','i3','i4','sm']:sy?(sy.def?['tb','tm','ta','td']:[sy.k]):/pontos|simbolos|itens/.test(s)?null:undefined;
 if(kinds===undefined)return undefined;
 const rr=pickRooms(s);let tgt=S.items.filter(t=>t.t=='sym'&&(!kinds||(kinds.includes(t.k)&&true)));
 let onde='no projeto';
 if(rr.list.length&&!rr.none){tgt=tgt.filter(t=>rr.list.some(x=>inside(x.r,t,12)));onde='em '+rr.list.map(x=>'<b>'+H(x.name)+'</b>').join(', ')}
 const nome=kinds&&sy?PL[sy.k][1]:kinds?'interruptores':'pontos';
 return`Há <b>${tgt.length}</b> ${nome} ${onde}.`}

const AJUDA=`Eu entendo comandos! Exemplos:
<ul class="ia-ls"><li><b>Faça uma planta genérica de 4 cômodos</b></li><li><b>Casa com 3 quartos</b></li><li><b>Coloque uma tomada média 127 na cozinha</b></li><li><b>2 tomadas altas 220V no quarto 2</b></li><li><b>Luminária em todos os cômodos</b></li><li><b>Chuveiro 5500W no banheiro</b></li><li><b>Adicione um quarto de 3x4</b></li><li><b>Quantas tomadas tem na sala?</b></li><li><b>Remova as luminárias do quarto</b></li><li><b>Gerar elétrica</b> · <b>Desfazer</b> · <b>Enquadrar</b></li></ul>E também respondo dúvidas da NBR 5410 (DR, DPS, cores dos fios, queda de tensão…).`;

/* ---------- roteador de comandos ---------- */
async function run(q){if(!Z())return null;const s=norm(q).replace(/[?!.]+$/,'').trim(),add=ADD.test(s),rem=REM.test(s);
 if(/^(o que (voce|vc|tu) (faz|sabe|consegue)|ajuda|comandos|help|como (usar|funciona))/.test(s))return AJUDA;
 if(/^(desfaz|desfazer|volta|voltar|undo|cancela)/.test(s)){const b=$('bUn');if(b)b.click();return'↶ Desfeito.'}
 if(/\b(enquadr|centraliz|mostrar tudo|ver tudo|ajustar a tela)/.test(s)){$('bFt').click();return'⛶ Enquadrei o desenho na tela.'}
 {const m=q.match(/renome\w*\s+(?:o\s+)?projeto\s+(?:para|como|de)\s+(.+)/i);if(m){const n=m[1].trim().slice(0,80);$('nm').value=n;$('nm').dispatchEvent(new Event('input'));return`✏️ Projeto renomeado para <b>${H(n)}</b>.`}}
 if(rem&&/\b(tudo|toda a planta|a planta|o projeto|todos os comodos|desenho)\b/.test(s)&&!parseSym(s)&&!TYPEW.some(w=>wb(s,w))){
  if(!S.items.length)return'A planta já está vazia.';if(!await yes('Apagar TUDO da planta atual?'))return'Tudo bem, não apaguei nada.';S.items=[];sel=null;finish();return done('🧹 Planta limpa.')}
 if(rem&&parseSym(s))return actSym(s,q,'rem');
 if(rem&&/\b(tudo|todos os itens|todas as tomadas)\b/.test(s)){const rr=pickRooms(s);if(rr.list.length&&!rr.ask){const tgt=rr.list.flatMap(x=>S.items.filter(t=>t.t=='sym'&&!DRK.includes(t.k)&&inside(x.r,t,12)));if(!tgt.length)return'Não há itens elétricos nesse cômodo.';if(!await yes(`Remover ${tgt.length} item(ns) elétricos de ${rr.list.map(x=>x.name).join(', ')}?`))return'Tudo bem, não removi nada.';S.items=S.items.filter(t=>!tgt.includes(t));sel=null;finish();return done(`🗑 Removi <b>${tgt.length}</b> itens.`)}}
 if(/(gera|gere|gerar|monte|montar|faca|fazer|crie|criar|calcule|calcular|rode|rodar)\b.*\b(eletrica|instalacao eletrica|circuitos)\b/.test(s)&&!/planta|casa|apartamento/.test(s))return actGerar();
 if(/^(gerar|gere) (a )?eletrica/.test(s))return actGerar();
 if((add||/\b(planta|casa|apartamento|apto|kitnet|residencia)\b/.test(s))&&(/\b(planta|casa|apartamento|apto|kitnet|residencia)\b/.test(s)||new RegExp('\\b('+NWR+')\\s*(comodos|ambientes)').test(s))&&!parseSym(s)&&!/quantos|quantas/.test(s))return actPlan(s,q);
 if(/\bquant(as|os)\b/.test(s)&&/\b(tem|existe|ha|tenho|temos|ja|projeto|nessa|nesse|na|no)\b/.test(s)){const r=actCount(s);if(r)return r}
 if((add||/\b(no|na|nos|nas|em|do|da)\b.*\b(comodo|sala|cozinha|quarto|banheiro|suite|area|varanda|garagem|escritorio|hall|copa|todos)/.test(s))&&parseSym(s)&&!/\b(quanto|quantos|quantas|qual|como|por que|porque|precisa|devo|posso|pode ter|obrigatori|norma|nbr)\b/.test(s))return actSym(s,q,'add');
 if(add&&!parseSym(s)&&TYPEW.some(w=>wb(s,w))&&/\b(comodo|ambiente|quarto|sala|cozinha|banheiro|suite|varanda|garagem|escritorio|hall|copa|lavabo|closet|corredor|despensa|quintal|lavanderia|area de servico)\b/.test(s)){const r=await actRoom(s);if(r)return r}
 return null}

window.ia77={run,help:AJUDA};

/* botões dentro das respostas do chat */
document.addEventListener('click',e=>{const b=e.target.closest('#m73 [data-ia]');if(!b)return;
 const i=$('i73'),go=document.querySelector('#ch73 [data-c="go"]');if(!i||!go)return;
 i.value=b.dataset.cmd;go.click()});
})();
