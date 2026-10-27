document.querySelectorAll('[data-wa]').forEach(link=>{link.href='https://wa.me/5492804789945?text='+encodeURIComponent(link.dataset.wa);link.target='_blank';link.rel='noopener noreferrer';});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});document.querySelectorAll('[data-stage]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.stage!==button.dataset.filter;});}));




/* Small logo drift on both phone and desktop, separate from its float loop. */
(()=>{const brand=document.querySelector('header .brand');if(!brand)return;const motion=matchMedia('(prefers-reduced-motion: reduce)');let queued=false;function paint(){queued=false;const limit=innerWidth<=600?1.5:2.5;const offset=motion.matches?0:Math.min(limit,Math.max(0,scrollY)*.07);brand.style.setProperty('--logo-scroll',offset.toFixed(2)+'px');}function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);motion.addEventListener('change',schedule);paint();})();

/* Header utilities: local selections and WhatsApp inquiries. */
(()=>{
const dialog=document.querySelector('.shop-dialog');if(!dialog)return;
const body=dialog.querySelector('.dialog-body'),title=dialog.querySelector('#shop-dialog-title');
const categories=[{id:'rn',name:'Recién nacidos',words:'rn recien nacido bebe bodies enteritos'},{id:'baby',name:'Bebés',words:'bebe bebes conjuntos tejidos cardigan'},{id:'kids',name:'Peques de 2 a 4 años',words:'niños ninos niñas ninas jean jeans vestido remera short pantalones'}];
let saved={favorites:[],bag:[],destination:''};try{const raw=JSON.parse(localStorage.getItem('mini-peques-preferences')||'null');if(raw&&typeof raw==='object')saved={favorites:Array.isArray(raw.favorites)?raw.favorites.filter(x=>categories.some(c=>c.id===x)):[],bag:Array.isArray(raw.bag)?raw.bag.filter(x=>categories.some(c=>c.id===x)):[],destination:typeof raw.destination==='string'?raw.destination.slice(0,60):''};}catch{}
let panel='search';
const clean=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function save(){try{localStorage.setItem('mini-peques-preferences',JSON.stringify(saved));}catch{}update();}
function update(){for(const key of ['favorites','bag']){const badge=document.querySelector('[data-'+key+'-count]');badge.hidden=!saved[key].length;badge.textContent=String(saved[key].length);}const destination=document.querySelector('[data-destination]');destination.textContent=saved.destination?'Enviar a '+saved.destination:'Elegí dónde recibir';}
function wa(message){return 'https://wa.me/5492804789945?text='+encodeURIComponent(message);}
function row(category){const article=document.createElement('article');article.className='category-result';const info=document.createElement('div');const h=document.createElement('h3');h.textContent=category.name;const note=document.createElement('small');note.textContent='Categoría del catálogo';info.append(h,note);const actions=document.createElement('div');actions.className='result-actions';const view=document.createElement('button');view.textContent='Ver';view.dataset.view=category.id;view.setAttribute('aria-label','Ver '+category.name);actions.append(view);for(const key of ['favorites','bag']){const button=document.createElement('button');button.type='button';button.textContent=key==='favorites'?(saved.favorites.includes(category.id)?'♥':'♡'):(saved.bag.includes(category.id)?'✓':'+');button.dataset.toggle=key;button.dataset.id=category.id;button.setAttribute('aria-label',(key==='favorites'?'Guardar en favoritos: ':'Sumar a consulta: ')+category.name);button.setAttribute('aria-pressed',String(saved[key].includes(category.id)));actions.append(button);}article.append(info,actions);return article;}
function results(query=''){const list=body.querySelector('[data-results]');if(!list)return;list.replaceChildren();const matches=categories.filter(c=>(panel==='favorites'?saved.favorites.includes(c.id):panel==='bag'?saved.bag.includes(c.id):true)&&(!query||clean(c.name+' '+c.words).includes(clean(query))));if(!matches.length){const p=document.createElement('p');p.textContent=panel==='search'?'No encontramos esa búsqueda. Podés consultarnos por WhatsApp.':panel==='favorites'?'Todavía no guardaste categorías favoritas.':'Tu bolsa de consultas está vacía.';list.append(p);}matches.forEach(c=>list.append(row(c)));}
function open(kind){panel=kind;title.textContent=({shipping:'¿Dónde recibís tu pedido?',search:'Buscá en la colección',account:'Atención y pedidos',favorites:'Mis favoritos',bag:'Mi bolsa de consultas'})[kind];
if(kind==='shipping'){body.innerHTML='<p>Guardá tu localidad para tenerla presente al consultar el envío.</p><form data-shipping-form><label for="shipping-city">Localidad y provincia</label><input id="shipping-city" name="city" maxlength="60" required placeholder="Ej.: Puerto Madryn, Chubut"><button class="button" type="submit">Guardar localidad</button></form><p class="dialog-note">Confirmamos costo y plazo de envío por WhatsApp antes de cerrar el pedido.</p>';body.querySelector('input').value=saved.destination;}
else if(kind==='account'){body.innerHTML='<p>¿Ya hiciste un pedido o necesitás ayuda? Consultanos y te acompañamos con tu compra.</p><a class="button" target="_blank" rel="noopener noreferrer">Consultar mi pedido ↗</a>';body.querySelector('a').href=wa('¡Hola Mini Peques! Quisiera consultar por mi pedido.');}
else{body.innerHTML=(kind==='search'?'<label for="catalog-search">¿Qué querés buscar?</label><input id="catalog-search" type="search" autocomplete="off" placeholder="Bebés, jeans, vestidos…">':'')+'<div data-results></div><p class="dialog-note">Explorá categorías y consultá modelos, talles, precios y disponibilidad. Las selecciones se guardan en este navegador.</p>';if(kind==='bag'){const a=document.createElement('a');a.className='button';a.textContent='Consultar por WhatsApp ↗';a.target='_blank';a.rel='noopener noreferrer';a.href=wa('¡Hola Mini Peques! Quisiera consultar el catálogo'+(saved.bag.length?' de: '+categories.filter(c=>saved.bag.includes(c.id)).map(c=>c.name).join(', '):'')+(saved.destination?'. Envío a '+saved.destination:'')+'.');body.append(a);}if(kind!=='search'){const button=document.createElement('button');button.type='button';button.className='button';button.dataset.explore='';button.textContent='Explorar categorías';body.append(button);}results();}
if(!dialog.open)dialog.showModal();}
document.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>open(button.dataset.panel)));
dialog.querySelector('[data-close-dialog]').addEventListener('click',()=>dialog.close());
body.addEventListener('input',event=>{if(event.target.id==='catalog-search')results(event.target.value);});
body.addEventListener('submit',event=>{if(!event.target.matches('[data-shipping-form]'))return;event.preventDefault();saved.destination=event.target.elements.city.value.trim();if(!saved.destination)return;save();dialog.close();});
body.addEventListener('click',event=>{const toggle=event.target.closest('[data-toggle]');if(toggle){const key=toggle.dataset.toggle,id=toggle.dataset.id;saved[key]=saved[key].includes(id)?saved[key].filter(x=>x!==id):[...saved[key],id];save();if(panel==='bag'||panel==='favorites')open(panel);else results(body.querySelector('input')?.value||'');return;}const view=event.target.closest('[data-view]');if(view){dialog.close();document.querySelector('[data-filter="'+view.dataset.view+'"]').click();document.querySelector('#coleccion').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}if(event.target.closest('[data-explore]'))open('search');});
update();
})();

/* Layered parallax, smoothed and capped; works with touch scrolling too. */
(()=>{
const scene=document.querySelector('.floating-scene');if(!scene)return;const planes=[...scene.querySelectorAll('.depth-plane')];if(!planes.length)return;const images=planes.map(p=>p.querySelector('img'));const reduced=matchMedia('(prefers-reduced-motion: reduce)');
Promise.all(images.map(img=>img.complete?(img.naturalWidth?Promise.resolve():Promise.reject()):new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true});}))).then(()=>{scene.classList.add('parallax-ready');schedule();}).catch(()=>{});
let current=0,queued=false;function paint(){queued=false;const rect=scene.getBoundingClientRect();const mobile=innerWidth<=600;const max=mobile?20:60;const target=reduced.matches?0:Math.min(max,Math.max(0,-rect.top)*.16);current=reduced.matches?0:current+(target-current)*.09;if(Math.abs(target-current)<.03)current=target;planes.forEach(plane=>plane.style.setProperty('--depth-y',(current*Number(plane.dataset.depth)).toFixed(3)+'px'));if(Math.abs(target-current)>.03&&rect.bottom>0&&rect.top<innerHeight){queued=true;requestAnimationFrame(paint);}}
function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);schedule();
})();


/* Automatic forward-and-back loop on desktop; never tied to scroll position. */
(()=>{
if(matchMedia('(pointer: coarse)').matches||innerWidth<=900)return;
const scene=document.querySelector('.floating-scene'),plane=document.querySelector('.depth-baby');if(!scene||!plane)return;const video=plane.querySelector('video');if(!video)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let allowed=false;try{allowed=sessionStorage.getItem('mini-peques-motion')==='enabled';}catch{}
const button=document.createElement('button');button.type='button';button.className='hero-motion-enable';button.textContent='Activar movimiento';button.hidden=true;scene.append(button);
video.muted=true;video.loop=true;video.playsInline=true;video.playbackRate=.85;
function visible(){const r=scene.getBoundingClientRect();return !document.hidden&&r.bottom>0&&r.top<innerHeight;}
function play(){plane.classList.toggle('motion-opt-in',allowed);if((reduced.matches&&!allowed)||!visible()){video.pause();button.hidden=!(reduced.matches&&!allowed);return;}button.hidden=true;video.play().then(()=>plane.classList.add('has-scroll-video')).catch(()=>{button.hidden=false;});}
button.addEventListener('click',()=>{allowed=true;try{sessionStorage.setItem('mini-peques-motion','enabled');}catch{}play();});video.addEventListener('loadeddata',play);video.addEventListener('error',()=>{plane.classList.remove('has-scroll-video');});addEventListener('scroll',play,{passive:true});addEventListener('resize',play);document.addEventListener('visibilitychange',play);reduced.addEventListener('change',play);play();
})();

/* Catalogue navigation and mobile menu. */
(()=>{
const nav=document.querySelector('#primary-nav'),toggle=document.querySelector('.nav-toggle');if(!nav||!toggle)return;
function close(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
nav.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;const filter=link.dataset.navFilter;if(filter)document.querySelector('[data-filter="'+filter+'"]')?.click();close();});
document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!toggle.contains(event.target))close();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
})();

/* Product gallery, category tabs and local product favorites. */
(()=>{
const section=document.querySelector('.product-showcase');if(!section)return;const data=[{"id":"body-algodon","name":"ENTERITO DE ALGODÓN","image":"body.png","groups":["baby"],"tone":"cream"},{"id":"cardigan-tejido","name":"CARDIGAN TEJIDO","image":"cardigan.png","groups":["baby","boys","girls"],"tone":"sage"},{"id":"gorrito-tejido","name":"GORRITO CON OREJITAS","image":"gorro.png","groups":["baby","boys","girls","accessories"],"tone":"peach"},{"id":"medias-tejidas","name":"MEDIAS TEJIDAS","image":"medias.png","groups":["baby","boys","girls","accessories"],"tone":"cream"},{"id":"remera-algodon","name":"REMERA DE ALGODÓN","image":"remera.png","groups":["baby","boys","girls"],"tone":"sage"},{"id":"jean-infantil","name":"JEAN INFANTIL","image":"jean.png","groups":["boys","girls"],"tone":"cream"},{"id":"vestido","name":"VESTIDO","image":"vestido.png","groups":["girls"],"tone":"peach"}];const rail=section.querySelector('.product-rail'),cards=[...rail.querySelectorAll('[data-product]')];const reduced=matchMedia('(prefers-reduced-motion: reduce)');let favorites=[];try{const value=JSON.parse(localStorage.getItem('mini-peques-product-favorites')||'[]');if(Array.isArray(value))favorites=value.filter(id=>data.some(p=>p.id===id));}catch{}
function updateArrows(){const max=rail.scrollWidth-rail.clientWidth;section.querySelector('[data-rail-prev]').disabled=rail.scrollLeft<2;section.querySelector('[data-rail-next]').disabled=rail.scrollLeft>=max-2;}
function choose(group){cards.forEach(card=>{const groups=card.dataset.groups.split(' ');card.hidden=group==='all'?false:group==='kids'?!groups.some(g=>g==='boys'||g==='girls'):!groups.includes(group);});section.querySelectorAll('[data-product-filter]').forEach(button=>{button.classList.toggle('active',button.dataset.productFilter===group);button.setAttribute('aria-pressed',String(button.dataset.productFilter===group));});rail.scrollLeft=0;requestAnimationFrame(updateArrows);}
section.querySelectorAll('[data-product-filter]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.productFilter)));
section.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.filter==='rn'?'baby':button.dataset.filter)));
const nav=document.querySelector('#primary-nav');nav.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;const text=link.textContent;const group=text.includes('ACCESORIOS')?'accessories':text.includes('NIÑAS')?'girls':text.includes('NIÑOS')?'boys':text.includes('BEBES')?'baby':'all';if(group==='accessories'){event.preventDefault();section.scrollIntoView({behavior:reduced.matches?'auto':'smooth'});}choose(group);});
section.querySelector('[data-rail-prev]').addEventListener('click',()=>rail.scrollBy({left:-rail.clientWidth*.8,behavior:reduced.matches?'auto':'smooth'}));section.querySelector('[data-rail-next]').addEventListener('click',()=>rail.scrollBy({left:rail.clientWidth*.8,behavior:reduced.matches?'auto':'smooth'}));rail.addEventListener('scroll',updateArrows,{passive:true});addEventListener('resize',updateArrows);
function save(){try{localStorage.setItem('mini-peques-product-favorites',JSON.stringify(favorites));}catch{}paint();}
function paint(){section.querySelectorAll('[data-product-favorite]').forEach(button=>button.setAttribute('aria-pressed',String(favorites.includes(button.dataset.productFavorite))));const badge=document.querySelector('[data-favorites-count]');if(badge){badge.textContent=String(favorites.length);badge.hidden=!favorites.length;}}
section.querySelectorAll('[data-product-favorite]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.productFavorite;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();}));
const favoriteButton=document.querySelector('[data-panel="favorites"]'),dialog=document.querySelector('.shop-dialog');
function showFavorites(){dialog.querySelector('#shop-dialog-title').textContent='Mis favoritos';const body=dialog.querySelector('.dialog-body');body.replaceChildren();if(!favorites.length){const p=document.createElement('p');p.textContent='Guardá las prendas que te gustan tocando el corazón.';body.append(p);}for(const product of data.filter(p=>favorites.includes(p.id))){const row=document.createElement('article');row.className='category-result';const name=document.createElement('h3');name.textContent=product.name;const actions=document.createElement('div');actions.className='result-actions';const link=document.createElement('a');link.className='result-link';link.textContent='Consultar ↗';link.href='https://wa.me/5492804789945?text='+encodeURIComponent('¡Hola Mini Peques! Quisiera consultar por '+product.name.toLowerCase()+'.');link.target='_blank';link.rel='noopener noreferrer';const remove=document.createElement('button');remove.textContent='×';remove.setAttribute('aria-label','Quitar de favoritos');remove.addEventListener('click',()=>{favorites=favorites.filter(x=>x!==product.id);save();showFavorites();});actions.append(link,remove);row.append(name,actions);body.append(row);}if(!dialog.open)dialog.showModal();}
favoriteButton.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();showFavorites();},true);
choose('baby');paint();
})();


/* Touch-safe automatic loop: transparent WebP frames do not require video playback. */
(()=>{
const mobile=matchMedia('(pointer: coarse)').matches||innerWidth<=900;if(!mobile)return;
const scene=document.querySelector('.floating-scene'),plane=document.querySelector('.depth-baby'),data=document.querySelector('#mobile-motion-data');if(!scene||!plane||!data)return;
let config;try{config=JSON.parse(data.textContent);}catch{return;}
const unusedVideo=plane.querySelector?.('video');if(unusedVideo){unusedVideo.pause();unusedVideo.removeAttribute('src');unusedVideo.load();}
const canvas=document.createElement('canvas');canvas.className='mobile-scroll-canvas';canvas.width=config.width;canvas.height=config.height;canvas.setAttribute('aria-hidden','true');const ctx=canvas.getContext('2d');if(!ctx)return;plane.append(canvas);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let allowed=false;try{allowed=sessionStorage.getItem('mini-peques-motion')==='enabled';}catch{}
const enable=document.createElement('button');enable.type='button';enable.className='hero-motion-enable';enable.textContent='Activar movimiento';scene.append(enable);enable.addEventListener('click',()=>{allowed=true;try{sessionStorage.setItem('mini-peques-motion','enabled');}catch{}schedule();});
const cache=new Map();let age=0,queued=false,position=0,last=0,lastIndex=0,elapsed=0;
function atlas(index){if(index<0||index>=config.atlases.length)return null;let entry=cache.get(index);if(entry){entry.age=++age;return entry;}entry={image:new Image(),ready:false,age:++age};cache.set(index,entry);entry.image.decoding='async';entry.image.onload=()=>{entry.ready=true;schedule();};entry.image.onerror=()=>{entry.failed=true;};entry.image.src=config.atlases[index];return entry;}
function evict(protect){while(cache.size>4){const candidates=[...cache.entries()].filter(([id,e])=>e.ready&&!protect.includes(id)).sort((a,b)=>a[1].age-b[1].age);if(!candidates.length)break;cache.delete(candidates[0][0]);}}
function tile(image,index){const n=index%config.framesPerAtlas;ctx.drawImage(image,(n%config.columns)*config.width,Math.floor(n/config.columns)*config.height,config.width,config.height,0,0,config.width,config.height);}
function draw(time){const frame=Math.max(0,Math.min(config.frameCount-1,time*config.fps)),a=Math.floor(frame),b=Math.min(config.frameCount-1,a+1),mix=frame-a;const ai=Math.floor(a/config.framesPerAtlas),bi=Math.floor(b/config.framesPerAtlas);const A=atlas(ai),B=atlas(bi);if(!A?.ready)return;
ctx.clearRect(0,0,canvas.width,canvas.height);ctx.globalCompositeOperation='source-over';if(B?.ready&&mix>.001){ctx.globalAlpha=1-mix;tile(A.image,a);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=mix;tile(B.image,b);}else{ctx.globalAlpha=1;tile(A.image,a);}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';plane.classList.add('has-scroll-canvas');
const direction=a>=lastIndex?1:-1;atlas(ai+direction);lastIndex=a;evict([ai,bi,ai+direction]);}
function paint(stamp){queued=false;const motionAllowed=!reduced.matches||allowed;enable.hidden=motionAllowed;plane.classList.toggle('motion-opt-in',allowed);if(!motionAllowed){position=0;elapsed=0;last=0;plane.classList.remove('has-scroll-canvas');return;}const rect=scene.getBoundingClientRect();if(document.hidden||rect.bottom<=0||rect.top>=innerHeight){last=0;return;}const dt=last?Math.min(.06,Math.max(0,(stamp-last)/1000)):1/60;last=stamp;if(cache.get(0)?.ready||plane.classList.contains('has-scroll-canvas'))elapsed+=dt;const duration=Math.max(.1,config.duration-.045);position=(1-Math.cos(elapsed*Math.PI*.85/duration))*.5*duration;draw(position);schedule();}
function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{last=0;schedule();});addEventListener('pageshow',schedule);document.addEventListener('visibilitychange',()=>{last=0;schedule();});reduced.addEventListener('change',schedule);atlas(0);atlas(1);schedule();
})();


/* Independent clothing float plus bounded scroll parallax in the about scene. */
(()=>{
const visual=document.querySelector('.boutique-visual');if(!visual)return;const layers=[...visual.querySelectorAll('[data-story-depth]')];const reduced=matchMedia('(prefers-reduced-motion: reduce)');let queued=false,current=0,onScreen=true;
function paint(){queued=false;const rect=visual.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;const limit=innerWidth<=600?24:36;const target=reduced.matches?0:Math.max(-limit,Math.min(limit,(innerHeight/2-rect.top-rect.height/2)*.11));current=reduced.matches?0:current+(target-current)*.12;if(Math.abs(current-target)<.03)current=target;layers.forEach(layer=>layer.style.setProperty('--story-offset',(current*Number(layer.dataset.storyDepth)).toFixed(3)+'px'));if(Math.abs(current-target)>.03)schedule();}
function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}function pause(){visual.classList.toggle('motion-paused',document.hidden||!onScreen);}
if(typeof IntersectionObserver!=='undefined'){const observer=new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;pause();if(onScreen)schedule();},{rootMargin:'80px'});observer.observe(visual);}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('visibilitychange',pause);reduced.addEventListener('change',schedule);schedule();
})();
