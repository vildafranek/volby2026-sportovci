const D = window.KANDIDATI;

const KRAJE=["Praha","Středočeský","Jihočeský","Plzeňský","Karlovarský","Ústecký","Liberecký",
"Královéhradecký","Pardubický","Vysočina","Jihomoravský","Olomoucký","Zlínský","Moravskoslezský"];

const SPORT_LABEL={hokej:"Hokej",fotbal:"Fotbal",jine:"Ostatní"};
const state={q:"",kraj:"",sports:new Set(),starOnly:false};

const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* --- odkazy --------------------------------------------------------------
   Oficiální aplikace ČSÚ je SPA bez odkazovatelných adres jednotlivých obcí
   a zpravodajské databáze kandidátů schová cookie lišta, takže odkazy níže
   míří na vyhledávání — vždycky fungují a nezastarají.                     */
const cleanObec = o => o.split(/\s*[(+]/)[0].replace(/‑/g,"-").trim();
const cleanStr  = p => p.replace(/\s*\([^)]*\)/g,"").replace(/\s*[–—]\s.*$/,"").trim();
const g   = q => "https://www.google.com/search?q="+encodeURIComponent(q);
const gimg= q => "https://www.google.com/search?tbm=isch&q="+encodeURIComponent(q);

/* Portrét: fotka sportovce z Wikipedie, jinak iniciály. */
function avatar(x){
  // np = jmenovec sportovce, fotku vědomě nezobrazujeme
  const p=x.np?null:(window.PHOTOS||{})[x.n];
  if(p) return `<img class="avatar" src="${p[1]}" width="56" height="56" loading="lazy"
    alt="Portrét — ${esc(x.n)}"
    title="Foto sportovce ${esc(p[0])} z Wikipedie — ne z kandidátky">`;
  const ini=x.n.split(" ").filter(Boolean).slice(0,2).map(s=>s[0]).join("");
  return `<div class="avatar-none" aria-hidden="true">${esc(ini)}</div>`;
}

function links(x){
  const obec=cleanObec(x.o), jm=x.n;
  const out=[
    ["Foto", gimg(`"${jm}" ${obec}`)],
    ["Kandidátka a program", g(`"${cleanStr(x.p)}" ${obec} volby 2026 program kandidáti`)]
  ];
  if(x.s==="hokej")
    out.push(["Hokejová kariéra","https://www.eliteprospects.com/search/player?q="+encodeURIComponent(jm)]);
  else if(x.s==="fotbal")
    out.push(["Fotbalová kariéra","https://www.transfermarkt.cz/schnellsuche/ergebnis/schnellsuche?query="+encodeURIComponent(jm)]);
  else
    out.push(["Sportovní kariéra", g(`"${jm}" ${x.d.split(/[,;(]/)[0].toLowerCase()}`)]);
  return out;
}

// counters
(function(){
  const h=D.filter(x=>x.s==="hokej").length, f=D.filter(x=>x.s==="fotbal").length;
  const stars=D.filter(x=>x.st).length;
  $("#counts").innerHTML=[
    ["Jmen celkem",D.length],["Hokej",h],["Fotbal",f],
    ["Bývalí profíci a reprezentanti",stars],["Krajů",KRAJE.length]
  ].map(([l,n])=>`<div class="count"><b>${n}</b><span>${l}</span></div>`).join("");
})();

// kraj select
KRAJE.forEach(k=>{const o=document.createElement("option");o.value=k;o.textContent=k;$("#kraj").appendChild(o)});

function match(x){
  if(state.starOnly && !x.st) return false;
  if(state.sports.size && !state.sports.has(x.s)) return false;
  if(state.kraj && x.k!==state.kraj) return false;
  if(state.q){
    const hay=(x.n+" "+x.o+" "+x.p+" "+x.d+" "+x.k).toLowerCase();
    if(!hay.includes(state.q)) return false;
  }
  return true;
}

function render(){
  const hits=D.filter(match);
  $("#hits").textContent=hits.length===D.length
    ? `Zobrazeno všech ${D.length} jmen`
    : `Zobrazeno ${hits.length} z ${D.length} jmen`;
  const out=[];
  KRAJE.forEach(k=>{
    const rows=hits.filter(x=>x.k===k);
    if(!rows.length) return;
    rows.sort((a,b)=>(b.st?1:0)-(a.st?1:0) || a.c-b.c);
    out.push(`<section class="kraj"><div class="kraj-head"><h2>${esc(k)}</h2>
      <span class="n">${rows.length}</span></div>`+
      rows.map(x=>`<article class="row${x.st?" star-row":""}">
        <div class="pos${x.c===1?" lead":""}">${x.c===1?"LÍDR":"č. "+x.c}</div>
        <div class="who">
          ${avatar(x)}
          <div class="who-text">
          <div class="name">${esc(x.n)}<span class="age">${x.v} let</span></div>
          <div class="tags">
            <span class="tag ${x.s}">${SPORT_LABEL[x.s]}</span>
            ${x.st?'<span class="tag star">Bývalý profík / reprezentant</span>':""}
            ${x.f?'<span class="tag flag">ověřit totožnost</span>':""}
          </div>
          <div class="desc">${esc(x.d)}</div>
          <div class="links">${links(x).map(([t,u])=>
            `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t}</a>`).join("")}</div>
          </div>
        </div>
        <div class="where"><span class="obec">${esc(x.o)}</span>
          <span class="strana">${esc(x.p)}</span></div>
      </article>`).join("")+`</section>`);
  });
  $("#list").innerHTML=out.length?out.join(""):
    `<p class="empty">Nic neodpovídá filtru. Zkuste jiné hledání.</p>`;
}

$("#q").addEventListener("input",e=>{state.q=e.target.value.trim().toLowerCase();render()});
$("#kraj").addEventListener("change",e=>{state.kraj=e.target.value;render()});
["hokej","fotbal","jine"].forEach(s=>{
  const b=$("#f-"+s);
  b.addEventListener("click",()=>{
    state.sports.has(s)?state.sports.delete(s):state.sports.add(s);
    b.setAttribute("aria-pressed",state.sports.has(s));render();
  });
});
$("#f-star").addEventListener("click",()=>{
  state.starOnly=!state.starOnly;
  $("#f-star").setAttribute("aria-pressed",state.starOnly);render();
});

render();
