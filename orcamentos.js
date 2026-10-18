/* DC CAD Pro — Orçamentos avulsos + mini CRM (dashboard, editor, PDF, link para WhatsApp, Pix com valor) */
(()=>{'use strict';
const $=id=>document.getElementById(id),E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'),
LK='dce_orc80',PK='dce_pay75',EK='dce_emp71',TK='dce_tab80',
r2=n=>Math.round((+n||0)*100)/100,
fm=n=>(+n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}),brl=n=>'R$ '+fm(n),
pn=v=>{v=String(v==null?'':v).trim();if(!v)return 0;if(v.includes(','))v=v.replace(/\./g,'').replace(',','.');const n=parseFloat(v);return isFinite(n)?n:0},
nid=()=>{const a='abcdefghijklmnopqrstuvwxyz0123456789',r=crypto.getRandomValues(new Uint8Array(10));let s='';for(const b of r)s+=a[b%36];return s},
hoje=(p=0)=>{const d=new Date(Date.now()+p*864e5);return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)},
addD=(s,n)=>{const x=new Date((s||hoje())+'T12:00:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)},
fd=s=>s?String(s).slice(0,10).split('-').reverse().join('/'):'',
tst=m=>{let t=$('t80');if(!t){t=document.createElement('div');t.id='t80';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99999;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',2800)},
ST={pendente:['Em Aberto','🟡','#b45309','#fef3c7'],enviado:['Enviado','📲','#0e7490','#cffafe'],aprovado:['Aprovado','✅','#15803d','#dcfce7'],pago:['Pago','💰','#1d4ed8','#dbeafe'],cancelado:['Cancelado','🚫','#b42318','#fee2e2']},
TP={cpf:'CPF',cnpj:'CNPJ',tel:'Celular',mail:'E-mail',aleat:'Chave aleatória'};
const isLocal=()=>typeof ses=='undefined'||!ses||ses.access_token=='local',
online=()=>!isLocal()&&navigator.onLine,
meId=()=>{try{return JSON.parse(atob(ses.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).sub}catch(e){return null}};
async function rq(p,o={}){const go=()=>fetch(CFG.url+p,{...o,headers:{...UH(),...(o.headers||{})}});let r=await go();
 if(r.status==401&&ses.refresh_token){try{const d=await api('/auth/v1/token?grant_type=refresh_token',{refresh_token:ses.refresh_token});if(d&&d.access_token){ses=d;localStorage.setItem('dce_ses',JSON.stringify(d));r=await go()}}catch(e){}}return r}

/* ---------- cache local (por conta) ---------- */
const uidNow=()=>isLocal()?'local':(meId()||'x');
const cLoad=()=>{try{const c=JSON.parse(localStorage.getItem(LK));if(c&&c.uid==uidNow()&&Array.isArray(c.rows))return c.rows}catch(e){}return[]};
const cSave=rows=>{try{localStorage.setItem(LK,JSON.stringify({uid:uidNow(),rows}))}catch(e){try{localStorage.setItem(LK,JSON.stringify({uid:uidNow(),rows:rows.map(r=>({...r,dados:r._p?r.dados:undefined}))}))}catch(x){}}};
let ROWS=[];
const cPut=(row,p)=>{const r={...row};if(p)r._p=1;else delete r._p;const a=cLoad(),i=a.findIndex(x=>x.id==r.id);if(i>=0)a[i]=r;else a.unshift(r);cSave(a);const j=ROWS.findIndex(x=>x.id==r.id);if(j>=0)ROWS[j]=r;else ROWS.unshift(r)};

/* ---------- empresa e Pix (da conta) ---------- */
const empLocal=()=>{try{return JSON.parse(localStorage.getItem(EK))||{}}catch(e){return{}}};
async function empGet(){let o={...empLocal()};try{const m=ses&&ses.user&&ses.user.user_metadata&&ses.user.user_metadata.empresa;if(m&&!o.nome&&!o.doc)o={...m,logo:o.logo}}catch(e){}
 if(online()&&(!o.logo||!o.nome)){try{const r=await rq('/rest/v1/conta_dados?chave=eq.empresa&select=dados&limit=1');if(r.ok){const a=await r.json(),d=a[0]&&a[0].dados;if(d&&typeof d=='object')for(const k of Object.keys(d))if(!o[k]&&d[k])o[k]=d[k]}}catch(e){}}return o}
const pixLocal=()=>{try{const d=JSON.parse(localStorage.getItem(PK));return d&&Array.isArray(d.pix)?d.pix:[]}catch(e){return[]}};
async function pixGet(){let l=pixLocal();if(!l.length&&online()){try{const r=await rq('/rest/v1/pagamentos?select=dados&limit=1');if(r.ok){const a=await r.json(),d=a[0]&&a[0].dados;if(d&&Array.isArray(d.pix))l=d.pix}}catch(e){}}return l.filter(p=>p&&(p.chave||p.payload))}
const crc=s=>{let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')},
tlv=(i,v)=>i+String(v.length).padStart(2,'0')+v,asc=(s,n)=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,'').toUpperCase().trim().slice(0,n),
fkey=p=>{const k=String(p.chave||'').trim();if(p.tipo=='tel'){const d=k.replace(/\D/g,'');return d.startsWith('55')&&d.length>11?'+'+d:'+55'+d}if(p.tipo=='cpf'||p.tipo=='cnpj')return k.replace(/\D/g,'');if(p.tipo=='mail')return k.toLowerCase();return k};
function brcode(p,val){if(p.payload&&String(p.payload).trim().length>20&&!(val>0&&p.chave))return String(p.payload).trim();if(!p.chave)return'';
 const m=tlv('00','01')+tlv('01','11')+tlv('26',tlv('00','br.gov.bcb.pix')+tlv('01',fkey(p)))+tlv('52','0000')+tlv('53','986')+(val>0?tlv('54',val.toFixed(2)):'')+tlv('58','BR')+tlv('59',asc(p.nome,25)||'RECEBEDOR')+tlv('60',asc(p.cidade,15)||'BRASIL')+tlv('62',tlv('05','***'))+'6304';return m+crc(m)}
function qrSvg(t,px){try{const q=qrcode(0,'M');q.addData(t);q.make();const n=q.getModuleCount(),m=2;let p='';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))p+=`M${c+m} ${r+m}h1v1h-1z`;
 return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n+m*2} ${n+m*2}" ${px?`width="${px}" height="${px}"`:'style="width:100%;height:auto"'} shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${p}" fill="#000"/></svg>`}catch(e){return''}}

/* ---------- modelo ---------- */
const novoD=emp=>({emp:{nome:emp.nome||'',doc:emp.doc||'',end:emp.end||'',tel:emp.tel||'',mail:emp.mail||'',logo:emp.logo||''},cli:{nome:'',doc:'',tel:'',mail:'',end:'',bairro:'',cep:'',cidade:'',uf:''},emi:hoje(),val:hoje(7),vd:'7',pgto:'',itens:[{d:'',q:'1',v:''},{d:'',q:'1',v:''},{d:'',q:'1',v:''}],desc:{v:'',t:'R$'},acr:{v:'',t:'R$'},obs:'',pix:{on:true,i:0},snap:null});
const norm=d=>{const b=novoD({});for(const k of['emp','cli','desc','acr','pix'])d[k]={...b[k],...(d[k]||{})};d.itens=Array.isArray(d.itens)?d.itens:[];d.emi=d.emi||b.emi;d.val=d.val||b.val;d.vd=d.vd==null?'7':d.vd;d.pgto=d.pgto||'';d.obs=d.obs||'';return d};
const calc=d=>{const sub=r2((d.itens||[]).reduce((s,x)=>s+pn(x.q)*pn(x.v),0)),f=o=>o.t=='%'?r2(sub*pn(o.v)/100):r2(pn(o.v)),dc=f(d.desc),ac=f(d.acr);return{sub,dc,ac,tot:r2(Math.max(0,sub-dc+ac))}};
function snapPix(d,pl,tot){if(!d.pix.on||!pl.length)return null;const p=pl[Math.min(d.pix.i|0,pl.length-1)],code=brcode(p,tot);if(!code)return null;return{code,titular:p.nome||'',chave:p.chave?(p.tipo=='tel'||p.tipo=='mail'||p.tipo=='aleat'?p.chave:p.chave):'',tipo:p.chave?(TP[p.tipo]||'Chave'):'Pix copia e cola',rotulo:p.rotulo||''}}

/* ---------- dados (nuvem + aparelho) ---------- */
let pushing=null;
async function put(row){const r={...row};cPut(r,true);if(!online())return isLocal()?'local':'pend';
 try{const x=await rq('/rest/v1/orcamentos?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:r.id,num:r.num,status:r.status,cliente:r.cliente,total:r.total,dados:r.dados,atualizado:r.atualizado})});if(x.ok){cPut(r,false);return'cloud'}}catch(e){}return'pend'}
async function pushPend(){if(!online()||pushing)return;pushing=(async()=>{for(const r of cLoad().filter(x=>x._p&&x.dados))await put(r)})();try{await pushing}finally{pushing=null}}
async function listar(){let c=cLoad();
 if(online()){await pushPend();try{const r=await rq('/rest/v1/orcamentos?select=id,num,status,cliente,total,criado,atualizado,cli:dados->cli,emi:dados->>emi&order=atualizado.desc&limit=500');
  if(r.ok){const sv=await r.json(),loc=cLoad(),m=new Map(loc.map(x=>[x.id,x])),out=sv.map(s=>{const l=m.get(s.id);if(l&&(l._p||(l.dados&&l.atualizado==s.atualizado)))return l;return s});
   for(const l of loc)if(l._p&&!sv.some(s=>s.id==l.id))out.unshift(l);out.sort((a,b)=>String(b.atualizado).localeCompare(String(a.atualizado)));cSave(out);c=out}}catch(e){}}
 ROWS=c;return c}
async function pegar(id){const l=cLoad().find(x=>x.id==id);if(l&&l._p&&l.dados)return l;
 if(online()){try{const r=await rq('/rest/v1/orcamentos?id=eq.'+id+'&select=*&limit=1');if(r.ok){const a=await r.json();if(a[0]){const x=a[0];delete x.user_id;cPut(x,false);return x}}}catch(e){}}
 return l&&l.dados?l:null}
async function apagar(id){if(isLocal()){cSave(cLoad().filter(x=>x.id!=id));ROWS=ROWS.filter(x=>x.id!=id);return true}
 if(!online()){tst('Precisa de internet para excluir da conta');return false}
 try{const r=await rq('/rest/v1/orcamentos?id=eq.'+id,{method:'DELETE'});if(r.ok){cSave(cLoad().filter(x=>x.id!=id));ROWS=ROWS.filter(x=>x.id!=id);return true}}catch(e){}tst('Não consegui excluir agora');return false}
const proxNum=()=>Math.max(0,...ROWS.map(x=>+x.num||0))+1;

/* ---------- estilos ---------- */
const css=document.createElement('style');css.textContent=`
.o80t{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 16px}.o80t button{min-height:48px;border-radius:14px;font-weight:800;font-size:15px;background:#fff;border:2px solid var(--ln);color:var(--navy)}.o80t button.on{background:var(--navy);border-color:var(--navy);color:#fff}
#o80{display:none}#o80.on{display:block}
.o80sum{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:8px}.o80sum>div{border-radius:14px;padding:10px 8px;text-align:center}.o80sum small{display:block;font-size:11px;font-weight:700}.o80sum b{display:block;font-size:15px;margin-top:2px;word-break:break-word}
.o80bar{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.o80bar .in{flex:1 1 100%}.o80bar button{min-height:40px;padding:6px 14px;border-radius:99px;font-size:13px;font-weight:700;background:#f0f4f8;color:var(--navy)}.o80bar button.on{background:var(--or);color:#fff}
.o80c{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid var(--ln);border-radius:16px;padding:12px;margin-top:10px;cursor:pointer;transition:box-shadow .15s,border-color .15s}.o80c:hover{box-shadow:0 6px 18px #0f2a431f;border-color:#f26b2180}
.o80n{flex:none;display:grid;place-items:center;width:46px;height:46px;border-radius:12px;background:var(--navy);color:#fff;font-weight:800;font-size:14px}
.o80m{flex:1;min-width:0}.o80m b{display:block;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.o80m small{display:block;font-size:12px;color:var(--mut)}.o80m strong{font-size:16px;color:var(--navy)}
.o80s{flex:none;font-size:11px;font-weight:800;padding:6px 10px;border-radius:99px;min-height:34px;white-space:nowrap}
.o80a{display:flex;flex-direction:column;gap:6px;align-items:flex-end;flex:none}.o80a .q{display:flex;gap:6px}.o80a .q button{width:40px;height:40px;border-radius:10px;border:1px solid var(--ln);background:#fff;font-size:17px}
.o80fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:30;border-radius:99px;padding:0 24px;min-height:54px;font-size:15px;box-shadow:0 10px 26px #f26b2166}
 html:not(.mob) .o80fab{display:none} html.mob #bNewO{display:none!important} html.mob .o80fab{bottom:calc(78px + env(safe-area-inset-bottom));z-index:45} .o80vz{text-align:center;color:var(--mut);padding:36px 10px;font-size:14px;line-height:1.5}
.o80{position:fixed;inset:0;z-index:88;background:#f5f7fa;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;color:#1b2a3a}
.o80h{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 10px 8px;background:#fff;border-bottom:1px solid var(--ln)}.o80h b{flex:1;min-width:0;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.o80h small{font-size:11px;color:var(--mut);white-space:nowrap}.o80h .btn{min-height:44px}
.o80b{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:12px 12px 24px}.o80b>div{max-width:760px;margin:0 auto}
.o80k{background:#fff;border:1px solid var(--ln);border-radius:16px;padding:14px;margin-top:12px}.o80k h4{font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:.4px;color:var(--blue);margin:0 0 8px}
.o80k label{display:block;font-size:12px;font-weight:600;color:var(--mut)}.o80k .in{margin-top:3px;min-height:46px;font-size:16px}
.o80g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.o80g .f{grid-column:1/-1}
.o80sb{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:8px}.o80sb button{min-height:56px;border-radius:14px;font-weight:800;font-size:13px;border:2px solid transparent;background:#f0f4f8;color:var(--navy);line-height:1.2}
.o80i{display:flex;gap:8px;align-items:flex-start;border:1px solid var(--ln);border-radius:14px;padding:10px;margin-top:8px;background:#fbfcfd}.o80in{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:var(--navy);color:#fff;font-size:12px;font-weight:800;margin-top:4px}.o80ib{flex:1;min-width:0}
.o80ir{display:grid;grid-template-columns:.7fr 1fr 1fr;gap:8px;margin-top:6px;align-items:end}.o80it small{display:block;font-size:12px;font-weight:600;color:var(--mut)}.o80it b{display:block;min-height:46px;line-height:46px;font-size:14px;text-align:right}
.o80x{flex:none;width:40px;height:40px;border-radius:10px;border:1px solid #f3c6c1;color:#b42318;background:#fff;font-size:15px}
.o80tt{display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center}.o80tt .u{display:flex;gap:6px}.o80tt .u .in{width:110px}.o80tt .u select{width:70px}
.o80to{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding:12px 14px;border-radius:14px;background:var(--navy);color:#fff;font-weight:800}.o80to b{font-size:22px}
.o80f{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid var(--ln);box-shadow:0 -4px 16px #0f2a4314}
.o80f button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:54px;border-radius:12px;background:#f0f4f8;color:var(--navy);font-size:11.5px;font-weight:700}.o80f button i{font-style:normal;font-size:20px}.o80f button.g{background:#16a34a;color:#fff}
.o80eh{display:flex;gap:12px;align-items:center}.o80eh img{width:56px;height:56px;object-fit:contain;border-radius:10px;border:1px solid var(--ln);background:#fff}.o80eh small{display:block;color:var(--mut);font-size:12px;line-height:1.4}
.o80qr{width:150px;height:150px;border:1px solid var(--ln);border-radius:12px;overflow:hidden;flex:none;background:#fff}
.o80p{position:fixed;inset:0;z-index:9999;background:#f5f7fa;overflow:auto;font-family:Inter,system-ui,sans-serif;color:#1b2a3a}.o80p>div{max-width:640px;margin:0 auto;padding:calc(12px + env(safe-area-inset-top)) 14px 110px}
.o80p .k{background:#fff;border:1px solid #dbe3ec;border-radius:16px;padding:16px;margin-top:12px}.o80p .hd{background:linear-gradient(155deg,#0b2036,#15446b);color:#fff;border-radius:20px;padding:22px 16px;text-align:center}.o80p .hd img{width:72px;height:72px;object-fit:contain;border-radius:14px;background:#fff;margin:0 auto 8px;display:block}.o80p .hd h1{font-size:22px;font-weight:800;margin:4px 0}.o80p .hd small{display:block;opacity:.85;font-size:13px;line-height:1.5}
.o80p .li{display:flex;gap:10px;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eef2f6;font-size:14px}.o80p .li:last-child{border:0}.o80p .li small{color:#64748b;display:block}
.o80p .cta{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));max-width:616px;margin:0 auto;display:flex;gap:8px}.o80p .cta a,.o80p .cta button{display:grid;place-items:center;color:#fff;font-weight:800;border-radius:14px;box-shadow:0 8px 24px #0004;min-height:54px}
@media(min-width:700px){.o80g{grid-template-columns:repeat(4,1fr)}.o80g .f{grid-column:span 2}.o80g .f4{grid-column:1/-1}}
.o80sh{position:fixed;inset:0;z-index:95;background:#e5e9ef;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif}
.o80sb2{flex:1;min-height:0;overflow:auto;padding:8px;-webkit-overflow-scrolling:touch}
.o80pg{width:794px;min-height:1000px;background:#fff;margin:0 auto;padding:36px 42px;box-shadow:0 4px 24px #0003;font-size:13px;color:#000;box-sizing:border-box;transform-origin:top left}
.o80pg .ce{outline:0;border-bottom:1px dashed #f26b2199;padding:0 2px;min-width:24px;display:inline-block;max-width:100%;word-break:break-word}.o80pg .ce:empty:before{content:attr(data-ph);color:#aaa}.o80pg .ce:focus{background:#fff4e5}
.o80pg input.ce,.o80pg select.ce{font:inherit;border:0;border-bottom:1px dashed #f26b2199;background:transparent;padding:0;width:auto}
.o80pg .hh{display:flex;gap:14px;align-items:center;justify-content:center;border:1px solid #000;padding:10px;text-align:center;line-height:1.55}.o80pg .hh img{width:90px;height:90px;object-fit:contain}
.o80pg .r3{display:flex;flex-wrap:wrap;gap:6px 14px;margin:8px 0;align-items:center}
.o80pg .bt{background:#dbe5f1;border:1px solid #000;text-align:center;font-weight:800;padding:3px;margin-top:8px}
.o80pg .cl{display:grid;grid-template-columns:repeat(3,1fr);border-left:1px solid #000;border-top:1px solid #000}.o80pg .cl>div{border-right:1px solid #000;border-bottom:1px solid #000;padding:3px 6px}.o80pg .cl .w2{grid-column:span 2}.o80pg .cl .w3{grid-column:1/-1}
.o80pg small{display:block;font-size:9px;font-weight:800;color:#334}
.o80pg table{width:100%;border-collapse:collapse}.o80pg td,.o80pg th{border:1px solid #000;padding:4px 6px;vertical-align:top}.o80pg th{background:#dbe5f1;font-size:11px}.o80pg td.n{text-align:right;white-space:nowrap}
.o80pg .tt{display:grid;grid-template-columns:1fr 1fr;margin-top:8px;border-left:1px solid #000;border-top:1px solid #000}.o80pg .tt>div{border-right:1px solid #000;border-bottom:1px solid #000;padding:4px 8px;display:flex;justify-content:space-between;gap:8px;align-items:center}.o80pg .tt .g{background:#dbe5f1;font-weight:800;font-size:15px}
.o80pg .qb{display:flex;gap:12px;align-items:center;border:1px solid #000;padding:8px;margin-top:8px}.o80pg .qb .q{width:110px;height:110px;flex:none}

`;document.head.appendChild(css);

/* ---------- PDF (modelo corporativo) ---------- */
const imgInfo=u=>new Promise(r=>{if(!u||!/^data:image\//.test(u))return r(null);const i=new Image();i.onload=()=>{try{const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0);r({u:c.toDataURL('image/jpeg',.9),w:c.width,h:c.height})}catch(e){r(null)}};i.onerror=()=>r(null);i.src=u});
async function mkPDF(row){const d=norm(JSON.parse(JSON.stringify(row.dados))),{jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'}),M=14,CW=182,BL=[219,229,241],RH=5.6,
 its=d.itens.filter(x=>x.d||pn(x.v)),c=calc(d),sn=d.snap,em=d.emp,cl=d.cli,lg=await imgInfo(em.logo);
 doc.setLineWidth(.25);doc.setDrawColor(0);doc.setTextColor(0);
 const bx=(x,y,w,h,f)=>{if(f){doc.setFillColor(...f);doc.rect(x,y,w,h,'FD')}else doc.rect(x,y,w,h)},
 fit=(s,w)=>{s=String(s||'');while(s.length>1&&doc.getTextWidth(s)>w-2)s=s.slice(0,-1);return s},
 tx=(s,x,y,st,z,al)=>{doc.setFont('helvetica',st||'normal');doc.setFontSize(z||9);doc.text(String(s==null?'':s),x,y,{align:al||'left'})},
 lab=(t,x,y,w,h)=>{bx(x,y,w,h,BL);tx(t,x+w/2,y+h/2+1.3,'bold',8,'center')},
 val=(t,x,y,w,h,al)=>{bx(x,y,w,h);doc.setFont('helvetica','normal');doc.setFontSize(9);tx(fit(t,w),al=='r'?x+w-1.2:al=='c'?x+w/2:x+1.5,y+h/2+1.3,'normal',9,al=='r'?'right':al=='c'?'center':'left')};
 /* cabeçalho */
 bx(M,12,CW,34);let cx=M+CW/2;
 if(lg){const s=Math.min(32/lg.w,30/lg.h),w=lg.w*s,h=lg.h*s;doc.addImage(lg.u,'JPEG',M+2+(32-w)/2,14+(30-h)/2,w,h);cx=M+36+(CW-36)/2}
 let y=19;const L=[[em.nome||'Sua empresa','bolditalic',12]];if(em.doc)L.push(['CPF/CNPJ: '+em.doc,'bold',9]);if(em.end){doc.setFontSize(9);doc.splitTextToSize(em.end,CW-44).slice(0,2).forEach(t=>L.push([t,'normal',9]))}if(em.tel)L.push(['Tel: '+em.tel,'normal',9]);if(em.mail)L.push(['e-mail: '+em.mail,'normal',9]);
 L.slice(0,6).forEach((l,i)=>{tx(l[0],cx,y,l[1],l[2],'center');y+=i?4.6:6});
 /* nº e datas */
 y=48;lab('Orçamento nº:',M,y,27,6.5);val(String(row.num),M+27,y,14,6.5,'c');lab('Emitido em:',M+41,y,27,6.5);val(fd(d.emi),M+68,y,38,6.5,'c');lab('Válido até:',M+106,y,25,6.5);val(fd(d.val),M+131,y,51,6.5,'c');
 /* cliente */
 y=57;bx(M,y,CW,6,BL);tx('CLIENTE',M+CW/2,y+4.3,'bold',10,'center');y+=6;const R=5.5;
 lab('NOME',M,y,24,R);val(cl.nome,M+24,y,158,R);y+=R;
 lab('TELEFONE',M,y,24,R);val(cl.tel,M+24,y,44,R);lab('E-MAIL',M+68,y,20,R);val(cl.mail,M+88,y,94,R);y+=R;
 lab('CPF/CNPJ',M,y,24,R);val(cl.doc,M+24,y,158,R);y+=R;
 lab('ENDEREÇO',M,y,24,R);val(cl.end,M+24,y,106,R);lab('CEP',M+130,y,14,R);val(cl.cep,M+144,y,38,R);y+=R;
 lab('BAIRRO',M,y,24,R);val(cl.bairro,M+24,y,46,R);lab('CIDADE',M+70,y,18,R);val(cl.cidade,M+88,y,50,R);lab('ESTADO',M+138,y,18,R);val(cl.uf,M+156,y,26,R);y+=R+3;
 /* itens */
 const CX=[M,M+12,M+112,M+132,M+157],CWD=[12,100,20,25,25],hdr=()=>{bx(M,y,CW,6,BL);tx('ORÇAMENTO',M+CW/2,y+4.3,'bold',10,'center');y+=6;['ITEM','DESCRIÇÃO','QUANT.','VALOR','TOTAL'].forEach((t,i)=>{bx(CX[i],y,CWD[i],5.5,BL);tx(t,CX[i]+CWD[i]/2,y+3.9,'bold',8,'center')});y+=5.5};
 const FH=21+(d.pgto?8:0)+(d.obs?8+Math.min(5,doc.splitTextToSize(d.obs,CW-4).length)*4:0)+(sn?38:0)+14,LIM=285-FH;
 hdr();const rows=its.slice();let FS=9,LH=4,RH2=RH;const need=()=>{doc.setFont('helvetica','normal');doc.setFontSize(FS);return rows.reduce((a,x)=>a+Math.max(RH2,doc.splitTextToSize((x&&x.d)||'',CWD[1]-3).length*LH+1.8),0)},avail=LIM-y;
 while(FS>6.5&&need()>avail){FS-=.5;LH=FS*.44;RH2=Math.max(3.6,RH*FS/9)}
 while(rows.length<18&&need()+RH2<=avail)rows.push(null);
 for(let i=0;i<rows.length;i++){const x=rows[i];let ls=[''];if(x){doc.setFont('helvetica','normal');doc.setFontSize(FS);ls=doc.splitTextToSize(x.d||'',CWD[1]-3)}const h=Math.max(RH2,ls.length*LH+1.8);
  if(y+h>LIM){if(!x)break;doc.addPage();y=14;hdr()}
  CX.forEach((cx2,k)=>bx(cx2,y,CWD[k],h));const by=y+Math.min(3.9,h*.72)+(FS<9?.2:0);tx(String(i+1),CX[0]+6,by,'normal',Math.min(8,FS),'center');
  if(x){ls.forEach((t,k)=>tx(t,CX[1]+1.5,by+k*LH,'normal',FS));const t=pn(x.q)*pn(x.v);tx(x.q||'',CX[2]+10,by,'normal',FS,'center');tx(x.v!==''?fm(pn(x.v)):'',CX[3]+CWD[3]-1.2,by,'normal',FS,'right');tx(t?fm(t):'',CX[4]+CWD[4]-1.2,by,'normal',FS,'right')}
  y+=h}
 /* totais */
 y+=3;const T=6.5,dl=d.desc.t=='%'&&pn(d.desc.v)?` (${d.desc.v}%)`:'',al=d.acr.t=='%'&&pn(d.acr.v)?` (${d.acr.v}%)`:'';
 lab('SUBTOTAL',M,y,36,T);val('R$ '+fm(c.sub),M+36,y,55,T,'r');lab('DESCONTO'+dl,M+91,y,36,T);val(c.dc?'- R$ '+fm(c.dc):'R$ -',M+127,y,55,T,'r');y+=T;
 lab('ACRÉSCIMO'+al,M,y,36,T);val(c.ac?'R$ '+fm(c.ac):'R$ -',M+36,y,55,T,'r');bx(M+91,y,36,T,BL);tx('TOTAL',M+109,y+T/2+1.6,'bold',11,'center');bx(M+127,y,55,T,[142,169,219]);tx('R$ '+fm(c.tot),M+180,y+T/2+1.6,'bold',11,'right');y+=T+4;if(d.pgto){lab('PAGAMENTO',M,y,36,6.5);val(d.pgto,M+36,y,146,6.5);y+=10.5}
 if(d.obs){const ol=doc.splitTextToSize(d.obs,CW-4).slice(0,5);bx(M,y,CW,6,BL);tx('OBSERVAÇÕES',M+CW/2,y+4.3,'bold',9,'center');bx(M,y+6,CW,ol.length*4+2);ol.forEach((t,k)=>tx(t,M+2,y+10.5+k*4,'normal',9));y+=8+ol.length*4+3}
 if(sn){bx(M,y,CW,34);try{const q=qrcode(0,'M');q.addData(sn.code);q.make();const n=q.getModuleCount(),cs=30/(n+4);doc.setFillColor(255,255,255);doc.rect(M+2,y+2,30,30,'F');doc.setFillColor(0,0,0);for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))doc.rect(M+2+(k+2)*cs,y+2+(r+2)*cs,cs+.05,cs+.05,'F')}catch(e){}
  tx('PAGUE COM PIX',M+38,y+8,'bold',11);tx('Valor: R$ '+fm(c.tot),M+38,y+14,'bold',10);if(sn.titular)tx('Titular: '+fit(sn.titular,130),M+38,y+19.5,'normal',9);if(sn.tipo&&sn.chave)tx(sn.tipo+': '+fit(sn.chave,140),M+38,y+24.5,'normal',9);tx('Escaneie o QR Code com o app do seu banco.',M+38,y+30,'italic',8);y+=36}
 /* assinaturas */
 const ys=Math.max(y+10,276);if(ys>286){doc.addPage()}const yy=ys>286?30:ys;doc.setLineWidth(.2);doc.line(M,yy,M+80,yy);doc.line(M+102,yy,M+182,yy);tx(fit(em.nome||'Profissional',80),M+40,yy+4,'normal',9,'center');tx(fit(cl.nome||'Cliente',80),M+142,yy+4,'normal',9,'center');
 const np=doc.getNumberOfPages();if(np>1)for(let p=1;p<=np;p++){doc.setPage(p);tx('Página '+p+'/'+np,105,292,'normal',8,'center')}
 return doc}
const pdfNome=r=>'orcamento-'+r.num+'-'+String(r.cliente||'cliente').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,30)+'.pdf';
async function pdfGo(row,share){try{const doc=await mkPDF(row),nm=pdfNome(row);
 if(share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){try{const f=new File([doc.output('blob')],nm,{type:'application/pdf'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Orçamento nº '+row.num});return}}catch(x){if(x&&x.name=='AbortError')return}}
 const bl=doc.output('blob'),u=URL.createObjectURL(bl),a=document.createElement('a');a.href=u;a.download=nm;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},5000)}catch(e){console.error(e);tst('Não consegui gerar o PDF')}}
const linkDe=id=>location.origin+'/orcamento/'+id,
foneWa=t=>{const n=String(t||'').replace(/\D/g,'');return!n?'':n.length<=11?'55'+n:n},
msgWa=(row,link)=>{const d=row.dados,c=calc(d),n=d.cli.nome?'Olá, '+d.cli.nome.split(' ')[0]+'! ':'Olá! ';return n+'Segue o orçamento nº '+row.num+(d.emp.nome?' de '+d.emp.nome:'')+'.\n💰 Total: '+brl(c.tot)+(d.val?'\n📅 Válido até '+fd(d.val):'')+(d.pgto?'\n💳 '+d.pgto:'')+(link?'\n\nVeja os detalhes e pague pelo Pix:\n'+link:'\n\n'+d.itens.filter(x=>x.d).map((x,i)=>(i+1)+'. '+x.d+' — '+(x.q||1)+' x '+brl(pn(x.v))).join('\n'))};

/* ---------- editor ---------- */
async function editor(row,novo){const emp=await empGet(),pl=await pixGet();let d=norm(row.dados||novoD(emp));row.dados=d;if(row.status=='concluido')row.status='pago';
 if(emp.nome||emp.doc||novo){for(const k of['nome','doc','end','tel','mail','logo'])if(emp[k])d.emp[k]=emp[k]}
 const book=(()=>{const m={};ROWS.slice().reverse().forEach(r=>{const c=r.cli||(r.dados&&r.dados.cli);if(c&&c.nome)m[c.nome.trim().toLowerCase()]=c});return m})();
 const o=document.createElement('div');o.className='o80';let dirty=!!novo&&0,tm=null,busy=false,gone=false;
 const itemH=(x,i)=>`<div class="o80i" data-i="${i}"><div class="o80in">${i+1}</div><div class="o80ib"><textarea class="in" data-k="d" rows="2" placeholder="Descrição do serviço ou material" style="min-height:70px">${E(x.d)}</textarea><div class="o80ir"><label>Qtd<input class="in" data-k="q" inputmode="decimal" value="${E(x.q)}"></label><label>Valor unit. (R$)<input class="in" data-k="v" inputmode="decimal" placeholder="0,00" value="${E(x.v)}"></label><div class="o80it"><small>Total</small><b data-t>${brl(pn(x.q)*pn(x.v))}</b></div></div></div><button class="o80x" data-a="rm" aria-label="Remover item">✕</button></div>`,
 inp=(l,f,v,x='',c='')=>`<label class="${c}">${l}<input class="in" data-f="${f}" value="${E(v)}" ${x}></label>`,
 uni=(f,o2)=>`<div class="u"><input class="in" data-f="${f}.v" inputmode="decimal" placeholder="0,00" value="${E(o2.v)}"><select class="in" data-f="${f}.t"><option ${o2.t=='R$'?'selected':''}>R$</option><option ${o2.t=='%'?'selected':''}>%</option></select></div>`;
 o.innerHTML=`<div class="o80h"><button class="btn ghost" data-a="bk" aria-label="Voltar">←</button><b>Orçamento nº ${row.num}</b><small data-sv></small><button class="btn or" data-a="sv">💾 Salvar</button></div>
 <div class="o80b"><div>
  <div class="o80k" style="margin-top:0"><h4>Status</h4><div class="o80sb">${Object.entries(ST).map(([k,v])=>`<button data-a="st" data-v="${k}">${v[1]}<br>${v[0]}</button>`).join('')}</div></div>
  <div class="o80k"><h4>Seu cabeçalho</h4><div class="o80eh" data-eh></div></div>
  <div class="o80k"><h4>Datas</h4><div class="o80g"><label>Emitido em<input type="date" class="in" data-f="emi" value="${E(d.emi)}"></label><label>Válido até<input type="date" class="in" data-f="val" value="${E(d.val)}"></label><label>Validade da proposta (dias)<input class="in" data-f="vd" inputmode="numeric" value="${E(d.vd)}"></label><label class="f">Condições de pagamento<input class="in" data-f="pgto" list="o80pgl" value="${E(d.pgto)}" placeholder="Ex.: 50% entrada + 50% na conclusão"></label><datalist id="o80pgl"><option value="À vista no Pix"><option value="50% de entrada + 50% na conclusão"><option value="30% de entrada + 70% na entrega"><option value="Cartão em até 12x"></datalist></div></div>
  <div class="o80k"><h4>Cliente</h4><div class="o80g"><label class="f f4">Nome<input class="in" data-f="cli.nome" list="o80cl" autocomplete="off" value="${E(d.cli.nome)}"></label><datalist id="o80cl">${Object.values(book).map(c=>`<option value="${E(c.nome)}">`).join('')}</datalist>
   ${inp('Telefone / WhatsApp','cli.tel',d.cli.tel,'type="tel" inputmode="tel" autocomplete="off"')}${inp('CPF / CNPJ','cli.doc',d.cli.doc,'inputmode="numeric" autocomplete="off"')}${inp('E-mail','cli.mail',d.cli.mail,'type="email" autocomplete="off"','f')}${inp('Endereço','cli.end',d.cli.end,'autocomplete="off"','f')}${inp('CEP','cli.cep',d.cli.cep,'inputmode="numeric" autocomplete="off"')}${inp('Bairro','cli.bairro',d.cli.bairro,'autocomplete="off"')}${inp('Cidade','cli.cidade',d.cli.cidade,'autocomplete="off"')}${inp('UF','cli.uf',d.cli.uf,'maxlength="2" autocapitalize="characters" autocomplete="off"')}</div></div>
  <div class="o80k"><h4>Itens do orçamento</h4><div data-it></div><button class="btn ghost w-full" style="width:100%;margin-top:10px;min-height:48px" data-a="add">＋ Adicionar item</button></div>
  <div class="o80k"><h4>Valores</h4><div class="o80tt"><span>Subtotal</span><b data-sub style="text-align:right"></b><span>Desconto</span>${uni('desc',d.desc)}<span>Acréscimo</span>${uni('acr',d.acr)}</div><div class="o80to"><span>TOTAL</span><b data-tot></b></div></div>
  <div class="o80k"><h4>Pagamento com Pix</h4><div data-px></div></div>
  <div class="o80k"><h4>Observações / condições</h4><textarea class="in" data-f="obs" rows="3" maxlength="800" placeholder="Ex.: 50% na aprovação e 50% na entrega. Material incluso.">${E(d.obs)}</textarea></div>
  <button class="btn danger" style="width:100%;margin-top:14px;min-height:48px" data-a="del">🗑 Excluir orçamento</button>
 </div></div>
 <div class="o80f"><button data-a="pdf"><i>📄</i>PDF</button><button data-a="ver"><i>✏️</i>Editar folha</button><button class="g" data-a="wa"><i>📲</i>WhatsApp</button><button data-a="lk"><i>🔗</i>Copiar link</button></div>`;
 document.body.appendChild(o);const q=s=>o.querySelector(s),qa=s=>o.querySelectorAll(s);
 const ehP=()=>{const e=d.emp;q('[data-eh]').innerHTML=(e.logo&&/^data:image\//.test(e.logo)?`<img src="${E(e.logo)}" alt="">`:'')+`<div><b>${E(e.nome||'Sem nome da empresa')}</b><small>${[e.doc&&'CPF/CNPJ: '+E(e.doc),E(e.end),e.tel&&'Tel: '+E(e.tel),E(e.mail)].filter(Boolean).join('<br>')||'Preencha em Configurações &gt; Empresa'}</small><button class="btn ghost" style="min-height:36px;padding:2px 12px;margin-top:6px" data-a="cfg">⚙ Editar dados da empresa</button></div>`},
 itP=()=>{q('[data-it]').innerHTML=d.itens.map(itemH).join('')||'<p class="o80vz">Nenhum item. Toque em “Adicionar item”.</p>'},
 stP=()=>qa('[data-a="st"]').forEach(b=>{const s=ST[b.dataset.v],on=row.status==b.dataset.v;b.style.background=on?s[3]:'';b.style.color=on?s[2]:'';b.style.borderColor=on?s[2]:'transparent'}),
 pxP=()=>{const c=calc(d),p=q('[data-px]');if(!pl.length){p.innerHTML=`<p class="text-sm" style="color:#64748b">Cadastre seu Pix para o orçamento levar um QR Code com o valor automático.</p><button class="btn or" style="width:100%;min-height:48px;margin-top:8px" data-a="pix">💳 Cadastrar Pix</button>`;d.snap=null;return}
  const sn=snapPix(d,pl,c.tot);d.snap=sn;p.innerHTML=`<label style="display:flex;gap:10px;align-items:center;font-size:14px;color:#1b2a3a;font-weight:600"><input type="checkbox" data-f="pix.on" ${d.pix.on?'checked':''} style="width:20px;height:20px;accent-color:#f26b21"> Incluir QR Code Pix com o valor do orçamento</label>${d.pix.on?`${pl.length>1?`<label style="margin-top:8px">Qual Pix usar<select class="in" data-f="pix.i">${pl.map((x,i)=>`<option value="${i}" ${i==d.pix.i?'selected':''}>${E(x.rotulo||x.nome||'Pix')} — ${E(x.chave||'copia e cola')}</option>`).join('')}</select></label>`:''}<div style="display:flex;gap:12px;align-items:center;margin-top:10px"><div class="o80qr">${sn?qrSvg(sn.code):''}</div><div class="text-sm"><b>${brl(c.tot)}</b><br><small style="color:#64748b">${sn?E(sn.titular)+'<br>'+E(sn.tipo)+': '+E(sn.chave):''}</small></div></div>`:''}`},
 tots=()=>{const c=calc(d);q('[data-sub]').textContent=brl(c.sub);q('[data-tot]').textContent=brl(c.tot);return c};
 ehP();itP();stP();tots();pxP();
 const sv=t=>q('[data-sv]').textContent=t,
 gravar=async(force)=>{if(busy)return;busy=true;clearTimeout(tm);try{d.emp.nome||Object.assign(d.emp,{});const c=calc(d);row.dados=d;row.total=c.tot;row.cliente=(d.cli.nome||'').trim()||null;row.atualizado=new Date().toISOString();if(!row.criado)row.criado=row.atualizado;d.snap=snapPix(d,pl,c.tot);sv('Salvando…');const r=await put(row);dirty=0;sv(r=='cloud'?'Salvo ✅':r=='local'?'Salvo no aparelho':'Salvo no aparelho 📴');if(force&&r=='pend')tst('Sem internet: vai para a conta quando voltar')}finally{busy=false}},
 mark=()=>{dirty=1;sv('…');clearTimeout(tm);tm=setTimeout(()=>gravar(),1400)},
 sair=async()=>{if(dirty)await gravar();clearTimeout(tm);gone=true;o.remove();if(window.orc80)window.orc80.refresh()};
 const setP=(path,v)=>{const k=path.split('.');let t=d;for(let i=0;i<k.length-1;i++)t=t[k[i]];t[k[k.length-1]]=v};
 o.addEventListener('input',e=>{const t=e.target,f=t.dataset.f;
  if(t.dataset.k){const i=+t.closest('.o80i').dataset.i;d.itens[i][t.dataset.k]=t.value;const b=t.closest('.o80i').querySelector('[data-t]');b.textContent=brl(pn(d.itens[i].q)*pn(d.itens[i].v));tots();pxP();mark();return}
  if(!f)return;if(t.type=='checkbox'){setP(f,t.checked);pxP();mark();return}
  let v=t.value;if(f=='pix.i')v=+v;if(f=='cli.uf')v=v.toUpperCase();setP(f,v);if(f=='vd'||f=='emi'){const n=parseInt(d.vd);if(n>0&&d.emi){d.val=addD(d.emi,n);const i=q('[data-f="val"]');if(i)i.value=d.val}}
  if(f.startsWith('desc')||f.startsWith('acr')){tots();pxP()}mark()});
 o.addEventListener('change',e=>{const t=e.target;if(t.dataset.f=='cli.nome'){const c=book[(t.value||'').trim().toLowerCase()];if(c){for(const k of['doc','tel','mail','end','bairro','cep','cidade','uf'])if(!d.cli[k]&&c[k]){d.cli[k]=c[k];const i=q(`[data-f="cli.${k}"]`);if(i)i.value=c[k]}mark()}}
  if(t.dataset.f=='cli.doc'){const n=t.value.replace(/\D/g,'');if(n.length==11)t.value=d.cli.doc=n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');else if(n.length==14)t.value=d.cli.doc=n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,'$1.$2.$3/$4-$5')}});
 const folha=async()=>{await garante();const w=document.createElement('div');w.className='o80sh';
 w.innerHTML=`<div class="o80h"><button class="btn ghost" data-z="bk" aria-label="Voltar">←</button><b>Folha do orçamento nº ${row.num}</b><small>toque nos textos para editar</small><button class="btn or" data-z="sv">💾</button></div><div class="o80sb2"><div class="o80pg" data-pg></div></div><div class="o80f" style="grid-template-columns:repeat(3,1fr)"><button data-z="add"><i>＋</i>Item</button><button class="g" data-z="pdf"><i>📄</i>Baixar PDF</button><button data-z="pr"><i>🖨</i>Imprimir</button></div>`;
 document.body.appendChild(w);const g=s=>w.querySelector(s),pg=g('[data-pg]'),zm=()=>{pg.style.zoom=Math.min(1,(innerWidth-16)/794)};zm();addEventListener('resize',zm);
 const ce=(p,v,ph)=>`<span class="ce" contenteditable="true" data-e="${p}" data-ph="${ph||''}">${E(v)}</span>`,cell=(l,p,v,c='')=>`<div class="${c}"><small>${l}</small>${ce(p,v)}</div>`;
 const draw=()=>{const e=d.emp,cl=d.cli,n=Math.max(d.itens.length,8);pg.innerHTML=`<div class="hh">${e.logo&&/^data:image\//.test(e.logo)?`<img src="${E(e.logo)}" alt="">`:''}<div><b style="font-size:18px">${ce('emp.nome',e.nome,'Empresa')}</b><br>CPF/CNPJ: ${ce('emp.doc',e.doc,'documento')}<br>${ce('emp.end',e.end,'Endereço')}<br>Tel: ${ce('emp.tel',e.tel,'telefone')} · ${ce('emp.mail',e.mail,'e-mail')}</div></div>
 <div class="r3"><span><b>Orçamento nº:</b> ${row.num}</span><span><b>Emitido em:</b> <input type="date" class="ce" data-e="emi" value="${E(d.emi)}"></span><span><b>Válido até:</b> <input type="date" class="ce" data-e="val" value="${E(d.val)}"></span><span><b>Validade:</b> ${ce('vd',d.vd,'7')} dias</span></div>
 <div class="bt">CLIENTE</div><div class="cl">${cell('NOME','cli.nome',cl.nome,'w2')}${cell('TELEFONE','cli.tel',cl.tel)}${cell('E-MAIL','cli.mail',cl.mail,'w2')}${cell('CPF/CNPJ','cli.doc',cl.doc)}${cell('ENDEREÇO','cli.end',cl.end,'w2')}${cell('CEP','cli.cep',cl.cep)}${cell('BAIRRO','cli.bairro',cl.bairro)}${cell('CIDADE','cli.cidade',cl.cidade)}${cell('UF','cli.uf',cl.uf)}</div>
 <div class="bt">ORÇAMENTO</div><table><tr><th style="width:36px">ITEM</th><th>DESCRIÇÃO</th><th style="width:70px">QUANT.</th><th style="width:100px">VALOR</th><th style="width:100px">TOTAL</th></tr>${Array.from({length:n},(_,i)=>{const x=d.itens[i];return x?`<tr><td class="n">${i+1}</td><td>${ce('itens.'+i+'.d',x.d,'descrição')}</td><td>${ce('itens.'+i+'.q',x.q)}</td><td class="n">${ce('itens.'+i+'.v',x.v,'0,00')}</td><td class="n" data-rt="${i}"></td></tr>`:`<tr><td class="n">${i+1}</td><td>&nbsp;</td><td></td><td></td><td></td></tr>`}).join('')}</table>
 <div class="tt"><div>SUBTOTAL<b data-s></b></div><div>DESCONTO <span>${ce('desc.v',d.desc.v,'0')} <select class="ce" data-e="desc.t"><option ${d.desc.t=='R$'?'selected':''}>R$</option><option ${d.desc.t=='%'?'selected':''}>%</option></select></span></div><div>ACRÉSCIMO <span>${ce('acr.v',d.acr.v,'0')} <select class="ce" data-e="acr.t"><option ${d.acr.t=='R$'?'selected':''}>R$</option><option ${d.acr.t=='%'?'selected':''}>%</option></select></span></div><div class="g">TOTAL<b data-t></b></div></div>
 <div class="bt">CONDIÇÕES DE PAGAMENTO</div><div style="border:1px solid #000;padding:4px 8px">${ce('pgto',d.pgto,'Ex.: 50% entrada + 50% na conclusão')}</div>
 <div class="bt">OBSERVAÇÕES</div><div style="border:1px solid #000;padding:4px 8px;white-space:pre-wrap">${ce('obs',d.obs,'Observações')}</div><div data-qb></div>`;upd()},
 upd=()=>{const c=calc(d);g('[data-s]').textContent=brl(c.sub);g('[data-t]').textContent=brl(c.tot);d.itens.forEach((x,i)=>{const r=g('[data-rt="'+i+'"]');if(r)r.textContent=pn(x.q)*pn(x.v)?brl(pn(x.q)*pn(x.v)):''});
  d.snap=snapPix(d,pl,c.tot);g('[data-qb]').innerHTML=d.snap?`<div class="qb"><div class="q">${qrSvg(d.snap.code)}</div><div><b>PAGUE COM PIX</b><br>Valor: <b>${brl(c.tot)}</b><br>${E(d.snap.titular)}${d.snap.chave?'<br>'+E(d.snap.tipo)+': '+E(d.snap.chave):''}</div></div>`:''};
 draw();
 w.addEventListener('input',e=>{const t=e.target,p=t.dataset.e;if(!p)return;let v=t.tagName=='SPAN'?t.innerText.replace(/\n$/,''):t.value;if(p=='cli.uf')v=v.toUpperCase();setP(p,v);if(p=='vd'||p=='emi'){const n=parseInt(d.vd);if(n>0&&d.emi){d.val=addD(d.emi,n);const i=g('[data-e="val"]');if(i)i.value=d.val}}upd();mark()});
 w.addEventListener('paste',e=>{if(e.target.tagName=='SPAN'){e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain'))}});
 w.addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.tagName=='SPAN'&&e.target.dataset.e!='obs')e.preventDefault()});
 w.addEventListener('click',async e=>{const b=e.target.closest('[data-z]');if(!b)return;const a=b.dataset.z;
  if(a=='bk'){await gravar();removeEventListener('resize',zm);w.remove();o.remove();gone=true;editor(row,false);return}
  if(a=='sv'){await gravar(1);tst('Orçamento salvo');return}
  if(a=='add'){d.itens.push({d:'',q:'1',v:''});draw();mark();return}
  if(a=='pdf'){await gravar(1);pdfGo(row,false);return}
  if(a=='pr'){await gravar(1);const wn=window.open('','_blank');try{const u=(await mkPDF(row)).output('bloburl');if(wn)wn.location.href=u;else pdfGo(row,false)}catch(x){if(wn)wn.close();tst('Não consegui gerar o PDF')}}})};
 const garante=async()=>{await gravar(1);return row};
 o.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
  if(a=='bk')return sair();
  if(a=='sv'){await gravar(1);tst('Orçamento salvo');return}
  if(a=='st'){row.status=b.dataset.v;stP();mark();if(row.status=='pago'&&window.docs&&await yes('Pagamento confirmado! Gerar o recibo agora?')){await gravar(1);window.docs.reciboOrc(row)}return}
  if(a=='add'){d.itens.push({d:'',q:'1',v:''});itP();const l=qa('.o80i');l[l.length-1].querySelector('textarea').focus();mark();return}
  if(a=='rm'){const i=+b.closest('.o80i').dataset.i;d.itens.splice(i,1);itP();tots();pxP();mark();return}
  if(a=='cfg'){const bc=$('bCfg');if(bc){await sair();bc.click()}return}
  if(a=='pix'){if(window.pay75){await sair();window.pay75.manager()}return}
  if(a=='pdf'){await garante();pdfGo(row,false);return}
  if(a=='ver'){await folha();return}
  if(a=='lk'){await garante();if(isLocal()||row._p){tst('Entre na sua conta e conecte à internet para gerar o link');return}try{await navigator.clipboard.writeText(linkDe(row.id));tst('Link copiado')}catch(x){prompt('Copie o link:',linkDe(row.id))}return}
  if(a=='wa'){await garante();const lk=(!isLocal()&&!row._p)?linkDe(row.id):'',ph=foneWa(d.cli.tel);window.open('https://wa.me/'+ph+'?text='+encodeURIComponent(msgWa(row,lk)),'_blank');if(!lk)tst('Sem link online: enviei o resumo em texto');return}
  if(a=='del'){if(!(await yes('Excluir este orçamento? Não dá para desfazer.')))return;clearTimeout(tm);dirty=0;if(await apagar(row.id)){gone=true;o.remove();window.orc80&&window.orc80.refresh()}return}});
 if(novo){sv('Novo')}else sv('')}

/* ---------- painel na dashboard ---------- */
let tab=localStorage.getItem(TK)=='o'?'o':'p',filt='todos',busca='';
const painel=()=>$('o80');
async function novoOrc(){const emp=await empGet();if(!ROWS.length)await listar();const row={id:nid(),num:proxNum(),status:'pendente',cliente:null,total:0,dados:novoD(emp),criado:new Date().toISOString(),atualizado:new Date().toISOString()};editor(row,true)}
async function abrir(id){let r=ROWS.find(x=>x.id==id);const f=await pegar(id);if(!f){tst('Sem internet: abra este orçamento uma vez com conexão para usá-lo offline');return}editor(f,false)}
function pintar(){const p=painel();if(!p)return;const R=ROWS.map(x=>x.status=='concluido'?{...x,status:'pago'}:x),cnt=k=>R.filter(x=>x.status==k).length,sm=k=>R.filter(x=>x.status==k).reduce((s,x)=>s+(+x.total||0),0);
 const L=R.filter(x=>(filt=='todos'||x.status==filt)&&(!busca||(String(x.cliente||'').toLowerCase().includes(busca)||String(x.num).includes(busca))));
 p.innerHTML=`<div class="o80sum">${Object.entries(ST).map(([k,v])=>`<div style="background:${v[3]};color:${v[2]}"><small>${v[1]} ${v[0]}</small><b>${brl(sm(k))}</b><small>${cnt(k)} orçamento(s)</small></div>`).join('')}</div>
 <div class="o80bar"><input id="o80q" class="in" placeholder="🔎 Buscar por cliente ou número" value="${E(busca)}"><button data-f="todos" class="${filt=='todos'?'on':''}">Todos (${R.length})</button>${Object.entries(ST).map(([k,v])=>`<button data-f="${k}" class="${filt==k?'on':''}">${v[1]} ${v[0]} (${cnt(k)})</button>`).join('')}</div>
 <div>${L.length?L.map(r=>{const s=ST[r.status]||ST.pendente,c=r.cli||(r.dados&&r.dados.cli)||{},emi=r.emi||(r.dados&&r.dados.emi)||r.atualizado;return`<div class="o80c" data-o="${r.id}"><div class="o80n">${r.num}</div><div class="o80m"><b>${E(r.cliente||'Sem cliente')}</b><small>Emitido em ${fd(emi)}${r._p?' • 📴 pendente':''}</small><strong>${brl(r.total)}</strong></div><div class="o80a"><button class="o80s" data-s="${r.id}" style="background:${s[3]};color:${s[2]}">${s[1]} ${s[0]}</button><div class="q">${c.tel?`<button data-w="${r.id}" aria-label="WhatsApp do cliente">📲</button>`:''}<button data-c="${r.id}" aria-label="Duplicar">⧉</button><button data-x="${r.id}" aria-label="Excluir">🗑</button></div></div></div>`}).join(''):`<div class="o80vz">🧾 ${R.length?'Nenhum orçamento neste filtro.':'Nenhum orçamento ainda.<br>Toque em <b>Novo orçamento</b> para criar o primeiro, sem precisar de planta.'}</div>`}</div>
 <button class="btn or o80fab" data-n>＋ Novo orçamento</button>`}
async function carregar(){const p=painel();if(!p)return;if(!ROWS.length)ROWS=cLoad();pintar();await listar();pintar()}
function aba(t){tab=t;try{localStorage.setItem(TK,t)}catch(e){}const p=painel(),vp=$('vP');if(!p||!vp)return;p.classList.toggle('on',t=='o');
 $('gr').style.display=t=='o'?'none':'';['bNew','bImp74','bPf74'].forEach(i=>{const b=$(i);if(b)b.style.display=t=='o'?'none':''});{const bo=$('bNewO');if(bo)bo.style.display=t=='o'?'':'none'}
 const h=vp.querySelector('h2'),s=h&&h.parentElement.querySelector('p');if(h)h.textContent=t=='o'?'Orçamentos':'Meus projetos';if(s)s.textContent=t=='o'?'Crie, envie e acompanhe seus orçamentos.':'Abra um projeto ou comece um novo.';
 document.querySelectorAll('.o80t button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));if(t=='o'&&ses)carregar()}
function injeta(){const gr=$('gr');if(!gr||$('o80'))return;const tb=document.createElement('div');tb.className='o80t';tb.innerHTML='<button data-t="p">📐 Projetos</button><button data-t="o">🧾 Orçamentos</button>';gr.before(tb);const p=document.createElement('div');p.id='o80';gr.after(p);
 {const bn=$('bNew');if(bn&&!$('bNewO')){const b=document.createElement('button');b.id='bNewO';b.className='btn or ml-auto py-2.5 px-5';b.textContent='＋ Novo orçamento';b.style.display='none';b.onclick=novoOrc;bn.after(b)}}
 tb.onclick=e=>{const b=e.target.closest('button');if(b)aba(b.dataset.t)};
 p.addEventListener('input',e=>{if(e.target.id=='o80q'){busca=e.target.value.trim().toLowerCase();const c=e.target.selectionStart;pintar();const i=$('o80q');i.focus();try{i.setSelectionRange(c,c)}catch(x){}}});
 p.addEventListener('click',async e=>{const t=e.target;
  if(t.closest('[data-n]'))return novoOrc();
  const f=t.closest('[data-f]');if(f&&f.tagName=='BUTTON'){filt=f.dataset.f;return pintar()}
  const s=t.closest('[data-s]');if(s){e.stopPropagation();const r=ROWS.find(x=>x.id==s.dataset.s),n={pendente:'enviado',enviado:'aprovado',aprovado:'pago',pago:'cancelado',cancelado:'pendente'}[r.status]||'pendente';
   const old=r.status;r.status=n;r.atualizado=new Date().toISOString();pintar();
   if(isLocal()){cPut(r,false)}else if(online()){try{const x=await rq('/rest/v1/orcamentos?id=eq.'+r.id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:n,atualizado:r.atualizado})});if(!x.ok)throw 0;cPut(r,false)}catch(x){r.status=old;pintar();tst('Não consegui mudar o status')}}
   else{r.status=old;pintar();tst('Precisa de internet para mudar o status aqui; abra o orçamento')}return}
  const w=t.closest('[data-w]');if(w){e.stopPropagation();const r=ROWS.find(x=>x.id==w.dataset.w),f2=await pegar(r.id);if(!f2)return tst('Abra este orçamento uma vez com internet');const lk=(!isLocal()&&!f2._p)?linkDe(f2.id):'';window.open('https://wa.me/'+foneWa(f2.dados.cli.tel)+'?text='+encodeURIComponent(msgWa(f2,lk)),'_blank');return}
  const c=t.closest('[data-c]');if(c){e.stopPropagation();const f2=await pegar(c.dataset.c);if(!f2)return tst('Abra este orçamento uma vez com internet');const d=JSON.parse(JSON.stringify(f2.dados));d.emi=hoje();d.val=addD(d.emi,parseInt(d.vd)||7);d.snap=null;d.cli={nome:'',doc:'',tel:'',mail:'',end:'',bairro:'',cep:'',cidade:'',uf:''};const n={id:nid(),num:proxNum(),status:'pendente',cliente:null,total:f2.total,dados:d,criado:new Date().toISOString(),atualizado:new Date().toISOString()};await put(n);tst('Duplicado: informe o novo cliente');editor(n,false);return}
  const x=t.closest('[data-x]');if(x){e.stopPropagation();if(await yes('Excluir este orçamento?')){if(await apagar(x.dataset.x))pintar()}return}
  const o=t.closest('[data-o]');if(o)abrir(o.dataset.o)});
 const top=document.querySelector('#vP .top'),fb=$('bFb');if(top&&fb&&!$('bOrc80')){const b=document.createElement('button');b.id='bOrc80';b.className='btn ghost';b.title='Orçamentos';b.innerHTML='🧾<span class="lb">&nbsp;Orçamentos</span>';b.onclick=()=>{if(typeof show=='function'&&$('vP').classList.contains('hidden'))show('vP');aba('o');scrollTo(0,0)};fb.before(b)}
 new MutationObserver(()=>{if(!$('vP').classList.contains('hidden')&&tab=='o')carregar()}).observe($('vP'),{attributes:true,attributeFilter:['class']});
 aba(tab)}

/* ---------- visualização pública (link do WhatsApp) ---------- */
async function pub(id){document.title='Orçamento • DC CAD Pro';const pg=document.createElement('div');pg.className='o80p';pg.innerHTML='<div><p class="o80vz">Carregando orçamento…</p></div>';document.body.appendChild(pg);
 let j=null;try{const r=await fetch(CFG.url+'/rest/v1/rpc/get_orc',{method:'POST',headers:{apikey:CFG.key,Authorization:'Bearer '+CFG.key,'Content-Type':'application/json'},body:JSON.stringify({p_id:id})});j=await r.json()}catch(e){}
 if(!j||!j.dados){pg.innerHTML='<div><p class="o80vz">😕 Orçamento não encontrado ou removido.</p></div>';return}
 const row={id:j.id,num:j.num,status:j.status,total:j.total,cliente:(j.dados.cli||{}).nome,dados:j.dados},d=norm(JSON.parse(JSON.stringify(j.dados))),c=calc(d),e=d.emp,s=ST[j.status]||ST.pendente,sn=d.snap,its=d.itens.filter(x=>x.d||pn(x.v)),wa=foneWa(e.tel);
 document.title='Orçamento nº '+j.num+(e.nome?' • '+e.nome:'');
 pg.innerHTML=`<div><div class="hd">${e.logo&&/^data:image\//.test(e.logo)?`<img src="${E(e.logo)}" alt="">`:''}<h1>${E(e.nome||'Orçamento')}</h1><small>${[e.doc&&'CPF/CNPJ: '+E(e.doc),E(e.end),e.tel&&'Tel: '+E(e.tel),E(e.mail)].filter(Boolean).join('<br>')}</small></div>
 <div class="k"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><b style="font-size:18px">Orçamento nº ${j.num}</b><span class="o80s" style="background:${s[3]};color:${s[2]};display:inline-block;line-height:22px">${s[1]} ${s[0]}</span></div><small style="color:#64748b;display:block;margin-top:6px">Emitido em ${fd(d.emi)} • Válido até ${fd(d.val)}</small></div>
 <div class="k"><b>👤 Cliente</b><div style="font-size:14px;margin-top:6px;line-height:1.6">${E(d.cli.nome)||'—'}${d.cli.doc?'<br>CPF/CNPJ: '+E(d.cli.doc):''}${d.cli.tel?'<br>Tel: '+E(d.cli.tel):''}${d.cli.end||d.cli.cidade?'<br>'+E([d.cli.end,d.cli.bairro,d.cli.cidade&&d.cli.cidade+(d.cli.uf?'/'+d.cli.uf:'')].filter(Boolean).join(', ')):''}</div></div>
 <div class="k"><b>🧾 Itens</b>${its.map((x,i)=>`<div class="li"><div><b>${i+1}. ${E(x.d||'Item')}</b><small>${E(x.q||1)} × ${brl(pn(x.v))}</small></div><b>${brl(pn(x.q)*pn(x.v))}</b></div>`).join('')||'<p class="o80vz">Sem itens.</p>'}
  <div class="li"><span>Subtotal</span><b>${brl(c.sub)}</b></div>${c.dc?`<div class="li"><span>Desconto</span><b>- ${brl(c.dc)}</b></div>`:''}${c.ac?`<div class="li"><span>Acréscimo</span><b>${brl(c.ac)}</b></div>`:''}
  <div class="o80to"><span>TOTAL</span><b>${brl(c.tot)}</b></div></div>
 ${d.pgto?`<div class="k"><b>💳 Condições de pagamento</b><p style="font-size:14px;margin:6px 0 0">${E(d.pgto)}</p></div>`:''}${d.obs?`<div class="k"><b>📝 Observações</b><p style="font-size:14px;margin:6px 0 0;white-space:pre-line">${E(d.obs)}</p></div>`:''}
 ${sn?`<div class="k" style="text-align:center"><b>💳 Pague com Pix</b><div style="width:210px;max-width:70%;margin:10px auto;border:1px solid #dbe3ec;border-radius:12px;overflow:hidden">${qrSvg(sn.code)}</div><div style="font-size:18px;font-weight:800">${brl(c.tot)}</div><small style="color:#64748b;display:block;margin:4px 0 10px">${E(sn.titular)}${sn.chave?'<br>'+E(sn.tipo)+': '+E(sn.chave):''}</small><button class="btn or" style="width:100%;min-height:50px" data-cp>📋 Copiar Pix copia e cola</button></div>`:''}
 <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px">Gerado com DC CAD Pro • dccadpro.com</p>
 <div class="cta">${wa?`<a href="https://wa.me/${wa}?text=${encodeURIComponent('Olá! Sobre o orçamento nº '+j.num+'.')}" target="_blank" rel="noopener" style="flex:1;background:#16a34a">💬 Falar no WhatsApp</a>`:''}<button data-pdf style="width:${wa?'110px':'100%'};background:#0f2a43">📄 PDF</button></div></div>`;
 pg.addEventListener('click',async ev=>{if(ev.target.closest('[data-cp]')){try{await navigator.clipboard.writeText(sn.code);tst('Pix copia e cola copiado')}catch(x){prompt('Copie o código Pix:',sn.code)}}if(ev.target.closest('[data-pdf]'))pdfGo(row,false)})}

/* v8.3: cria/atualiza um orçamento (modelo planilha com Pix) a partir de um projeto do diagrama */
async function fromProject(o){const emp=await empGet();if(!ROWS.length)await listar();
 const its=(o.itens||[]).map(x=>({d:String(x.d||''),q:String(Math.round((+x.q||0)*1000)/1000).replace('.',','),v:String(Math.round((+x.v||0)*100)/100).replace('.',',')}));
 let row=o.id?await pegar(o.id):null;const now=new Date().toISOString();
 if(row&&row.dados){const d=norm(row.dados);d.itens=its.length?its:d.itens;row.dados=d;row.total=calc(d).tot;row.atualizado=now}
 else{const d=novoD(emp);d.cli={...d.cli,nome:o.cli||'',doc:o.doc||'',tel:o.tel||'',end:o.end||''};const vd=parseInt(o.vd)||15;d.vd=String(vd);d.val=addD(d.emi,vd);if(its.length)d.itens=its;if(+o.desc>0)d.desc={v:String(o.desc).replace('.',','),t:'%'};d.pgto=o.pgto||'';d.obs=o.obs||'';
  row={id:nid(),num:proxNum(),status:'pendente',cliente:d.cli.nome||null,total:calc(d).tot,dados:d,criado:now,atualizado:now}}
 await put(row);editor(row,false);return row.id}
window.orc80={open:()=>{aba('o')},novo:novoOrc,refresh:()=>{if(tab=='o')carregar()},fromProject};
{const m=location.pathname.match(/^\/orcamento\/([a-z0-9]{8,16})\/?$/i);if(m)pub(m[1].toLowerCase());else{injeta();addEventListener('online',()=>{pushPend().then(()=>{if(tab=='o'&&!$('vP').classList.contains('hidden'))carregar()})})}}
})();
