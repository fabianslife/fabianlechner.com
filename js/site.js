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
