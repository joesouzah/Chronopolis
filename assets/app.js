(()=>{
"use strict";
const items=Array.isArray(window.CHRONO_LEGACY)?window.CHRONO_LEGACY:[];
const archive=window.CHRONO_ARCHIVE||{};
const historical=items.filter(x=>x.kind!=="index");
const categories=["Todos","História","Personagens","Galeria","Arquivo","Curiosidades","Sobre"];
const home=document.querySelector("#home-view"),reader=document.querySelector("#reader-view"),cards=document.querySelector("#all-cards"),search=document.querySelector("#site-search"),menu=document.querySelector("#menu"),toggle=document.querySelector("#menu-button");
let all=[...historical],category="Todos",query="";
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
const section={"História":"historia","Personagens":"personagens","Galeria":"galeria","Arquivo":"arquivos","Curiosidades":"curiosidades","Sobre":"sobre"};
const internalFilename=s=>/^[a-z0-9_-]+\.html\s*$/i.test(s);
const validURL=value=>{try{const u=new URL(value,document.baseURI);return ["http:","https:"].includes(u.protocol)?u.href:null}catch{return null}};
function itemUrl(item){return item.kind==="modern"?item.url:"#ler/"+encodeURIComponent(item.id)}
function cover(item){return '<div class="cover">'+(item.image?'<img loading="lazy" src="'+escape(item.image)+'" alt="">':'<span class="cover-icon" aria-hidden="true">⌛</span>')+'<span class="cover-label">'+escape(item.category)+'</span></div>'}
function card(item){return '<a class="card" href="'+escape(itemUrl(item))+'">'+cover(item)+'<div class="card-content"><h3>'+escape(item.title)+'</h3><p>'+escape(item.summary)+'</p><span class="card-link">Explorar arquivo →</span></div></a>'}
function searchable(item){return norm(item.title+" "+item.summary+" "+item.category+" "+((archive[item.id]||{}).body||"").replace(/<[^>]*>/g," "))}
function renderCatalog(){
 const term=norm(query);
 const subset=all.filter(x=>(category==="Todos"||x.category===category)&&(!term||searchable(x).includes(term)));
 document.querySelector("#found-count").textContent=subset.length+" registro"+(subset.length===1?"":"s");
 cards.innerHTML=subset.length?subset.map(card).join(""):'<p class="empty">Nenhum registro encontrado. Tente outra palavra ou categoria.</p>';
 document.querySelectorAll(".chip").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.cat===category)));
 cards.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>{img.style.display="none"}));
}
function setCategory(value,scroll){
 category=categories.includes(value)?value:"Todos";
 renderCatalog();
 document.querySelectorAll(".nav a").forEach(a=>a.classList.toggle("active",a.dataset.cat===category));
 if(scroll)document.querySelector("#catalogo").scrollIntoView({behavior:"smooth",block:"start"});
}
function homepage(value="Todos",scroll=false){
 home.hidden=false;reader.hidden=true;document.title="Chronopolis — Arquivo de Chrono Trigger";
 setCategory(value,scroll);
 if(!scroll)window.scrollTo({top:0,behavior:"instant"});
}
function cleanHTML(markup){
 const source=new DOMParser().parseFromString("<div id='import-root'>"+markup+"</div>","text/html");
 const root=source.getElementById("import-root")||source.body;
 const blocked=new Set(["SCRIPT","STYLE","LINK","META","NAV","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","CANVAS","TEMPLATE"]);
 const allowed=new Set(["P","DIV","SECTION","ARTICLE","BLOCKQUOTE","FIGURE","FIGCAPTION","FIELDSET","LEGEND","UL","OL","LI","TABLE","TBODY","THEAD","TR","TD","TH","STRONG","B","EM","I","SMALL","CODE","PRE","SUP","SUB"]);
 function convert(node){
  if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent.replace(/[\t\r\n]+/g," "));
  if(node.nodeType!==Node.ELEMENT_NODE||blocked.has(node.tagName))return null;
  const tag=node.tagName;
  if(tag==="BR")return document.createTextNode(" ");
  if(tag==="HR")return document.createElement("hr");
  if(tag==="IMG"){
   const url=validURL(node.getAttribute("src"));if(!url)return null;
   const el=document.createElement("img");el.src=url;el.loading="lazy";el.alt=node.getAttribute("alt")&&node.alt!=="image host"?node.alt:"Imagem do acervo histórico";
   el.addEventListener("error",()=>{const fallback=document.createElement("small");fallback.textContent="Imagem histórica indisponível nesta origem.";el.replaceWith(fallback)});
   return el;
  }
  if(tag==="A"){
   const el=document.createElement("a"),href=(node.getAttribute("href")||"").trim();
   if(internalFilename(href))el.href="#ler/"+encodeURIComponent(href.slice(0,-5));
   else if(validURL(href)){el.href=validURL(href);el.target="_blank";el.rel="noopener noreferrer"}
   else el.href="#inicio";
   node.childNodes.forEach(ch=>{const child=convert(ch);if(child)el.appendChild(child)});
   return el;
  }
  let mapped=tag==="CENTER"||tag==="FONT"||tag==="HEADER"?"div":(/^H[1-6]$/.test(tag)?(tag==="H1"?"h2":tag.toLowerCase()):(allowed.has(tag)?tag.toLowerCase():"span"));
  const el=document.createElement(mapped);
  node.childNodes.forEach(ch=>{const child=convert(ch);if(child)el.appendChild(child)});
  return el;
 }
 const fragment=document.createDocumentFragment();root.childNodes.forEach(node=>{const el=convert(node);if(el)fragment.appendChild(el)});return fragment;
}
function openReader(slug){
 const record=items.find(x=>x.id.toLowerCase()===slug.toLowerCase());if(!record){home.hidden=true;reader.hidden=false;reader.innerHTML='<div class="not-found">Página não encontrada. <a href="#inicio">Voltar ao início</a></div>';return}
 const imported=archive[record.id];
 home.hidden=true;reader.hidden=false;document.title=record.title+" — Chronopolis";window.scrollTo({top:0,behavior:"instant"});
 reader.innerHTML='<div class="read-shell"><a class="back-link" href="#'+(section[record.category]||"inicio")+'">← Voltar ao acervo</a><header class="read-head"><div class="eyebrow">'+escape(record.category)+' · Acervo histórico</div><h1>'+escape(record.title)+'</h1><p class="read-lead">'+escape(record.summary)+'</p><div class="read-meta"><span>Conteúdo original: 2022–2023</span><span>Texto incorporado à reconstrução</span></div></header><article class="article-panel"><div class="prose" id="legacy-article"></div></article><p class="archive-hint">O texto histórico foi incorporado a este site. Algumas imagens, vídeos e downloads continuam hospedados externamente e podem estar indisponíveis.</p><a class="back-link" href="https://github.com/joesouzah/Chronopolis/blob/main/'+encodeURIComponent(record.id)+'.html" target="_blank" rel="noopener noreferrer">Conferir a fonte original no GitHub ↗</a></div>';
 const target=document.querySelector("#legacy-article");
 if(imported&&imported.body)target.replaceChildren(cleanHTML(imported.body));
 else target.textContent="Este documento não foi encontrado no acervo incorporado. Consulte o HTML histórico pelo link abaixo.";
}
function route(){
 menu.classList.remove("open");toggle.setAttribute("aria-expanded","false");
 let hash="";try{hash=decodeURIComponent(location.hash||"#inicio")}catch{hash="#inicio"}
 if(/^#ler\//i.test(hash))return openReader(hash.slice(5));
 const categoryFromHash={"#inicio":"Todos","#historia":"História","#personagens":"Personagens","#galeria":"Galeria","#arquivos":"Arquivo","#curiosidades":"Curiosidades","#sobre":"Sobre"};
 const selected=categoryFromHash[hash.toLowerCase()]||"Todos";
 homepage(selected,selected!=="Todos");
}
search.addEventListener("input",e=>{query=e.target.value;if(home.hidden){location.hash="#inicio"}homepage(category,false);renderCatalog();if(query)document.querySelector("#catalogo").scrollIntoView({behavior:"smooth",block:"start"})});
toggle.setAttribute("aria-expanded","false");toggle.addEventListener("click",()=>{const open=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open))});
document.querySelectorAll(".chip").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.cat,true)));
document.querySelector("#year").textContent=new Date().getFullYear();
window.addEventListener("hashchange",route);renderCatalog();route();
if(window.chronoArticlesReady)window.chronoArticlesReady.then(posts=>{if(!Array.isArray(posts))return;all=[...posts.map((p,i)=>({...p,id:"post-"+i,kind:"modern"})),...historical];renderCatalog()}).catch(()=>{});
})();
