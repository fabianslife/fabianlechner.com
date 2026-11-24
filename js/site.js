{
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('solid',window.scrollY>40);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});
const burger=document.getElementById('burger'),menu=document.getElementById('menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.textContent=o?'Schließen':'Menü'});
menu.addEventListener('click',e=>{if(e.target.closest('a')){menu.classList.remove('open');burger.setAttribute('aria-expanded',false);burger.textContent='Menü'}});
const cp=document.getElementById('copy');
cp.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('mail').textContent);cp.textContent='Adresse kopiert'}catch(e){cp.textContent='Bitte markieren und kopieren'}setTimeout(()=>cp.textContent='Adresse kopieren',2500)});
}
{
const f=document.getElementById('cform'),st=document.getElementById('cstatus');
if(f){f.addEventListener('submit',async e=>{e.preventDefault();const b=f.querySelector('button[type=submit]');b.disabled=true;st.textContent='Wird gesendet …';
try{const r=await fetch(f.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)});const j=await r.json().catch(()=>({}));
if(r.ok&&String(j.success)!=='false'){f.reset();st.textContent='Danke, Ihre Anfrage ist angekommen. Ich melde mich zeitnah.'}else{throw new Error(j.message||r.status)}}
catch(err){st.innerHTML='Das hat leider nicht geklappt. Bitte schreiben Sie direkt an <a href="mailto:'+document.getElementById('mail').textContent+'">'+document.getElementById('mail').textContent+'</a>.'}
b.disabled=false})}
}
