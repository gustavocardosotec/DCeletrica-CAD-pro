/* DC CAD Pro — Documentos: Relatório fotográfico / Termo de conclusão de obra e Recibo de pagamento (PDF e imagem, sincronizados na conta) */
(()=>{'use strict';
if(window.docs)return;
const $=id=>document.getElementById(id),E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'),
nf=n=>(+n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}),brl=n=>'R$ '+nf(n),
pn=v=>{v=String(v==null?'':v).trim();if(!v)return 0;if(v.includes(','))v=v.replace(/\./g,'').replace(',','.');const n=parseFloat(v);return isFinite(n)?n:0},
hoje=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)},
fd=s=>s?String(s).slice(0,10).split('-').reverse().join('/'):'',
nid=()=>{const a='abcdefghijklmnopqrstuvwxyz0123456789',r=crypto.getRandomValues(new Uint8Array(10));let s='';for(const b of r)s+=a[b%36];return s},
slug=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,30)||'doc',
tst=m=>{let t=$('t82');if(!t){t=document.createElement('div');t.id='t82';t.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f2a43;color:#fff;padding:10px 16px;border-radius:99px;font-size:13px;z-index:99999;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',2800)},
logged=()=>typeof ses!='undefined'&&ses&&ses.access_token&&ses.access_token!='local',online=()=>logged()&&navigator.onLine,
mobile=()=>/Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
ask=async m=>typeof yes=='function'?await yes(m):confirm(m);
async function rq(p,o={}){const go=()=>fetch(CFG.url+p,{...o,headers:{...UH(),...(o.headers||{})}});let r=await go();
 if(r.status==401&&ses.refresh_token){try{const d=await api('/auth/v1/token?grant_type=refresh_token',{refresh_token:ses.refresh_token});if(d&&d.access_token){ses=d;localStorage.setItem('dce_ses',JSON.stringify(d));r=await go()}}catch(e){}}return r}
const emp=()=>{let o={};try{o=JSON.parse(localStorage.getItem('dce_emp71'))||{}}catch(e){}try{const m=ses&&ses.user&&ses.user.user_metadata&&ses.user.user_metadata.empresa;if(m&&!o.nome&&!o.doc)o={...m,logo:o.logo}}catch(e){}return{nome:o.nome||'',doc:o.doc||'',end:o.end||'',tel:o.tel||'',mail:o.mail||'',logo:o.logo||''}};

/* ---------- dados (nuvem + fila local) ---------- */
const QK='dce_docs82',qLoad=()=>{try{return JSON.parse(localStorage.getItem(QK))||[]}catch(e){return[]}},qSave=a=>{try{localStorage.setItem(QK,JSON.stringify(a));return true}catch(e){return false}};
async function put(row){row.atualizado=new Date().toISOString();
 if(online()){try{const r=await rq('/rest/v1/documentos?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:row.id,tipo:row.tipo,titulo:row.titulo,dados:row.dados,atualizado:row.atualizado})});if(r.ok){qSave(qLoad().filter(x=>x.id!=row.id));return'cloud'}}catch(e){}}
 const q=qLoad().filter(x=>x.id!=row.id);q.push(row);return qSave(q)?(logged()?'pend':'local'):'fail'}
async function flush(){if(!online())return;for(const r of qLoad())await put(r)}
async function lista(){let L=[];if(online()){await flush();try{const r=await rq('/rest/v1/documentos?select=id,tipo,titulo,atualizado&order=atualizado.desc&limit=200');if(r.ok)L=await r.json()}catch(e){}}
 qLoad().forEach(x=>{const i=L.findIndex(l=>l.id==x.id);const it={id:x.id,tipo:x.tipo,titulo:x.titulo,atualizado:x.atualizado,_p:1};if(i>=0)L[i]=it;else L.unshift(it)});
 L.sort((a,b)=>String(b.atualizado).localeCompare(String(a.atualizado)));return L}
async function pega(id){const q=qLoad().find(x=>x.id==id);if(q)return q;if(online()){try{const r=await rq('/rest/v1/documentos?id=eq.'+id+'&select=id,tipo,titulo,dados&limit=1');if(r.ok){const a=await r.json();if(a[0])return a[0]}}catch(e){}}return null}
async function apaga(id){qSave(qLoad().filter(x=>x.id!=id));if(online()){try{const r=await rq('/rest/v1/documentos?id=eq.'+id,{method:'DELETE'});return r.ok}catch(e){return false}}return true}
addEventListener('online',()=>{flush()});

/* ---------- estilos ---------- */
{const st=document.createElement('style');st.textContent=`
.dc82{position:fixed;inset:0;z-index:96;background:#f5f7fa;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;color:#1b2a3a}
.dc82 .h{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 10px 8px;background:#fff;border-bottom:1px solid #dbe3ec}.dc82 .h b{flex:1;min-width:0;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dc82 .h small{font-size:11px;color:#64748b;white-space:nowrap}.dc82 .h .btn{min-height:44px}
.dc82 .b{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:12px 12px 24px}.dc82 .b>div{max-width:760px;margin:0 auto}
.dc82 .k{background:#fff;border:1px solid #dbe3ec;border-radius:16px;padding:14px;margin-top:12px}.dc82 .k:first-child{margin-top:0}.dc82 h4{font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:.4px;color:#1b4f7a;margin:0 0 8px}
.dc82 label{display:block;font-size:12px;font-weight:600;color:#64748b}.dc82 .in{margin-top:3px;min-height:46px;font-size:16px;width:100%}.dc82 textarea.in{min-height:84px}
.dc82 .g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dc82 .g .f{grid-column:1/-1}
.dc82 .g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dc82 .r{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.dc82 .s{position:relative;border:2px dashed #dbe3ec;border-radius:14px;min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:#f8fafc;overflow:hidden;padding:6px}.dc82 .s img{width:100%;height:140px;object-fit:cover;border-radius:10px}
.dc82 .s small{position:absolute;left:6px;top:6px;background:#0f2a43;color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:99px}
.dc82 .cam{display:flex;flex-direction:column;align-items:center;gap:2px;min-height:72px;width:100%;border-radius:12px;background:#f26b21;color:#fff;font-weight:800;font-size:14px;justify-content:center}.dc82 .cam i{font-style:normal;font-size:26px}
.dc82 .gal,.dc82 .rt{min-height:40px;font-size:12px;font-weight:700;color:#1b4f7a;text-decoration:underline}
.dc82 .x{width:40px;height:40px;border-radius:10px;border:1px solid #f3c6c1;color:#b42318;background:#fff}
.dc82 canvas.sg{width:100%;aspect-ratio:5/2;border:2px dashed #94a3b8;border-radius:14px;background:#fff;touch-action:none;display:block}
.dc82 .f2{display:grid;gap:6px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #dbe3ec;box-shadow:0 -4px 16px #0f2a4314}
.dc82 .f2 button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:54px;border-radius:12px;background:#f0f4f8;color:#0f2a43;font-size:12px;font-weight:700}.dc82 .f2 button i{font-style:normal;font-size:20px}.dc82 .f2 button.gr{background:#16a34a;color:#fff}
.dc82 .li{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid #dbe3ec;border-radius:16px;padding:12px;margin-top:10px;cursor:pointer}.dc82 .li i{font-style:normal;font-size:26px}.dc82 .li div{flex:1;min-width:0}.dc82 .li b{display:block;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dc82 .li small{color:#64748b;font-size:12px}
.dc82 .nw{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dc82 .nw button{min-height:64px;border-radius:14px;font-weight:800;font-size:14px;background:#f26b21;color:#fff;padding:6px}.dc82 .nw button+button{background:#0f2a43}
.dc82 .vz{text-align:center;color:#64748b;padding:30px 10px;font-size:14px;line-height:1.5}`;document.head.appendChild(st)}

/* ---------- utilitários ---------- */
const shell=t=>{const o=document.createElement('div');o.className='dc82';o.innerHTML=`<div class="h"><button class="btn ghost" data-a="bk" aria-label="Voltar">←</button><b>${E(t)}</b><small data-sv></small><button class="btn or" data-a="sv">💾 Salvar</button></div><div class="b"><div></div></div><div class="f2"></div>`;document.body.appendChild(o);return o},
setP=(d,path,v)=>{const k=path.split('.');let t=d;for(let i=0;i<k.length-1;i++)t=t[k[i]];t[k[k.length-1]]=v},
shrink=(f,max=1000,q=.62)=>new Promise((ok,no)=>{const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.naturalWidth,i.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(i.naturalWidth*k);c.height=Math.round(i.naturalHeight*k);const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',q))};i.onerror=()=>{URL.revokeObjectURL(u);no()};i.src=u}),
pick=cam=>new Promise(ok=>{const i=document.createElement('input');i.type='file';i.accept='image/*';if(cam)i.setAttribute('capture','environment');i.style.display='none';document.body.appendChild(i);i.onchange=async()=>{const f=i.files[0];i.remove();if(!f)return ok(null);try{ok(await shrink(f))}catch(e){tst('Não consegui ler a foto');ok(null)}};i.addEventListener('cancel',()=>{i.remove();ok(null)});i.click()}),
imgd=u=>new Promise(r=>{if(!u||!/^data:image\//.test(u))return r(null);const i=new Image();i.onload=()=>{try{const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(i,0,0);r({u:c.toDataURL('image/jpeg',.9),w:c.width,h:c.height})}catch(e){r(null)}};i.onerror=()=>r(null);i.src=u}),
dl=(blob,nm)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nm;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(a.href)},5000)},
out=async(blob,nm,type,share)=>{if(share&&mobile()){try{const f=new File([blob],nm,{type});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:nm});return}}catch(x){if(x&&x.name=='AbortError')return}}dl(blob,nm)},
pad=(cv,init)=>{const g=cv.getContext('2d'),w=cv.width,h=cv.height;let dr=false,has=!!init;g.lineWidth=3;g.lineCap='round';g.lineJoin='round';g.strokeStyle='#0f2a43';g.fillStyle='#fff';g.fillRect(0,0,w,h);
 if(init){const i=new Image();i.onload=()=>g.drawImage(i,0,0,w,h);i.src=init}
 const p=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*w/r.width,(e.clientY-r.top)*h/r.height]};
 cv.onpointerdown=e=>{dr=true;has=true;cv.setPointerCapture(e.pointerId);const[x,y]=p(e);g.beginPath();g.moveTo(x,y);g.lineTo(x+.1,y+.1);g.stroke();e.preventDefault()};
 cv.onpointermove=e=>{if(!dr)return;const[x,y]=p(e);g.lineTo(x,y);g.stroke();e.preventDefault()};
 cv.onpointerup=cv.onpointercancel=()=>{dr=false};
 return{clear(){g.fillStyle='#fff';g.fillRect(0,0,w,h);has=false},get(){return has?cv.toDataURL('image/png'):''}}},
ext=v=>{v=Math.round(Math.min(Math.max(+v||0,0),999999999)*100);const r=Math.floor(v/100),c=v%100,
 U=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'],D=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'],C=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'],
 t=n=>{if(n==100)return'cem';const s=[];if(n>=100){s.push(C[Math.floor(n/100)]);n%=100}if(n>0)s.push(n<20?U[n]:D[Math.floor(n/10)]+(n%10?' e '+U[n%10]:''));return s.join(' e ')},
 m=n=>{const p=[],mi=Math.floor(n/1e6),mil=Math.floor(n%1e6/1000),u=n%1000;if(mi)p.push(t(mi)+(mi>1?' milhões':' milhão'));if(mil)p.push(mil==1?'mil':t(mil)+' mil');if(u)p.push(t(u));return p.join(' e ')};
 return((r?m(r)+(r==1?' real':' reais'):'')+(r&&c?' e ':'')+(c?t(c)+(c==1?' centavo':' centavos'):''))||'zero reais'};

/* ---------- cabeçalho PDF (mesmo modelo do orçamento) ---------- */
const T=(doc,s,x,y,st,z,al)=>{doc.setFont('helvetica',st||'normal');doc.setFontSize(z||9);doc.text(String(s==null?'':s),x,y,{align:al||'left'})},BL=[219,229,241];
function cab(doc,em,lg){const M=14,CW=182;doc.setLineWidth(.25);doc.setDrawColor(0);doc.setTextColor(0);doc.rect(M,12,CW,32);let cx=M+CW/2;
 if(lg){const s=Math.min(28/lg.w,28/lg.h),w=lg.w*s,h=lg.h*s;doc.addImage(lg.u,'JPEG',M+3+(28-w)/2,14+(28-h)/2,w,h);cx=M+34+(CW-34)/2}
 const L=[[em.nome||'Profissional','bolditalic',12]];if(em.doc)L.push(['CPF/CNPJ: '+em.doc,'bold',9]);if(em.end){doc.setFontSize(9);doc.splitTextToSize(em.end,CW-44).slice(0,2).forEach(t=>L.push([t,'normal',9]))}if(em.tel)L.push(['Tel: '+em.tel,'normal',9]);if(em.mail)L.push(['e-mail: '+em.mail,'normal',9]);
 let y=19;L.slice(0,6).forEach((l,i)=>{T(doc,l[0],cx,y,l[1],l[2],'center');y+=i?4.6:6});return 48}
const bar=(doc,t,x,y,w)=>{doc.setFillColor(...BL);doc.rect(x,y,w,6,'FD');T(doc,t,x+w/2,y+4.3,'bold',10,'center')};
const jsp=()=>new window.jspdf.jsPDF({unit:'mm',format:'a4'});

/* ---------- LAUDO / RELATÓRIO FOTOGRÁFICO ---------- */
const TERMO='Declaro que os serviços de instalação elétrica descritos neste relatório foram concluídos e entregues, conferidos e aceitos pelo contratante, conforme as fotos de antes e depois apresentadas.';
const novoL=()=>({id:nid(),tipo:'laudo',titulo:'Relatório fotográfico',dados:{emp:emp(),cli:{nome:'',doc:'',tel:'',end:''},obra:'',data:hoje(),pares:[{a:'',d:'',l:''}],obs:'',termo:TERMO,as:''}});
async function pdfLaudo(row){const d=row.dados,doc=jsp(),M=14,CW=182,R=5.6,lg=await imgd(d.emp.logo);let y=cab(doc,d.emp,lg);
 const box=(x,yy,w,h,f)=>{if(f){doc.setFillColor(...f);doc.rect(x,yy,w,h,'FD')}else doc.rect(x,yy,w,h)},fit=(s,w)=>{s=String(s||'');doc.setFontSize(9);while(s.length>1&&doc.getTextWidth(s)>w-2)s=s.slice(0,-1);return s},
 lv=(l,v,x,yy,lw,w)=>{box(x,yy,lw,R,BL);T(doc,l,x+lw/2,yy+R/2+1.3,'bold',8,'center');box(x+lw,yy,w-lw,R);T(doc,fit(v,w-lw),x+lw+1.5,yy+R/2+1.3,'normal',9)};
 bar(doc,'TERMO DE CONCLUSÃO DE OBRA E RELATÓRIO FOTOGRÁFICO',M,y,CW);y+=6;
 lv('CLIENTE',d.cli.nome,M,y,28,CW);y+=R;lv('TELEFONE',d.cli.tel,M,y,28,80);lv('CPF/CNPJ',d.cli.doc,M+80,y,28,CW-80);y+=R;lv('ENDEREÇO',d.cli.end,M,y,28,CW);y+=R;lv('SERVIÇO',d.obra,M,y,28,CW-50);lv('DATA',fd(d.data),M+CW-50,y,18,50);y+=R+4;
 const BW=89,BH=64;
 for(const p of d.pares){if(!p.a&&!p.d)continue;if(y+BH+14>285){doc.addPage();y=14}
  for(const [k,w] of [[0,'a'],[1,'d']]){const x=M+k*(BW+4);box(x,y,BW,5.5,BL);T(doc,w=='a'?'ANTES':'DEPOIS',x+BW/2,y+4,'bold',8,'center');box(x,y+5.5,BW,BH);const im=await imgd(p[w]);if(im){const s=Math.min((BW-2)/im.w,(BH-2)/im.h),iw=im.w*s,ih=im.h*s;doc.addImage(im.u,'JPEG',x+(BW-iw)/2,y+5.5+(BH-ih)/2,iw,ih)}}
  y+=5.5+BH;if(p.l){T(doc,fit(p.l,CW),M,y+4,'italic',8);y+=6}else y+=2;y+=3}
 const txt=(t,s)=>{if(!s)return;doc.setFontSize(9);const L=doc.splitTextToSize(s,CW-4);if(y+8+L.length*4>285){doc.addPage();y=14}bar(doc,t,M,y,CW);doc.rect(M,y+6,CW,L.length*4+3);L.forEach((l,i)=>T(doc,l,M+2,y+10.5+i*4,'normal',9));y+=6+L.length*4+6};
 txt('OBSERVAÇÕES',d.obs);txt('TERMO DE CONCLUSÃO',d.termo);
 if(y+48>285){doc.addPage();y=14}
 const sg=await imgd(d.as);if(sg)doc.addImage(sg.u,'JPEG',M+102+10,y+2,60,24);
 doc.setLineWidth(.2);doc.line(M,y+28,M+80,y+28);doc.line(M+102,y+28,M+182,y+28);T(doc,fit(d.emp.nome||'Profissional',80),M+40,y+32,'normal',9,'center');T(doc,fit(d.cli.nome||'Cliente (aceite)',80),M+142,y+32,'normal',9,'center');T(doc,'Data: '+fd(d.data),M+142,y+37,'normal',8,'center');
 const np=doc.getNumberOfPages();if(np>1)for(let i=1;i<=np;i++){doc.setPage(i);T(doc,'Página '+i+'/'+np,105,292,'normal',8,'center')}
 return doc}
async function laudoEd(row){const d=row.dados;let tm,busy=false,sg,dirty=false;const o=shell('Relatório fotográfico'),b=o.querySelector('.b>div'),q=s=>o.querySelector(s);
 q('.f2').style.gridTemplateColumns='1fr 1fr';q('.f2').innerHTML='<button data-a="pdf"><i>📄</i>Baixar PDF</button><button class="gr" data-a="sh"><i>📲</i>Enviar PDF</button>';
 const phH=()=>d.pares.map((p,i)=>`<div class="k" data-i="${i}"><div class="r"><b>Foto ${i+1}</b><button class="x" data-a="rm" aria-label="Remover">✕</button></div><div class="g2">${['a','d'].map(w=>`<div class="s">${p[w]?`<img src="${p[w]}" alt=""><button class="rt" data-a="ph" data-w="${w}">Trocar foto</button>`:`<button class="cam" data-a="ph" data-w="${w}"><i>📷</i>${w=='a'?'Antes':'Depois'}</button><button class="gal" data-a="ph" data-w="${w}" data-g="1">🖼 da galeria</button>`}<small>${w=='a'?'ANTES':'DEPOIS'}</small></div>`).join('')}</div><input class="in" data-pl="${i}" placeholder="Legenda (opcional)" value="${E(p.l)}"></div>`).join('');
 const inp=(l,f,v,x='',c='')=>`<label class="${c}">${l}<input class="in" data-f="${f}" value="${E(v)}" ${x}></label>`;
 b.innerHTML=`<div class="k"><h4>Cliente e obra</h4><div class="g">${inp('Nome do cliente','cli.nome',d.cli.nome,'autocomplete="off"','f')}${inp('Telefone','cli.tel',d.cli.tel,'type="tel" inputmode="tel"')}${inp('CPF / CNPJ','cli.doc',d.cli.doc,'inputmode="numeric"')}${inp('Endereço da obra','cli.end',d.cli.end,'','f')}${inp('Serviço realizado','obra',d.obra,'placeholder="Ex.: Troca do quadro de distribuição"','f')}<label>Data<input type="date" class="in" data-f="data" value="${E(d.data)}"></label></div></div>
 <div data-ph>${phH()}</div><button class="btn ghost" style="width:100%;margin-top:12px;min-height:50px" data-a="add">＋ Adicionar foto (antes e depois)</button>
 <div class="k"><h4>Observações</h4><textarea class="in" data-f="obs" maxlength="1500" placeholder="Detalhes da obra, materiais, recomendações…">${E(d.obs)}</textarea></div>
 <div class="k"><h4>Termo de conclusão</h4><textarea class="in" data-f="termo" maxlength="800">${E(d.termo)}</textarea></div>
 <div class="k"><h4>Assinatura / aceite do cliente</h4><canvas class="sg" width="600" height="240"></canvas><button class="btn ghost" style="width:100%;margin-top:8px;min-height:46px" data-a="clr">🧽 Limpar assinatura</button></div>
 <button class="btn danger" style="width:100%;margin-top:14px;min-height:48px" data-a="del">🗑 Excluir relatório</button>`;
 const sv=t=>q('[data-sv]').textContent=t,cv=q('canvas.sg');sg=pad(cv,d.as);cv.addEventListener('pointerup',()=>{d.as=sg.get();mark()});
 const draw=()=>{q('[data-ph]').innerHTML=phH()},
 save=async f=>{if(busy)return;busy=true;clearTimeout(tm);try{d.as=sg.get();row.titulo='Relatório — '+(d.cli.nome||'sem cliente');if(JSON.stringify(d).length>3.8e6){tst('Fotos demais: remova algumas para salvar');return}sv('Salvando…');const r=await put(row);dirty=false;sv(r=='cloud'?'Salvo ✅':r=='fail'?'Sem espaço no aparelho':'Salvo no aparelho 📴');if(f&&r=='pend')tst('Sem internet: sobe para a conta quando voltar')}finally{busy=false}},
 mark=()=>{dirty=true;sv('…');clearTimeout(tm);tm=setTimeout(()=>save(),1500)},
 sair=async()=>{if(dirty)await save();clearTimeout(tm);o.remove()};
 o.addEventListener('input',e=>{const t=e.target;if(t.dataset.pl!=null){d.pares[+t.dataset.pl].l=t.value;mark();return}if(t.dataset.f){setP(d,t.dataset.f,t.value);mark()}});
 o.addEventListener('click',async e=>{const bt=e.target.closest('[data-a]');if(!bt)return;const a=bt.dataset.a;
  if(a=='bk')return sair();if(a=='sv'){await save(1);tst('Salvo');return}
  if(a=='ph'){const i=+bt.closest('[data-i]').dataset.i,u=await pick(!bt.dataset.g);if(u){d.pares[i][bt.dataset.w]=u;draw();mark()}return}
  if(a=='add'){d.pares.push({a:'',d:'',l:''});draw();mark();return}
  if(a=='rm'){const i=+bt.closest('[data-i]').dataset.i;d.pares.splice(i,1);if(!d.pares.length)d.pares.push({a:'',d:'',l:''});draw();mark();return}
  if(a=='clr'){sg.clear();d.as='';mark();return}
  if(a=='pdf'||a=='sh'){await save(1);try{const dc=await pdfLaudo(row);await out(dc.output('blob'),'relatorio-'+slug(d.cli.nome)+'.pdf','application/pdf',a=='sh')}catch(x){console.error(x);tst('Não consegui gerar o PDF')}return}
  if(a=='del'){if(!(await ask('Excluir este relatório? Não dá para desfazer.')))return;clearTimeout(tm);dirty=false;await apaga(row.id);o.remove();tst('Excluído')}})}

/* ---------- RECIBO ---------- */
const FORMAS=['Pix','Dinheiro','Cartão','Transferência','Boleto'];
const novoR=pre=>{pre=pre||{};return{id:nid(),tipo:'recibo',titulo:'Recibo',dados:{emp:emp(),num:String(Date.now()).slice(-6),pagador:pre.pagador||'',doc:pre.doc||'',valor:pre.valor?String(pre.valor).replace('.',','):'',ref:pre.ref||'',forma:'Pix',data:hoje()}}};
const txtR=d=>`Recebi de ${d.pagador||'_______________'}${d.doc?', CPF/CNPJ '+d.doc:''}, a quantia de ${brl(pn(d.valor))} (${ext(pn(d.valor))}), referente a ${d.ref||'serviços prestados'}, pago via ${d.forma}. Pelo que firmo o presente recibo, dando plena e total quitação.`;
async function pdfRecibo(row){const d=row.dados,doc=jsp(),M=14,CW=182,lg=await imgd(d.emp.logo);let y=cab(doc,d.emp,lg)+4;
 doc.setFillColor(...BL);doc.rect(M,y,CW,10,'FD');T(doc,'RECIBO DE PAGAMENTO  Nº '+d.num,M+4,y+6.8,'bold',12);T(doc,brl(pn(d.valor)),M+CW-4,y+6.8,'bold',13,'right');y+=16;
 doc.setFontSize(11);const L=doc.splitTextToSize(txtR(d),CW-6);doc.rect(M,y,CW,L.length*5.6+8);L.forEach((l,i)=>T(doc,l,M+3,y+7+i*5.6,'normal',11));y+=L.length*5.6+16;
 T(doc,'Data do pagamento: '+fd(d.data),M,y,'normal',10);y+=28;doc.setLineWidth(.2);doc.line(M+40,y,M+142,y);T(doc,d.emp.nome||'Profissional',M+91,y+5,'bold',10,'center');if(d.emp.doc)T(doc,'CPF/CNPJ: '+d.emp.doc,M+91,y+10,'normal',9,'center');return doc}
async function pngRecibo(row){const d=row.dados,W=1080,c=document.createElement('canvas'),g=c.getContext('2d'),lg=await imgd(d.emp.logo),t=txtR(d);
 const wrap=(s,x,y,w,lh)=>{const p=s.split(' ');let l='';for(const k of p){const n=l?l+' '+k:k;if(g.measureText(n).width>w&&l){g.fillText(l,x,y);y+=lh;l=k}else l=n}g.fillText(l,x,y);return y+lh};
 c.width=W;c.height=1000;g.fillStyle='#fff';g.fillRect(0,0,W,1000);g.fillStyle='#f26b21';g.fillRect(0,0,W,16);g.fillStyle='#0f2a43';let y=70,x=60;
 if(lg){const i=new Image();await new Promise(r=>{i.onload=r;i.onerror=r;i.src=lg.u});const s=Math.min(110/lg.w,110/lg.h);g.drawImage(i,60,40,lg.w*s,lg.h*s);x=200}
 g.font='800 36px Inter,Arial,sans-serif';g.fillText((d.emp.nome||'Profissional').slice(0,34),x,80);g.font='500 24px Inter,Arial,sans-serif';g.fillStyle='#64748b';if(d.emp.doc)g.fillText('CPF/CNPJ: '+d.emp.doc,x,118);if(d.emp.tel)g.fillText('Tel: '+d.emp.tel,x,150);
 g.fillStyle='#dbe5f1';g.fillRect(60,200,960,90);g.fillStyle='#0f2a43';g.font='800 36px Inter,Arial,sans-serif';g.fillText('RECIBO Nº '+d.num,84,260);g.textAlign='right';g.font='800 44px Inter,Arial,sans-serif';g.fillText(brl(pn(d.valor)),996,262);g.textAlign='left';
 g.font='500 32px Inter,Arial,sans-serif';g.fillStyle='#1b2a3a';y=wrap(t,60,350,960,46)+20;g.font='500 28px Inter,Arial,sans-serif';g.fillStyle='#64748b';g.fillText('Data do pagamento: '+fd(d.data),60,y+10);
 g.fillStyle='#0f2a43';g.fillRect(260,880,560,2);g.textAlign='center';g.font='700 28px Inter,Arial,sans-serif';g.fillText(d.emp.nome||'Profissional',540,920);g.font='500 22px Inter,Arial,sans-serif';g.fillStyle='#94a3b8';g.fillText('Gerado com DC CAD Pro • dccadpro.com',540,970);
 return new Promise(r=>c.toBlob(r,'image/png'))}
async function reciboEd(row){const d=row.dados;let tm,busy=false,dirty=false;const o=shell('Recibo de pagamento'),b=o.querySelector('.b>div'),q=s=>o.querySelector(s);
 q('.f2').style.gridTemplateColumns='1fr 1fr 1fr';q('.f2').innerHTML='<button data-a="pdf"><i>📄</i>PDF</button><button data-a="img"><i>🖼</i>Imagem</button><button class="gr" data-a="sh"><i>📲</i>Enviar</button>';
 const inp=(l,f,v,x='',c='')=>`<label class="${c}">${l}<input class="in" data-f="${f}" value="${E(v)}" ${x}></label>`;
 b.innerHTML=`<div class="k"><h4>Recibo nº ${E(d.num)}</h4><div class="g">${inp('Recebi de (nome do pagador)','pagador',d.pagador,'autocomplete="off"','f')}${inp('CPF / CNPJ (opcional)','doc',d.doc,'inputmode="numeric"')}${inp('Valor (R$)','valor',d.valor,'inputmode="decimal" placeholder="0,00"')}${inp('Referente a','ref',d.ref,'placeholder="Ex.: Instalação elétrica completa"','f')}<label>Forma de pagamento<select class="in" data-f="forma">${FORMAS.map(f=>`<option ${f==d.forma?'selected':''}>${f}</option>`).join('')}</select></label><label>Data<input type="date" class="in" data-f="data" value="${E(d.data)}"></label></div><p data-ex style="font-size:13px;color:#64748b;margin:10px 0 0"></p></div><button class="btn danger" style="width:100%;margin-top:14px;min-height:48px" data-a="del">🗑 Excluir recibo</button>`;
 const sv=t=>q('[data-sv]').textContent=t,ex=()=>q('[data-ex]').textContent=brl(pn(d.valor))+' — '+ext(pn(d.valor));ex();
 const save=async f=>{if(busy)return;busy=true;clearTimeout(tm);try{row.titulo='Recibo nº '+d.num+' — '+(d.pagador||'sem nome');sv('Salvando…');const r=await put(row);dirty=false;sv(r=='cloud'?'Salvo ✅':r=='fail'?'Sem espaço no aparelho':'Salvo no aparelho 📴');if(f&&r=='pend')tst('Sem internet: sobe para a conta quando voltar')}finally{busy=false}},
 mark=()=>{dirty=true;sv('…');clearTimeout(tm);tm=setTimeout(()=>save(),1200)},sair=async()=>{if(dirty)await save();clearTimeout(tm);o.remove()};
 o.addEventListener('input',e=>{const t=e.target;if(!t.dataset.f)return;setP(d,t.dataset.f,t.value);ex();mark()});
 o.addEventListener('change',e=>{const t=e.target;if(t.dataset.f=='valor'&&pn(t.value)){t.value=d.valor=nf(pn(t.value));ex()}});
 o.addEventListener('click',async e=>{const bt=e.target.closest('[data-a]');if(!bt)return;const a=bt.dataset.a;
  if(a=='bk')return sair();if(a=='sv'){await save(1);tst('Salvo');return}
  if(!(pn(d.valor)>0)&&a!='del'){tst('Informe o valor do recibo');return}
  if(a=='pdf'){await save(1);try{await out((await pdfRecibo(row)).output('blob'),'recibo-'+d.num+'.pdf','application/pdf',false)}catch(x){tst('Não consegui gerar o PDF')}return}
  if(a=='img'||a=='sh'){await save(1);try{await out(await pngRecibo(row),'recibo-'+d.num+'.png','image/png',a=='sh')}catch(x){tst('Não consegui gerar a imagem')}return}
  if(a=='del'){if(!(await ask('Excluir este recibo?')))return;clearTimeout(tm);dirty=false;await apaga(row.id);o.remove();tst('Excluído')}})}

/* ---------- tela inicial: lista + novos ---------- */
async function open(tipo){if(tipo=='laudo')return laudoEd(novoL());if(tipo=='recibo')return reciboEd(novoR());
 const o=document.createElement('div');o.className='dc82';o.innerHTML='<div class="h"><button class="btn ghost" data-a="bk" aria-label="Voltar">←</button><b>📷 Laudos e recibos</b></div><div class="b"><div><div class="nw"><button data-a="nl">📷 Novo relatório<br>fotográfico</button><button data-a="nr">🧾 Novo recibo<br>de pagamento</button></div><div data-l><p class="vz">Carregando…</p></div></div></div>';document.body.appendChild(o);
 const ic=t=>t=='laudo'?'📷':'🧾',pint=async()=>{const L=await lista(),l=o.querySelector('[data-l]');l.innerHTML=L.length?L.map(x=>`<div class="li" data-id="${x.id}"><i>${ic(x.tipo)}</i><div><b>${E(x.titulo||'Documento')}</b><small>${fd(x.atualizado)}${x._p?' • 📴 pendente':''}</small></div></div>`).join(''):'<p class="vz">Nenhum documento ainda.<br>Crie um relatório fotográfico (antes e depois) ou um recibo.</p>'};
 pint();
 o.addEventListener('click',async e=>{const a=e.target.closest('[data-a]'),li=e.target.closest('[data-id]');
  if(a){const k=a.dataset.a;if(k=='bk'){o.remove();return}if(k=='nl')await laudoEd(novoL());if(k=='nr')await reciboEd(novoR());return}
  if(li){const r=await pega(li.dataset.id);if(!r)return tst('Abra com internet uma vez para usar offline');r.tipo=='laudo'?laudoEd(r):reciboEd(r)}});
 const iv=setInterval(()=>{if(!document.body.contains(o))return clearInterval(iv);if(document.querySelectorAll('.dc82').length==1)pint()},4000)}
window.docs={open,laudo:()=>laudoEd(novoL()),recibo:pre=>reciboEd(novoR(pre)),reciboOrc:row=>{const d=(row&&row.dados)||{},c=d.cli||{};return reciboEd(novoR({pagador:c.nome,doc:c.doc,valor:row.total,ref:'Orçamento nº '+row.num}))}};
})();
