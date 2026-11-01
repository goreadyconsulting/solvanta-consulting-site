/* Solvanta: shared navigation, accessibility and footer state. No DOM layout rewriting. */
document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.querySelector('[data-nav-menu]');
 const toggle=document.querySelector('[data-nav-toggle]');
 const close=()=>{if(!nav||!toggle)return;nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu')};
 if(nav&&toggle){
   toggle.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu')});
   nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
   document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close()});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus()}});
   const desktop=window.matchMedia('(min-width: 801px)');
   if(desktop.addEventListener)desktop.addEventListener('change',e=>{if(e.matches)close()});
 }
 const normalize=path=>{let value=(path||'/').replace(/\/index\.html$/,'/');if(!value.startsWith('/'))value='/'+value;return value==='/'?value:value.replace(/\/$/,'')};
 const current=normalize(location.pathname);
 document.querySelectorAll('[data-nav-menu] a, [data-footer-link]').forEach(link=>{
    const target=normalize(new URL(link.href,location.origin).pathname);
    const active=target===current || (target!=='/'&&current.startsWith(target+'/'));
    if(active){link.classList.add('active');if(target===current)link.setAttribute('aria-current','page')}
 });
 document.querySelectorAll('[data-current-year]').forEach(node=>node.textContent=String(new Date().getFullYear()));
 document.querySelectorAll('a[target="_blank"]').forEach(a=>{const rel=new Set((a.getAttribute('rel')||'').split(/\s+/).filter(Boolean));rel.add('noopener');rel.add('noreferrer');a.setAttribute('rel',[...rel].join(' '))});
});
