/* DC CAD Pro v9.0 alfa — vista-arquivo.js: mover vista, abrir arquivo .dccad no app instalado
   (bloco movido do index.html sem nenhuma alteração de lógica) */
/* v7.7: mover a vista sem bugar */
(()=>{const $=id=>document.getElementById(id);
const bad=()=>!S||!S.v||![S.v.x,S.v.y,S.v.z].every(isFinite);
function bounds(){let a=1e9,b=-1e9,c=1e9,d=-1e9;S.items.forEach(t=>{if(t.t=='room'){a=Math.min(a,t.x);b=Math.max(b,t.x+t.w);c=Math.min(c,t.y);d=Math.max(d,t.y+(t.h||0))}else if(t.t=='sym'||t.t=='txt'){a=Math.min(a,t.x);b=Math.max(b,t.x);c=Math.min(c,t.y);d=Math.max(d,t.y)}});return b<a?null:[a,b,c,d]}
function fixView(){if(!S)return;if(bad()){S.v={x:80,y:80,z:1};try{$('bFt').click()}catch(e){}return}
 const W=cv.clientWidth,H=cv.clientHeight,B=bounds();if(!B||!W||!H)return;const z=S.v.z,m=70;
 S.v.x=Math.min(W-m-B[0]*z,Math.max(m-B[1]*z,S.v.x));S.v.y=Math.min(H-m-B[2]*z,Math.max(m-B[3]*z,S.v.y))}
const _d=draw;draw=function(){try{fixView()}catch(e){}return _d.apply(this,arguments)};
/* tecla Espaço / arraste que "grudam" */
const unstick=()=>{spc=0;if(drag){drag=null;cv.style.cursor=''}};
addEventListener('blur',unstick);document.addEventListener('visibilitychange',unstick);
addEventListener('keyup',e=>{if(e.code=='Space')spc=0});
addEventListener('mousemove',e=>{if(drag&&e.isTrusted&&e.buttons===0){dispatchEvent(new MouseEvent('mouseup'))}},true);
document.addEventListener('mouseleave',()=>{if(drag&&drag.m=='pan')dispatchEvent(new MouseEvent('mouseup'))});
/* botão para voltar ao desenho quando ele sai da tela */
const b=document.createElement('button');b.id='bCt77';b.className='btn or';b.textContent='⛶ Voltar ao desenho';b.style.cssText='position:absolute;left:50%;top:12px;transform:translateX(-50%);z-index:12;display:none';
document.querySelector('#vE main').appendChild(b);b.onclick=()=>{$('bFt').click()};
setInterval(()=>{try{if(!S||$('vE').classList.contains('hidden')){b.style.display='none';return}const B=bounds();if(!B){b.style.display='none';return}const z=S.v.z,W=cv.clientWidth,H=cv.clientHeight,x0=B[0]*z+S.v.x,x1=B[1]*z+S.v.x,y0=B[2]*z+S.v.y,y1=B[3]*z+S.v.y;b.style.display=(x1<20||x0>W-20||y1<20||y0>H-20)?'':'none'}catch(e){}},700)})();
/* v7.7: abrir arquivo .dccad pelo app instalado (PC) */
if('launchQueue' in window)launchQueue.setConsumer(async p=>{try{if(!p.files||!p.files.length||!ses||ses.access_token=='local')return;const f=await p.files[0].getFile(),j=JSON.parse(await f.text()),d=j.dados||j.d;if(!d||!Array.isArray(d.items))return;delete d.pubId;const r=await DB('',{method:'POST',body:JSON.stringify({nome:(j.nome||f.name.replace(/\.\w+$/,''))+' (importado)',dados:d})});if(r&&r[0]){ro=0;roWho='';abrirProj(r[0])}}catch(e){}});
