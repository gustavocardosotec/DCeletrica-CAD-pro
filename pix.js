/* DC CAD Pro 7.6 alfa — Pix e WhatsApp: cartão em canvas com a cor e a logo do banco, QR, chave e titular (offline) */
(()=>{'use strict';
const K='dce_pay75',$=id=>document.getElementById(id),E=s=>String(s==null?'':s).replace(/[&<>\"']/g,c=>'&#'+c.charCodeAt(0)+';'),
uid=()=>Math.random().toString(36).slice(2,9),
tst=m=>{let t=$('t75');if(!t){t=document.createElement('div');t.id='t75';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99999;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',2500)};

/* ---------- bancos: id, nome, cor 1, cor 2, cor do texto, arquivo em /Logos Bancos/, recorte [x,y,l,a], modo, sigla ----------
   modo: s = logo já é um quadrado colorido | c = círculo | w = logo sobre fundo branco | sw = logo larga com fundo próprio */
const LD='/Logos%20Bancos/';
const BK=[
['nu','Nubank','#820ad1','#4b0584','#fff','Nubank.png',0,'s','Nu'],
['itau','Itaú','#ec7000','#a24b00','#fff','Itaú.png',[17,16,286,288],'s','Itaú'],
['bra','Bradesco','#cc092f','#7a041b','#fff','Bradesco.png',0,'w','B'],
['bb','Banco do Brasil','#fae128','#d2b200','#003882','Banco do Brasil.png',0,'s','BB'],
['cef','Caixa','#0070af','#00426a','#fff','Caixa.png',[30,239,540,122],'w','CX'],
['san','Santander','#ec0000','#8c0000','#fff','Santander.png',0,'s','S'],
['int','Inter','#ff7a00','#b04e00','#fff','Inter.png',0,'s','in'],
['c6','C6 Bank','#262626','#000','#fff','C6.png',0,'s','C6'],
['pic','PicPay','#21c25e','#0b7a38','#fff','PicPay.png',0,'c','Pic'],
['mp','Mercado Pago','#00b1ea','#00709a','#fff','Mercado Pago.png',0,'s','MP'],
['pb','PagBank','#e1e24f','#a3a51c','#111','PagBank.png',[543,1434,2997,1243],'w','PB'],
['sicr','Sicredi','#3fa110','#256508','#fff','Sicredi.png',[47,104,406,294],'w','Si'],
['sico','Sicoob','#00535c','#00353e','#fff','Sicoob.png',0,'sw','Sc'],
['neon','Neon','#00b8e0','#0070b8','#fff','Neon.png',[544,216,3008,668],'w','Ne'],
['orig','Banco Original','#00ab4e','#06693a','#fff','Original.png',[88,584,1424,432],'w','Or'],
['btg','BTG Pactual','#0a2540','#04101d','#fff',null,0,'s','BTG'],
['out','Outro banco','#475569','#1e293b','#fff',null,0,'s','🏦']];
const WAB=['wa','WhatsApp','#25D366','#075e54','#fff','Whatsapp.png',[244,243,492,494],'w','WA'];
const bk=id=>BK.find(b=>b[0]==id)||BK[BK.length-1];
const TP={cpf:'CPF',cnpj:'CNPJ',tel:'Celular',mail:'E-mail',aleat:'Chave aleatória'};

/* ---------- logos (carrega, recorta e guarda; se faltar o arquivo, usa a sigla) ---------- */
const LG={};let lgP=null,lgDone=false;
const imgL=u=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u});
async function mkLogo(b){if(!b[5])return;const im=await imgL(b[5]=='Whatsapp.png'?'/Whatsapp.png':LD+encodeURIComponent(b[5]));if(!im||!im.naturalWidth)return;
 const cr=b[6]||[0,0,im.naturalWidth,im.naturalHeight],sc=Math.min(1,420/Math.max(cr[2],cr[3])),c=document.createElement('canvas');c.width=Math.max(1,Math.round(cr[2]*sc));c.height=Math.max(1,Math.round(cr[3]*sc));
 c.getContext('2d').drawImage(im,cr[0],cr[1],cr[2],cr[3],0,0,c.width,c.height);try{LG[b[0]]={c,u:c.toDataURL('image/png'),w:c.width,h:c.height}}catch(e){}}
const logosReady=()=>lgP||(lgP=(async()=>{for(const b of BK.concat([WAB])){try{await mkLogo(b)}catch(e){}}try{await document.fonts.load('800 40px Inter')}catch(e){}lgDone=true})());

/* selo pequeno em HTML (listas, seletor) */
const badge=(id,s=44)=>{const b=id=='wa'?WAB:bk(id),l=LG[id];
 if(l){const m=b[7],r=m=='c'?'50%':Math.round(s*.28)+'px';
  if(m=='s'||m=='c')return`<img src="${l.u}" alt="${E(b[1])}" style="flex:none;width:${s}px;height:${s}px;border-radius:${r};object-fit:cover;display:inline-block">`;
  return`<span style="flex:none;display:inline-grid;place-items:center;width:${s}px;height:${s}px;border-radius:${r};background:${m=='sw'?b[3]:'#fff'};border:1px solid #dbe3ec;padding:${Math.round(s*.1)}px"><img src="${l.u}" alt="${E(b[1])}" style="max-width:100%;max-height:100%;object-fit:contain"></span>`}
 return`<span style="flex:none;display:inline-grid;place-items:center;width:${s}px;height:${s}px;border-radius:${Math.round(s*.28)}px;background:${b[2]};color:${b[4]};font:800 ${Math.round(s*(b[8].length>2?.3:.4))}px Inter,system-ui,sans-serif;letter-spacing:-.5px">${E(b[8])}</span>`};
const WA=(s=44)=>LG.wa?badge('wa',s):`<svg width="${s}" height="${s}" viewBox="0 0 48 48" aria-label="WhatsApp" style="flex:none"><rect width="48" height="48" rx="13" fill="#25D366"/><path d="M24 9.5a14.4 14.4 0 0 0-12.3 21.8L9.8 38l7-1.8A14.4 14.4 0 1 0 24 9.5z" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><path transform="translate(9.3 9.3) scale(1.2)" d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" fill="#fff"/></svg>`;

/* ---------- dados (local + conta) ---------- */
const load=()=>{let d=null;try{d=JSON.parse(localStorage.getItem(K))}catch(e){}if(!d||!Array.isArray(d.pix)||!Array.isArray(d.wa)){d={pix:[],wa:[],t:0};
  try{const m=ses&&ses.user&&ses.user.user_metadata&&ses.user.user_metadata.pagamentos;if(m&&Array.isArray(m.pix)){d=m}}catch(e){}}return d};
let D=load();
async function save(){D.t=Date.now();try{localStorage.setItem(K,JSON.stringify(D))}catch(e){tst('Sem espaço para salvar');return}
 try{if(navigator.onLine&&ses&&ses.access_token&&ses.access_token!='local'){const r=await fetch(CFG.url+'/auth/v1/user',{method:'PUT',headers:UH(),body:JSON.stringify({data:{pagamentos:D}})});if(r.ok){ses.user=await r.json();localStorage.setItem('dce_ses',JSON.stringify(ses))}}}catch(e){}}
setInterval(()=>{try{if(!D.pix.length&&!D.wa.length){const d=load();if(d.pix.length||d.wa.length){D=d;try{localStorage.setItem(K,JSON.stringify(D))}catch(e){}}}}catch(e){}},4000);

/* ---------- Pix BR Code (estático) ---------- */
const crc=s=>{let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')},
tlv=(i,v)=>i+String(v.length).padStart(2,'0')+v,asc=(s,n)=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,'').toUpperCase().trim().slice(0,n),
fkey=p=>{const k=String(p.chave||'').trim();if(p.tipo=='tel'){const d=k.replace(/\D/g,'');return d.startsWith('55')&&d.length>11?'+'+d:'+55'+d}if(p.tipo=='cpf'||p.tipo=='cnpj')return k.replace(/\D/g,'');if(p.tipo=='mail')return k.toLowerCase();return k};
function brcode(p,val){if(p.payload&&String(p.payload).trim().length>20)return String(p.payload).trim();if(!p.chave)return'';
 let m=tlv('00','01')+tlv('01','11')+tlv('26',tlv('00','br.gov.bcb.pix')+tlv('01',fkey(p)))+tlv('52','0000')+tlv('53','986')+(val>0?tlv('54',val.toFixed(2)):'')+tlv('58','BR')+tlv('59',asc(p.nome,25)||'RECEBEDOR')+tlv('60',asc(p.cidade,15)||'BRASIL')+tlv('62',tlv('05','***'))+'6304';return m+crc(m)}
const waNum=n=>{n=String(n||'').replace(/\D/g,'');return n.length<=11?'55'+n:n},
waFmt=n=>{const d=String(n||'').replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'');return d.length==11?d.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3'):d.length==10?d.replace(/(\d{2})(\d{4})(\d{4})/,'($1) $2-$3'):n},
waLink=w=>'https://wa.me/'+waNum(w.numero)+(w.msg?'?text='+encodeURIComponent(w.msg):''),
waShow=n=>{const d=String(n||'').replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'');return(d.length==10||d.length==11)?'+55 '+waFmt(d):String(n||'')},
fmtKey=p=>{const k=String(p.chave||'').trim(),d=k.replace(/\D/g,'');
 if(!k)return'Pix copia e cola';
 if(p.tipo=='cpf'&&d.length==11)return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');
 if(p.tipo=='cnpj'&&d.length==14)return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,'$1.$2.$3/$4-$5');
 if(p.tipo=='tel')return waShow(d);
 return k};
const copy=async(t,ok)=>{try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(x){}a.remove()}tst(ok||'Copiado')};
const brl=v=>'R$ '+v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

/* ---------- canvas: cartão do Pix / WhatsApp ---------- */
const FN=(w,s)=>`${w} ${s}px Inter,system-ui,"Segoe UI",sans-serif`,
rr=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()},
fit=(g,t,mw,s,mn,w)=>{while(s>mn){g.font=FN(w,s);if(g.measureText(t).width<=mw)break;s-=2}g.font=FN(w,s)};
/* logo do banco dentro do cartão; devolve a largura usada */
function chip(g,id,x,y,h){const b=id=='wa'?WAB:bk(id),l=LG[id],m=b[7];
 if(!l){rr(g,x,y,h,h,h*.28);g.fillStyle=b[2];g.fill();g.fillStyle=b[4];g.textAlign='center';g.textBaseline='middle';g.font=FN(800,Math.round(h*(b[8].length>2?.3:.4)));g.fillText(b[8],x+h/2,y+h/2+2);g.textBaseline='alphabetic';return h}
 g.save();g.shadowColor='rgba(0,0,0,.28)';g.shadowBlur=26;g.shadowOffsetY=10;
 if(m=='s'||m=='c'){if(m=='c'){g.beginPath();g.arc(x+h/2,y+h/2,h/2,0,7)}else rr(g,x,y,h,h,h*.24);g.fillStyle=b[2];g.fill();g.restore();g.save();if(m=='c'){g.beginPath();g.arc(x+h/2,y+h/2,h/2,0,7)}else rr(g,x,y,h,h,h*.24);g.clip();g.drawImage(l.c,x,y,h,h);g.restore();return h}
 if(m=='sw'){const w=h*2;rr(g,x,y,w,h,h*.2);g.fillStyle=b[3];g.fill();g.restore();g.save();rr(g,x,y,w,h,h*.2);g.clip();g.drawImage(l.c,x,y,w,h);g.restore();return w}
 const pad=h*.15,w=Math.min(h*2.6,Math.max(h,(h-2*pad)*(l.w/l.h)+2*pad));rr(g,x,y,w,h,h*.24);g.fillStyle='#fff';g.fill();g.restore();
 const sc=Math.min((w-2*pad)/l.w,(h-2*pad)/l.h),dw=l.w*sc,dh=l.h*sc;g.drawImage(l.c,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return w}
function qrDraw(g,text,x,y,S){let q=null;try{if(typeof qrcode!='undefined'&&text){q=qrcode(0,'M');q.addData(text);q.make()}}catch(e){q=null}
 if(!q){g.fillStyle='#f5f7fa';g.fillRect(x,y,S,S);g.fillStyle='#64748b';g.textAlign='center';g.font=FN(600,30);const ls=text?['QR indisponível.','Abra o site uma vez com','internet para guardar','a biblioteca.']:['Sem dados','para gerar o QR.'];ls.forEach((t,i)=>g.fillText(t,x+S/2,y+S/2-30+i*42));return}
 const n=q.getModuleCount(),ms=S/(n+4);g.fillStyle='#000';
 for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k)){const x0=Math.round(x+(k+2)*ms),x1=Math.round(x+(k+3)*ms),y0=Math.round(y+(r+2)*ms),y1=Math.round(y+(r+3)*ms);g.fillRect(x0,y0,x1-x0,y1-y0)}}
async function paintCard(o){await logosReady();
 const W=1080,H=1780,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),light=!/^#(fff|ffffff)$/i.test(o.fg),
 tint=a=>light?`rgba(0,0,0,${(a*.7).toFixed(3)})`:`rgba(255,255,255,${a})`;
 /* fundo com as cores do banco */
 let gr=g.createLinearGradient(0,0,W*.6,H);gr.addColorStop(0,o.c1);gr.addColorStop(1,o.c2);g.fillStyle=gr;g.fillRect(0,0,W,H);
 gr=g.createRadialGradient(180,120,0,180,120,760);gr.addColorStop(0,tint(.3));gr.addColorStop(1,tint(0));g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.strokeStyle=tint(.06);g.lineWidth=2;for(let x=0;x<=W;x+=60){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}for(let y=0;y<=H;y+=60){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
 g.strokeStyle=tint(.14);g.lineWidth=3;[260,380,500,620].forEach(r=>{g.beginPath();g.arc(W+40,250,r,0,7);g.stroke()});
 g.fillStyle=tint(.09);g.beginPath();g.arc(-60,H-120,360,0,7);g.fill();g.beginPath();g.arc(W-40,H-40,200,0,7);g.fill();
 /* cabeçalho: logo + nome */
 const hh=150,cw=chip(g,o.logo,70,70,hh),tx=70+cw+34,tm=W-70-tx;g.textAlign='left';g.fillStyle=o.fg;
 fit(g,o.label,tm,60,30,800);g.fillText(o.label,tx,70+hh/2-2);
 g.globalAlpha=.88;fit(g,o.sub,tm,36,22,600);g.fillText(o.sub,tx,70+hh/2+50);g.globalAlpha=1;
 /* cartão branco */
 const cx=60,cy=290,cwid=960,chh=1370;
 g.save();g.shadowColor='rgba(0,0,0,.38)';g.shadowBlur=70;g.shadowOffsetY=26;g.fillStyle='#fff';rr(g,cx,cy,cwid,chh,64);g.fill();g.restore();
 g.save();rr(g,cx,cy,cwid,chh,64);g.clip();g.fillStyle=o.c1;g.fillRect(cx,cy,cwid,16);g.restore();
 /* QR com cantos na cor do banco */
 const S=760,qx=(W-S)/2,qy=cy+56;qrDraw(g,o.qr,qx,qy,S);
 g.strokeStyle=o.c1==='#e1e24f'||o.c1==='#fae128'?o.c2:o.c1;g.lineWidth=12;g.lineCap='round';const bx=qx-14,by=qy-14,bs=S+28,L=96;
 [[bx,by,1,1],[bx+bs,by,-1,1],[bx,by+bs,1,-1],[bx+bs,by+bs,-1,-1]].forEach(([x,y,a,b])=>{g.beginPath();g.moveTo(x,y+b*L);g.lineTo(x,y);g.lineTo(x+a*L,y);g.stroke()});
 /* tipo da chave */
 g.textAlign='center';g.font=FN(800,32);const pw=g.measureText(o.pill).width+72,py=1150;rr(g,(W-pw)/2,py,pw,70,35);g.fillStyle=o.c1;g.fill();g.fillStyle=o.fg;g.fillText(o.pill,W/2,py+47);
 /* chave / número (embaixo do QR) */
 g.fillStyle='#0f2a43';fit(g,o.key,860,64,26,800);g.fillText(o.key,W/2,1300);
 g.strokeStyle='#e5ebf2';g.lineWidth=3;g.lineCap='butt';g.beginPath();g.moveTo(cx+70,1352);g.lineTo(cx+cwid-70,1352);g.stroke();
 /* titular */
 g.fillStyle='#64748b';g.font=FN(700,26);try{g.letterSpacing='4px'}catch(e){}g.fillText(o.hl,W/2,1408);try{g.letterSpacing='0px'}catch(e){}
 g.fillStyle='#0f2a43';fit(g,o.holder||'—',860,54,28,800);g.fillText(o.holder||'—',W/2,1472);
 g.fillStyle='#475569';fit(g,o.line,860,36,22,600);g.fillText(o.line,W/2,1526);
 if(o.v>0){g.fillStyle='#64748b';g.font=FN(700,26);g.fillText('VALOR',W/2,1580);g.fillStyle='#0f2a43';g.font=FN(800,52);g.fillText(brl(o.v),W/2,1636)}
 else{g.fillStyle='#94a3b8';g.font=FN(600,27);g.fillText(o.hint,W/2,1620)}
 g.globalAlpha=.8;g.fillStyle=o.fg;g.font=FN(700,28);g.fillText('DC CAD Pro',W/2,1728);g.globalAlpha=1;
 return c}
const cardPix=(p,v)=>{const b=bk(p.banco);return paintCard({c1:b[2],c2:b[3],fg:b[4],logo:p.banco,label:p.rotulo||b[1],sub:b[1],qr:brcode(p,v),pill:p.chave?'Pix • '+(TP[p.tipo]||'Chave'):'Pix copia e cola',key:fmtKey(p),hl:'TITULAR',holder:p.nome,line:b[1],v,hint:'Confira o nome e o banco antes de pagar'})},
cardWa=w=>paintCard({c1:WAB[2],c2:WAB[3],fg:'#fff',logo:'wa',label:w.nome||'WhatsApp',sub:w.rotulo||'WhatsApp',qr:waLink(w),pill:'WhatsApp',key:waShow(w.numero),hl:'NOME',holder:w.nome,line:'WhatsApp',v:0,hint:'Escaneie para abrir a conversa'});

/* ---------- estilo ---------- */
const st=document.createElement('style');st.textContent=`#pay75{position:fixed;inset:0;z-index:9000;display:flex;flex-direction:column;background:radial-gradient(circle at 15% 0,#2a6aa0 0,transparent 45%),linear-gradient(160deg,#0b2036,#15446b 70%,#1b4f7a);color:var(--fg,#fff);font-family:Inter,system-ui,sans-serif;padding-top:env(safe-area-inset-top);transition:background .25s}
#pay75 .ph{display:flex;align-items:center;gap:8px;padding:10px 12px}#pay75 .pt{flex:1;display:flex;gap:6px;justify-content:center}
#pay75 .pt button{min-height:44px;padding:0 18px;border-radius:99px;font-weight:800;font-size:14px;background:#ffffff33;color:var(--fg,#fff)}#pay75 .pt button.on{background:#f26b21;color:#fff}
#pay75 .pi{min-width:44px;min-height:44px;border-radius:99px;background:#ffffff33;color:var(--fg,#fff);font-size:18px}
#pay75 .pb{flex:1;min-height:0;overflow:auto;padding:6px 14px calc(20px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center}
#pay75 .pc{width:100%;max-width:440px;margin:auto 0}
#pay75 .cvw{min-height:300px}
#pay75 .sl{display:flex;gap:8px;overflow-x:auto;width:100%;max-width:440px;padding:12px 2px 2px;scrollbar-width:none;flex:none}#pay75 .sl::-webkit-scrollbar{display:none}
#pay75 .sl button{flex:none;display:flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;border-radius:99px;background:#ffffff40;color:var(--fg,#fff);font-weight:700;font-size:13px;max-width:200px;border:2px solid transparent}#pay75 .sl button span.t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#pay75 .sl button.on{background:#fff;color:#0f2a43;border-color:#f26b21}
#pay75 .bt{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}#pay75 .bt button,#pay75 .bt a{flex:1 1 44%;min-height:48px;border-radius:14px;font-weight:800;font-size:14px;display:inline-flex;align-items:center;justify-content:center;text-align:center;text-decoration:none;padding:0 8px}
#pay75 .g{background:#ffffffee;color:#0f2a43}#pay75 .o{background:#f26b21;color:#fff}#pay75 .w{background:#25D366;color:#fff}
#pay75 .vl{width:100%;margin-top:12px;border:0;border-radius:12px;padding:12px 14px;font-size:16px;background:#ffffffee;color:#0f2a43}
#pay75 .em{text-align:center;max-width:340px;margin:auto;color:#fff;line-height:1.5;background:#ffffff1c;border-radius:20px;padding:22px}
.bg75{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:4px}.bg75 button{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 2px;border:2px solid #dbe3ec;border-radius:12px;background:#fff;font-size:10px;font-weight:700;color:#0f2a43;line-height:1.1;text-align:center;min-height:68px}.bg75 button.on{border-color:#f26b21;background:#fff3ec}
.mob .top>#bPay75{display:inline-flex!important}#mq{z-index:9800!important}`;document.head.appendChild(st);

/* ---------- apresentação ---------- */
let tab='pix',idx={pix:0,wa:0},val='',pt=0,ct=0,cur=null;
function openPay(t){if(t)tab=t;if(!D.pix.length&&D.wa.length&&!t)tab='wa';let o=$('pay75');if(o)o.remove();o=document.createElement('div');o.id='pay75';document.body.appendChild(o);try{history.pushState({p75:1},'')}catch(e){}paint()}
const closePay=()=>{const o=$('pay75');if(o)o.remove()};
addEventListener('popstate',closePay);
const curVal=()=>parseFloat(String(val).replace(/\./g,'').replace(',','.'))||0,
slug=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'cartao';
async function paint(){const o=$('pay75');if(!o)return;const my=++pt,L=D[tab],n=L.length;if(idx[tab]>=n)idx[tab]=Math.max(0,n-1);const i=idx[tab],it=L[i],th=it?(tab=='pix'?bk(it.banco):WAB):null;
 o.style.background=th?`radial-gradient(circle at 15% 0,${th[2]} 0,transparent 60%),linear-gradient(160deg,${th[2]},${th[3]})`:'';o.style.setProperty('--fg',th?th[4]:'#fff');
 o.innerHTML=`<div class="ph"><button class="pi" data-a="x" aria-label="Fechar">✕</button><div class="pt"><button data-t="pix" class="${tab=='pix'?'on':''}">💳 Pix</button><button data-t="wa" class="${tab=='wa'?'on':''}">WhatsApp</button></div><button class="pi" data-a="ed" aria-label="Editar">⚙</button></div><div class="pb"><div id="pcd" class="pc"></div><div id="sl" class="sl"></div></div>`;
 const c=o.querySelector('#pcd');
 if(!it){c.innerHTML=`<div class="em">${tab=='pix'?'💳':'💬'}<br><b>Nenhum ${tab=='pix'?'Pix':'WhatsApp'} cadastrado</b><br>Toque em ⚙ para cadastrar. Fica salvo neste aparelho e abre sem internet.</div>`;return}
 const fixed=tab=='pix'&&String(it.payload||'').trim().length>20;
 c.innerHTML=`<div id="qh" class="cvw"><div class="em">Montando o cartão…</div></div>${tab=='pix'&&!fixed?'<input class="vl" id="vl" inputmode="decimal" placeholder="Valor (opcional): o QR e o cartão mostram o valor" value="'+E(val)+'">':''}<div class="bt">${tab=='pix'?'<button class="g" data-a="ck">📋 Copiar chave</button><button class="o" data-a="cp">📋 Pix copia e cola</button>':'<button class="g" data-a="cn">📋 Copiar número</button><a class="w" href="'+E(waLink(it))+'" target="_blank" rel="noopener">💬 Abrir conversa</a>'}<button class="g" data-a="sv">🖼 Salvar imagem</button><button class="g" data-a="sh">📤 Compartilhar</button></div>`;
 const draw=async()=>{const t=++ct;let cv;try{cv=await(tab=='pix'?cardPix(it,curVal()):cardWa(it))}catch(e){return}if(t!=ct||my!=pt)return;cur=cv;cv.style.cssText='width:100%;height:auto;display:block;border-radius:22px;box-shadow:0 18px 50px #0006';const h=c.querySelector('#qh');h.classList.remove('cvw');h.innerHTML='';h.appendChild(cv)};
 await logosReady();if(my!=pt)return;
 const sl=o.querySelector('#sl');if(n>1)sl.innerHTML=L.map((x,k)=>`<button data-a="go" data-i="${k}" class="${k==i?'on':''}">${tab=='pix'?badge(x.banco,30):WA(30)}<span class="t">${E(tab=='pix'?(x.rotulo||bk(x.banco)[1]):(x.rotulo||x.nome||'WhatsApp'))}</span></button>`).join('');
 const on=sl.querySelector('.on');if(on)try{on.scrollIntoView({inline:'center',block:'nearest'})}catch(e){}
 draw();const vl=c.querySelector('#vl');if(vl){let tm;vl.oninput=()=>{val=vl.value;clearTimeout(tm);tm=setTimeout(draw,140)}}}
async function blobOf(){return cur?await new Promise(r=>cur.toBlob(r,'image/png')):null}
document.addEventListener('click',async e=>{const o=$('pay75');if(!o||!o.contains(e.target))return;const t=e.target.closest('[data-t],[data-a]');if(!t)return;
 if(t.dataset.t){tab=t.dataset.t;paint();return}const a=t.dataset.a,it=D[tab][idx[tab]],n=D[tab].length;
 if(a=='x'){closePay();try{if(history.state&&history.state.p75)history.back()}catch(x){}}
 else if(a=='ed')manager();else if(a=='go'){idx[tab]=+t.dataset.i;paint()}
 else if(a=='ck')copy(fkey(it)||'','Chave copiada');else if(a=='cp')copy(brcode(it,curVal()),'Pix copia e cola copiado');else if(a=='cn')copy(waNum(it.numero),'Número copiado');
 else if(a=='sv'||a=='sh'){const b=await blobOf();if(!b){tst('Aguarde o cartão carregar');return}const nm=(tab=='pix'?'pix-':'whatsapp-')+slug(it.rotulo||it.nome||(it.banco&&bk(it.banco)[1]))+'.png';
  if(a=='sh'){try{const f=new File([b],nm,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:it.rotulo||'Pix'});return}}catch(x){if(x&&x.name=='AbortError')return}tst('Este aparelho não compartilha imagem: salvando')}
  const u=URL.createObjectURL(b),l=document.createElement('a');l.href=u;l.download=nm;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);if(a=='sv')tst('Imagem salva')}});
{let x0=null;document.addEventListener('touchstart',e=>{const o=$('pay75');x0=o&&o.contains(e.target)&&!e.target.closest('input,.sl')?e.touches[0].clientX:null},{passive:true});
 document.addEventListener('touchend',e=>{if(x0==null||!$('pay75'))return;const d=e.changedTouches[0].clientX-x0,n=D[tab].length;x0=null;if(Math.abs(d)>60&&n>1){idx[tab]=(idx[tab]+(d<0?1:-1)+n)%n;paint()}},{passive:true})}

/* ---------- cadastro ---------- */
const mod=(t,h)=>{const m=document.createElement('div');m.className='modal full';m.style.zIndex=9500;m.innerHTML=`<div style="max-width:520px"><div class="flex items-center gap-2"><h3 class="text-xl font-extrabold">${t}</h3><button class="btn ghost ml-auto" data-x>✕</button></div><div data-b>${h}</div></div>`;m.addEventListener('click',e=>{if(e.target===m||e.target.hasAttribute('data-x'))m.remove()});document.body.appendChild(m);return m},
emp=()=>{try{return JSON.parse(localStorage.getItem('dce_emp71'))||{}}catch(e){return{}}};
function manager(){document.querySelectorAll('.m75').forEach(x=>x.remove());const e=emp(),
 row=(k,it)=>`<div class="qcc" style="display:flex;align-items:center;gap:10px;margin-top:8px">${k=='pix'?badge(it.banco,40):WA(40)}<div style="flex:1;min-width:0"><b style="word-break:break-word">${E(it.rotulo||it.nome||'Sem nome')}</b><div class="text-xs" style="color:#64748b;word-break:break-all">${k=='pix'?E(bk(it.banco)[1]+' • '+(it.nome||'')+(it.chave?' • '+it.chave:'')):E((it.nome?it.nome+' • ':'')+waFmt(it.numero))}</div></div><button class="btn ghost" data-ed="${k}:${it.id}">✏️</button><button class="btn danger" data-rm="${k}:${it.id}">🗑</button></div>`;
 const m=mod('💳 Pix e WhatsApp',`<p class="text-xs" style="color:#64748b">Fica salvo neste aparelho (e na sua conta, se estiver logado). A apresentação abre sem internet e pega as cores e a logo do banco.</p>
 <b class="text-sm block mt-3">Pix (${D.pix.length})</b>${D.pix.map(x=>row('pix',x)).join('')}<button class="btn ghost w-full mt-2" data-add="pix">＋ Adicionar Pix</button>
 <b class="text-sm block mt-4">WhatsApp (${D.wa.length})</b>${D.wa.map(x=>row('wa',x)).join('')}<button class="btn ghost w-full mt-2" data-add="wa">＋ Adicionar WhatsApp</button>
 ${(!D.pix.length&&e.pix)||(!D.wa.length&&e.tel)?'<button class="btn ghost w-full mt-4" data-imp>↧ Usar dados da aba Empresa</button>':''}
 <button class="btn or w-full mt-4 py-3" data-ok>👁 Ver apresentação</button>`);m.classList.add('m75');
 if(!lgDone)logosReady().then(()=>{const ms=document.querySelectorAll('.m75');if(ms.length==1&&!ms[0].classList.contains('f75'))manager()});
 m.addEventListener('click',async ev=>{const t=ev.target.closest('[data-add],[data-ed],[data-rm],[data-ok],[data-imp]');if(!t)return;
  if(t.dataset.ok!==undefined){m.remove();openPay();return}
  if(t.dataset.imp!==undefined){if(!D.pix.length&&e.pix)D.pix.push({id:uid(),banco:'out',rotulo:'Pix',nome:e.nome||'',tipo:'aleat',chave:e.pix,cidade:'',payload:''});if(!D.wa.length&&e.tel)D.wa.push({id:uid(),rotulo:'WhatsApp',nome:e.nome||'',numero:e.tel,msg:''});await save();manager();return}
  if(t.dataset.add){form(t.dataset.add);return}
  const[k,id]=(t.dataset.ed||t.dataset.rm).split(':');
  if(t.dataset.ed){form(k,D[k].find(x=>x.id==id));return}
  if(await yes('Remover este item?')){D[k]=D[k].filter(x=>x.id!=id);await save();manager()}})}
const sel=(id,l,a,v)=>`<label>${l}<select class="in mt-1" id="${id}">${a.map(x=>`<option value="${x[0]}" ${x[0]==v?'selected':''}>${E(x[1])}</option>`).join('')}</select></label>`,
fld=(id,l,v,ex='')=>`<label>${l}<input class="in mt-1" id="${id}" value="${E(v)}" ${ex}></label>`;
function form(k,it){const n=!it,e=emp();it=it||(k=='pix'?{id:uid(),banco:'nu',rotulo:'',nome:e.nome||'',tipo:'cpf',chave:'',cidade:'',payload:''}:{id:uid(),rotulo:'WhatsApp',nome:e.nome||'',numero:e.tel||'',msg:''});let selB=it.banco||'nu';
 const m=mod(n?(k=='pix'?'＋ Novo Pix':'＋ Novo WhatsApp'):'✏️ Editar',k=='pix'?
 `<label>Banco</label><div id="f_bg" class="bg75"></div>${fld('f_r','Como aparece (ex.: Pix da loja, Pix pessoal)',it.rotulo)}${fld('f_n','Nome do titular (como aparece no banco)',it.nome,'maxlength="25"')}<div class="grid grid-cols-2 gap-2">${sel('f_t','Tipo de chave',[['cpf','CPF'],['cnpj','CNPJ'],['tel','Celular'],['mail','E-mail'],['aleat','Chave aleatória']],it.tipo)}${fld('f_k','Chave Pix',it.chave)}</div>${fld('f_c','Cidade (para o QR)',it.cidade,'maxlength="15" placeholder="Ex.: Bauru"')}<label>Pix copia e cola (opcional)<textarea class="in mt-1" id="f_p" rows="3" placeholder="Se você já tem o código do seu banco, cole aqui. Senão o QR é gerado pela chave.">${E(it.payload)}</textarea></label><p id="f_e" class="text-sm min-h-[20px]" style="color:#b42318"></p>`:
 `${fld('f_r','Como aparece (ex.: Orçamentos, Suporte)',it.rotulo)}${fld('f_n','Seu nome / empresa',it.nome)}${fld('f_k','Número com DDD',it.numero,'type="tel" inputmode="tel" placeholder="14 99999-9999"')}${fld('f_m','Mensagem inicial (opcional)',it.msg,'placeholder="Olá! Vim pelo cartão de visita."')}<p id="f_e" class="text-sm min-h-[20px]" style="color:#b42318"></p>`);
 m.classList.add('m75','f75');const g=i=>m.querySelector('#'+i);
 if(k=='pix'){const gd=()=>{g('f_bg').innerHTML=BK.map(b=>`<button type="button" data-b="${b[0]}" class="${b[0]==selB?'on':''}">${badge(b[0],40)}<span>${E(b[1])}</span></button>`).join('')};gd();
  g('f_bg').onclick=ev=>{const t=ev.target.closest('[data-b]');if(!t)return;selB=t.dataset.b;gd()};if(!lgDone)logosReady().then(()=>{if(document.body.contains(m))gd()})}
 const ok=document.createElement('button');ok.className='btn or w-full mt-2 py-3';ok.textContent='Salvar';m.querySelector('[data-b]').appendChild(ok);
 ok.onclick=async()=>{const er=g('f_e');er.textContent='';
  if(k=='pix'){const o={id:it.id,banco:selB,rotulo:g('f_r').value.trim(),nome:g('f_n').value.trim(),tipo:g('f_t').value,chave:g('f_k').value.trim(),cidade:g('f_c').value.trim(),payload:g('f_p').value.trim()};
   if(!o.nome){er.textContent='Informe o nome do titular.';return}if(!o.chave&&o.payload.length<20){er.textContent='Informe a chave Pix ou cole o Pix copia e cola.';return}
   if(!o.chave&&o.payload.length>=20){const mm=o.payload.match(/0014br\.gov\.bcb\.pix01(\d{2})/i);if(mm){const l=+mm[1],s=o.payload.indexOf(mm[0])+mm[0].length;o.chave=o.payload.substr(s,l);
    const kk=o.chave,dd=kk.replace(/\D/g,'');o.tipo=kk.includes('@')?'mail':/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(kk)?'aleat':kk[0]=='+'?'tel':dd.length==14&&dd==kk?'cnpj':dd.length==11&&dd==kk?'cpf':o.tipo}}
   Object.assign(it,o)}
  else{const o={id:it.id,rotulo:g('f_r').value.trim(),nome:g('f_n').value.trim(),numero:g('f_k').value.trim(),msg:g('f_m').value.trim()};if(String(o.numero).replace(/\D/g,'').length<10){er.textContent='Número inválido: use DDD + número.';return}Object.assign(it,o)}
  if(n)D[k].push(it);await save();m.remove();manager();tst('Salvo ✅')}}

/* ---------- botões ---------- */
const mkb=(id,cls,h,f)=>{const b=document.createElement('button');b.id=id;b.className=cls;b.innerHTML=h;b.onclick=f;return b};
{const hn=document.querySelector('#vH .hnav .btn.or');if(hn)hn.before(mkb('bPayH','hnv','💳 Pix e WhatsApp',()=>openPay()));
 const fb=$('bFb');if(fb)fb.before(mkb('bPay75','btn ghost','💳<span class="lb">&nbsp;Pix e WhatsApp</span>',()=>openPay()));
 const es=$('eS');if(es)es.before(Object.assign(document.createElement('div'),{className:'qcc',innerHTML:'<b class="text-sm">💳 Pix e WhatsApp</b><p class="text-xs" style="color:#64748b;margin:4px 0 8px">Cadastre seus Pix (banco, titular, chave) e WhatsApp. A apresentação para o cliente tem as cores e a logo do banco, QR Code e abre sem internet.</p>'}));
 const box=es&&es.previousElementSibling;if(box&&box.className=='qcc'){box.appendChild(mkb('bPayCfg','btn ghost w-full','⚙ Configurar Pix e WhatsApp',()=>manager()));box.appendChild(mkb('bPayCfg2','btn or w-full mt-2','👁 Ver apresentação',()=>openPay()))}}
window.pay75={open:openPay,manager};
})();
