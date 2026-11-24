{
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('solid',window.scrollY>40);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});
const burger=document.getElementById('burger'),menu=document.getElementById('menu');
const setMenu=o=>{menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.textContent=o?'Schließen':'Menü';if(o){const a=menu.querySelector('a');a&&a.focus()}};
burger.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){setMenu(false);burger.focus()}});
const copy=async(btn,text,label)=>{try{await navigator.clipboard.writeText(text);btn.textContent='Kopiert'}catch(e){btn.textContent='Bitte markieren und kopieren'}setTimeout(()=>btn.textContent=label,2500)};
const cp=document.getElementById('copy');
if(cp)cp.addEventListener('click',()=>copy(cp,document.getElementById('mail').textContent,'Adresse kopieren'));
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b,document.getElementById(b.dataset.copy).textContent,b.textContent)));
}
{
const f=document.getElementById('cform'),st=document.getElementById('cstatus');
if(f){f.addEventListener('submit',async e=>{e.preventDefault();const b=f.querySelector('button[type=submit]');b.disabled=true;st.textContent='Wird gesendet …';
try{const ctl=new AbortController();const to=setTimeout(()=>ctl.abort(),60000);const r=await fetch(f.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(f))),signal:ctl.signal});clearTimeout(to);const j=await r.json().catch(()=>({}));
if(r.ok&&String(j.success)!=='false'){f.reset();st.textContent='Danke, Ihre Anfrage ist angekommen. Ich melde mich zeitnah.'}else{throw new Error(j.message||r.status)}}
catch(err){const m=document.getElementById('mail').textContent;st.innerHTML='Das hat leider nicht geklappt. Bitte schreiben Sie direkt an <a href="mailto:'+m+'">'+m+'</a>.'}
b.disabled=false})}
}
/* Bühnen-Karussell: läuft automatisch, lässt sich wischen, scrollen und mit der Maus ziehen */
document.querySelectorAll('[data-carousel]').forEach(c=>{
  const t=c.querySelector('.ctrack'),p=c.querySelector('.cprev'),n=c.querySelector('.cnext'),pp=c.querySelector('.cplay');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playing=!reduce,hover=false,timer=null,drag=null,moved=false;
  const figs=()=>[...t.children];
  const upd=()=>{p.disabled=t.scrollLeft<4;n.disabled=false};
  const go=dir=>{
    const x=t.scrollLeft,fs=figs();
    if(dir>0){
      if(x+t.clientWidth>=t.scrollWidth-4){t.scrollTo({left:0});return}
      const f=fs.find(f=>f.offsetLeft-t.offsetLeft>x+4);if(f)t.scrollTo({left:f.offsetLeft-t.offsetLeft})
    }else{
      const f=[...fs].reverse().find(f=>f.offsetLeft-t.offsetLeft<x-4);t.scrollTo({left:f?f.offsetLeft-t.offsetLeft:0})
    }
  };
  const tick=()=>{if(playing&&!hover&&!drag&&!document.hidden)go(1)};
  const start=()=>{clearInterval(timer);timer=setInterval(tick,3800)};
  const setPlay=v=>{playing=v;pp.setAttribute('aria-pressed',!v);pp.setAttribute('aria-label',v?'Automatisches Weiterlaufen anhalten':'Automatisch weiterlaufen');pp.classList.toggle('paused',!v)};
  p.addEventListener('click',()=>{go(-1);start()});
  n.addEventListener('click',()=>{go(1);start()});
  pp.addEventListener('click',()=>setPlay(!playing));
  c.addEventListener('mouseenter',()=>hover=true);c.addEventListener('mouseleave',()=>hover=false);
  c.addEventListener('focusin',()=>hover=true);c.addEventListener('focusout',()=>hover=false);
  t.addEventListener('touchstart',()=>{hover=true},{passive:true});
  t.addEventListener('touchend',()=>{setTimeout(()=>hover=false,4000)},{passive:true});
  t.addEventListener('scroll',upd,{passive:true});
  t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(1)}if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});
  t.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,l:t.scrollLeft};moved=false;t.classList.add('dragging')});
  window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>4)moved=true;t.scrollLeft=drag.l-dx});
  window.addEventListener('pointerup',()=>{if(!drag)return;drag=null;t.classList.remove('dragging');start()});
  t.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  t.addEventListener('dragstart',e=>e.preventDefault());
  setPlay(playing);upd();start();
});
/* Bühne: fließendes Band, lässt sich scrollen, wischen und mit der Maus ziehen */
document.querySelectorAll('[data-srun]').forEach(el=>{
  const track=el.querySelector('.strack'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hold=false,drag=null,moved=false,last=null,pos=0;
  const half=()=>track.scrollWidth/2;
  const wrap=()=>{const h=half();if(h>0&&el.scrollLeft>=h)el.scrollLeft-=h};
  const step=ts=>{
    if(last!==null&&!hold&&!drag&&!reduce&&!document.hidden){pos+=(ts-last)*0.04;const h=half();if(h>0&&pos>=h)pos-=h;el.scrollLeft=pos}
    else pos=el.scrollLeft;
    last=ts;requestAnimationFrame(step)};
  el.addEventListener('mouseenter',()=>hold=true);el.addEventListener('mouseleave',()=>hold=false);
  el.addEventListener('focusin',()=>hold=true);el.addEventListener('focusout',()=>hold=false);
  el.addEventListener('touchstart',()=>hold=true,{passive:true});
  el.addEventListener('touchend',()=>setTimeout(()=>hold=false,2500),{passive:true});
  el.addEventListener('scroll',wrap,{passive:true});
  el.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,l:el.scrollLeft};moved=false;el.classList.add('dragging')});
  window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>4)moved=true;let l=drag.l-dx;const h=half();if(l<0){l+=h;drag.l+=h}if(l>=h){l-=h;drag.l-=h}el.scrollLeft=l});
  window.addEventListener('pointerup',()=>{if(!drag)return;drag=null;el.classList.remove('dragging');pos=el.scrollLeft});
  el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  el.addEventListener('dragstart',e=>e.preventDefault());
  el.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){el.scrollLeft+=300}if(e.key==='ArrowLeft'){el.scrollLeft=Math.max(0,el.scrollLeft-300)}});
  requestAnimationFrame(step);
});
/* Bilderimpressionen: Klick öffnet großes Foto mit Link zum Vortrag */
{
const box=document.getElementById('lbox');
if(box){
  const img=box.querySelector('img'),cap=box.querySelector('.lcap p'),a=box.querySelector('.lcap a');
  document.querySelectorAll('.sopen').forEach(b=>b.addEventListener('click',e=>{
    if(document.querySelector('.srun.dragging'))return;
    const pic=b.querySelector('img'),so=b.querySelector('source');img.src=so?so.srcset.split(',').pop().trim().split(' ')[0]:b.dataset.full;img.alt=pic.alt;
    cap.textContent=b.dataset.cap||'';a.href=b.dataset.href;a.textContent=b.dataset.label;
    box.showModal();const srun=document.querySelector('[data-srun]');srun&&srun.dispatchEvent(new Event('mouseenter'))}));
  box.querySelector('.lclose').addEventListener('click',()=>box.close());
  box.addEventListener('click',e=>{if(e.target===box)box.close()});
  box.addEventListener('close',()=>{const srun=document.querySelector('[data-srun]');srun&&srun.dispatchEvent(new Event('mouseleave'))});
}
}
