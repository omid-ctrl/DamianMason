import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.route('**/*',r=>new URL(r.request().url()).hostname==='localhost'?r.continue():r.abort());
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
console.log(JSON.stringify(await p.evaluate(()=>{
 const main=document.querySelector('#main');
 const secs=[...main.querySelectorAll(':scope > section')];
 const s=secs.find(x=>x.querySelector('details'));
 const sb=s.getBoundingClientRect();
 const over=[...s.querySelectorAll('*')].map(n=>{const r=n.getBoundingClientRect();
   return {d:Math.round(r.bottom-sb.bottom), tag:n.tagName, cls:(n.className||'').toString().slice(0,50), h:Math.round(r.height), txt:(n.textContent||'').trim().slice(0,30)};})
   .filter(o=>o.d>-100).sort((a,c)=>c.d-a.d).slice(0,8);
 return {secH:Math.round(sb.height), over};
}),null,1));
await b.close();
