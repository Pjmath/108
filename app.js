// 鵬展 108 考點影片導向：讀 Google 試算表（發佈為 CSV）
const SHEET_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSsejGcCaU_v7zK9vN-TMiv1oAdIXsRFDLcP53JJiyvDuPrbLc1y30qbslgSImYgXkLCrfstJc0ngUy/pub?output=csv';
function parseCSV(t){const r=[];let row=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
 if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=c}
 else if(c=='"')q=true;else if(c==','){row.push(f);f=''}else if(c=='\n'){row.push(f);r.push(row);row=[];f=''}else if(c!='\r')f+=c}
 if(f||row.length){row.push(f);r.push(row)}return r}
function esc(s){return String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
async function load(){const res=await fetch(SHEET_CSV+(SHEET_CSV.includes('?')?'&':'?')+'t='+Date.now());
 const rows=parseCSV((await res.text()).replace(/^﻿/,'')).slice(1).filter(r=>r[0]);
 return rows.map(r=>({no:r[0].trim().padStart(3,'0'),unit:r[1],name:r[2],url:(r[3]||'').trim(),eta:(r[4]||'').trim()}))}
function list(items,cur){let h='',u='';for(const x of items){if(x.unit!==u){u=x.unit;h+=`<h3>${esc(u)}</h3>`}
 h+=x.url?`<a class="it on ${x.no===cur?'cur':''}" href="${esc(x.url)}"><b>${x.no}</b>${esc(x.name)}<i>▶ 觀看</i></a>`
        :`<div class="it ${x.no===cur?'cur':''}"><b>${x.no}</b>${esc(x.name)}<i>${x.eta?esc(x.eta)+' 上線':'準備中'}</i></div>`}return h}
async function main(){const kp=window.KP||null;const box=document.getElementById('app');
 try{const items=await load();
  if(kp){const x=items.find(i=>i.no===kp);
   if(x&&x.url){location.replace(x.url);box.innerHTML=`<p class="msg">正在前往考點 ${kp} 影片…</p>`;return}
   box.innerHTML=`<div class="wait"><div class="k">考點 ${kp}</div><div class="n">${esc(x?x.name:'')}</div><div class="e">${x&&x.eta?'影片預計 '+esc(x.eta)+' 上線':'影片準備中，即將上線'}</div><div class="s">以下是已上線的影片</div></div>`+list(items,kp)}
  else{const n=items.filter(i=>i.url).length;box.innerHTML=`<div class="wait"><div class="n">影片目錄</div><div class="e">已上線 ${n} / ${items.length} 支</div></div>`+list(items,null)}
 }catch(e){box.innerHTML='<p class="msg">讀取失敗，請稍後再試或聯繫鵬展 LINE</p>'}}
main();
