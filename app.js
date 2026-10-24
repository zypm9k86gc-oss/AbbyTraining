
"use strict";
const EXERCISES=[
{id:1,title:"Kopf nach oben laufen",level:"Leicht",equipment:"Ohne Hilfsmittel",goal:"Aktive, kontrollierte Schritte aus der Hinterhand.",dose:"5–10 ruhige Schritte, 2–3 Durchgänge",steps:["Neben dem Hund in ruhigem Schritttempo gehen.","Leckerli ein wenig vor und oberhalb der Nase führen.","Kopf sanft aufrichten lassen, ohne den Hals zu überstrecken.","Kurze Strecke gehen, dann loben und pausieren."],tip:"Der Kopf bleibt möglichst natürlich; kein extremes Hochziehen."},
{id:2,title:"Kopf nach oben stehen",level:"Leicht",equipment:"Ohne Hilfsmittel",goal:"Stabiler und möglichst symmetrischer Stand.",dose:"3 × 3–5 Sekunden",steps:["Hund gerade auf einer rutschfesten Matte stehen lassen.","Alle vier Pfoten bleiben vollständig auf dem Boden; Hinterbeine parallel.","Leckerli wenige Zentimeter oberhalb der Nase anbieten.","Drei bis fünf Sekunden ruhig stehen lassen und belohnen."],tip:"Wichtig: Bei dieser Übung bleiben ausdrücklich alle vier Pfoten auf dem Boden."},
{id:3,title:"Gewichtsverlagerung im Stand",level:"Leicht",equipment:"Ohne Hilfsmittel",goal:"Kleine, kontrollierte Lastwechsel.",dose:"3–5 kleine Verlagerungen je Seite",steps:["Hund gerade und entspannt hinstellen.","Leckerli nur wenige Zentimeter nach links oder rechts führen.","Gewicht sanft verlagern lassen, Pfoten bleiben möglichst am Platz.","Zur Mitte zurückkehren und Seite wechseln."],tip:"Kein starkes Verdrehen oder Überstrecken."},
{id:4,title:"Kopf nach oben – auf drei Beinen",level:"Mittel",equipment:"Ohne Hilfsmittel",goal:"Kurzzeitige Stabilität und Balance auf drei Beinen.",dose:"2 × 1–3 Sekunden je Seite",steps:["Erst trainieren, wenn Übung 2 stabil und schmerzfrei gelingt.","Ein Vorderbein ganz kurz sanft entlasten, niemals daran ziehen.","Mit Leckerli eine ruhige Kopfhaltung unterstützen.","Pfote absetzen, Pause machen und Seite wechseln."],tip:"Für Senioren nur nach Rücksprache mit der Tierphysiotherapie; sonst auslassen."},
{id:5,title:"Sitz – Steh (kontrolliert)",level:"Mittel",equipment:"Ohne Hilfsmittel",goal:"Kraft der Hinterhand beim langsamen Aufstehen.",dose:"2–4 kontrollierte Wiederholungen",steps:["Hund auf rutschfestem Boden gerade sitzen lassen.","Mit Leckerli langsam zum Aufstehen motivieren.","Gerades, kontrolliertes Aufstehen ohne Wegkippen fördern.","Im Stand belohnen und kurz pausieren."],tip:"Bei Knie-, Hüft- und Rückenproblemen erst fachlich abklären."},
{id:6,title:"Rückwärts gehen",level:"Mittel",equipment:"Ohne Hilfsmittel",goal:"Hinterpfoten bewusst platzieren und koordinieren.",dose:"2–4 langsame Schritte, 2 Durchgänge",steps:["Vor dem Hund stehen und freie Fläche hinter ihm lassen.","Langsam mit dem Leckerli auf ihn zugehen, ohne zu drängen.","Zwei bis vier gerade Schritte rückwärts fördern.","Kurz stehen bleiben und entspannt vorwärts auflösen."],tip:"Wenn es unkoordiniert wird, reicht ein einzelner guter Schritt."},
{id:7,title:"Vorderpfoten erhöht",level:"Leicht–Mittel",equipment:"Feste Erhöhung",goal:"Ruhiger Stand mit leichter Belastungsverschiebung nach hinten.",dose:"2–3 × 3–5 Sekunden",steps:["Niedrige, breite, feste und rutschfeste Erhöhung bereitstellen.","Beide Vorderpfoten darauf stellen lassen.","Hinterpfoten bleiben parallel auf festem Boden.","Kurz ruhig stehen lassen und langsam absteigen."],tip:"Starte auf festem Untergrund, nicht sofort auf einem Wackelkissen."},
{id:8,title:"Cavaletti laufen",level:"Leicht–Mittel",equipment:"Niedrige Stange",goal:"Kontrolliertes Anheben und Überführen der Hinterbeine.",dose:"2–4 ruhige Überquerungen",steps:["Mit sehr niedriger Stange beginnen, eventuell deutlich unter 10 cm.","Den Hund gerade und langsam darüber laufen lassen, nicht springen.","Jedes Hinterbein soll einzeln über die Stange steigen, nicht darauf treten.","Optional hinter den Vorderbeinen kurz stoppen und weitergehen."],tip:"Hinterpfoten nicht auf der Stange abstellen. Höhe nur bei sauberem Ablauf steigern."},
{id:9,title:"Vorderbeine auf Stabilitätskissen",level:"Mittel",equipment:"Stabilitätskissen",goal:"Balance bei leicht erhöhter Beanspruchung der Hinterhand.",dose:"2 × 2–4 Sekunden",steps:["Flaches, wenig nachgiebiges Kissen rutschfest fixieren.","Beide Vorderpfoten vorsichtig auf das Kissen führen.","Hinterpfoten bleiben gerade und parallel auf festem Boden.","Kurz halten, ruhig absteigen und belohnen."],tip:"Erst feste Erhöhung sicher beherrschen; bei Schwanken vereinfachen."},
{id:10,title:"Hinterbeine auf Stabilitätskissen",level:"Fortgeschritten",equipment:"Stabilitätskissen",goal:"Hinterhand-Propriozeption unter Balanceanspruch.",dose:"Nur angeleitet, 1–2 sehr kurze Haltephasen",steps:["Erst nach Freigabe durch Tierphysiotherapie ausprobieren.","Rutschfest gesichertes, flaches Kissen verwenden.","Beide Hinterpfoten vorsichtig auf dem Kissen platzieren.","Bei Unsicherheit sofort auf festen Boden zurückgehen."],tip:"Nicht Teil des normalen 6-Wochen-Kalenderplans für einen 12-jährigen Hund."},
{id:11,title:"Drehen um das Kissen",level:"Fortgeschritten",equipment:"Stabilitätskissen / festes Target",goal:"Kleine, kontrollierte Schritte der Hinterpfoten.",dose:"Nur angeleitet, 1–2 kleine Schritte je Richtung",steps:["Vorderpfoten zuerst auf einem festen Target platzieren.","Mit Leckerli eine minimale Seitwärtsbewegung anleiten.","Hinterpfoten Schritt für Schritt um das Target setzen lassen.","Nach kleinen Schritten belohnen, beide Richtungen berücksichtigen."],tip:"Zunächst auf festem Target; Wackelkissen nur mit fachlicher Freigabe."}
];
const WEEKS=[
[[1,2,3],[1,2,5],[2,3,6]],
[[1,2,3],[1,5,6],[2,3,7]],
[[1,2,5],[2,7,8],[1,3,6]],
[[1,2,5],[2,7,8],[3,6,9]],
[[1,2,5],[3,7,8],[2,6,9]],
[[1,3,5],[2,7,8],[1,6,9]]
];
const KEY="abby-training-local-v1";
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function asDate(v){return new Date(v+"T12:00:00")}
function plus(v,n){const d=asDate(v);d.setDate(d.getDate()+n);return iso(d)}
function monday(v){const d=asDate(v);d.setDate(d.getDate()+(8-d.getDay())%7);return iso(d)}
function monthBy(v,n){const a=v.split("-").map(Number),d=new Date(a[0],a[1]-1+n,1,12);return iso(d).slice(0,7)}
function valid(v){return typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(asDate(v))&&iso(asDate(v))===v}
function fmt(v,opt){return new Intl.DateTimeFormat("de-DE",opt||{weekday:"long",day:"numeric",month:"long"}).format(asDate(v))}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const TODAY=iso(new Date());
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){}
let state={page:0,start:valid(saved.start)?monday(saved.start):monday(TODAY),selected:valid(saved.selected)?saved.selected:monday(TODAY),done:saved.done&&typeof saved.done==="object"&&!Array.isArray(saved.done)?saved.done:{}};
state.month=state.selected.slice(0,7);
function save(){try{localStorage.setItem(KEY,JSON.stringify({start:state.start,selected:state.selected,done:state.done}))}catch(e){}}
function plan(){const p={};WEEKS.forEach((week,w)=>week.forEach((ids,s)=>{p[plus(state.start,w*7+s*2)]={week:w+1,session:s+1,ids:ids}}));return p}
function upcoming(p){return Object.keys(p).sort().find(d=>d>=TODAY&&!state.done[d])||Object.keys(p).sort().find(d=>!state.done[d])}
const main=document.getElementById("main");
function illustration(ex){return '<img class="exercise-drawing" src="./assets/uebung-'+String(ex.id).padStart(2,'0')+'.webp" alt="Abbys Trainingsbild zur Übung '+ex.id+': '+esc(ex.title)+'" loading="lazy">';}
function renderCalendar(){
 const p=plan(),days=Object.keys(p),count=days.filter(d=>state.done[d]).length,total=days.length,percent=Math.round(count/total*100);
 const next=upcoming(p);
 const part=state.month.split("-").map(Number),first=new Date(part[0],part[1]-1,1,12);
 const blanks=(first.getDay()+6)%7,dim=new Date(part[0],part[1],0).getDate();
 let grid="";
 for(let i=0;i<Math.ceil((blanks+dim)/7)*7;i++){
   const d=new Date(part[0],part[1]-1,1-blanks+i,12),date=iso(d),session=p[date];
   const cl="cal-day"+(d.getMonth()!==part[1]-1?" outside":"")+(session?" planned":"")+(session&&state.done[date]?" done":"")+(date===state.selected?" selected":"")+(date===TODAY?" today":"");
   grid+='<button type="button" data-date="'+date+'" class="'+cl+'" aria-label="'+esc(fmt(date))+', '+(session?"Training":"frei")+'" aria-pressed="'+(date===state.selected)+'"><span>'+d.getDate()+'</span><span class="indicator">'+(session?(state.done[date]?"✓":"•"):" ")+'</span></button>';
 }
 const picked=p[state.selected];
 let card='<div class="day-head"><strong>'+esc(fmt(state.selected))+'</strong></div>';
 if(picked){
  card+='<div class="week-chip">Woche '+picked.week+' · Einheit '+picked.session+'/3</div><h3>'+(state.done[state.selected]?"Training erledigt ✓":"Für diesen Tag geplant")+'</h3><div class="task-list">'+picked.ids.map(n=>'<button class="task-row" type="button" data-exercise="'+n+'"><span class="task-num">'+n+'</span>'+esc(EXERCISES[n-1].title)+' ›</button>').join("")+'</div><button class="done-button '+(state.done[state.selected]?"is-done":"")+'" type="button" data-toggle="'+state.selected+'">'+(state.done[state.selected]?"✓ Erledigt · wieder öffnen":"✓ Training erledigt")+'</button><p class="privacy-note">5–10 Minuten Aufwärmen, danach 2–3 Übungen. Zwischen Krafttagen mindestens ein Ruhetag.</p>';
 }else{card+='<h3>Ruhetag 🌿</h3><p class="subline">Erholung gehört zum Training. Ein entspannter Spaziergang ist ausreichend.</p>';}
 return '<div class="eyebrow">Für Abby · Seniorenfitness</div><h1 class="page-title">Kleine Schritte.<br>Starke Hinterbeine.</h1><p class="subline">Dein persönlicher Trainingsbegleiter für sechs sanfte Wochen.</p>'+
 '<div class="hero-card"><div class="hero-copy"><strong>Sanft. Ruhig. Mit Abby.</strong><p>6 Wochen · 3 Trainingstage pro Woche</p><p>'+(next?"Nächste Einheit: "+esc(fmt(next)):"Alle Einheiten geschafft 🐾")+'</p></div><img class="hero-dog" src="./assets/abby-portrait.webp" alt="Abby, schwarzer Labrador-Mischling mit weißer Brust"></div>'+
 '<div class="card progress-card"><div class="progress-top"><strong>Dein Fortschritt</strong><span class="progress-fraction">'+count+' / '+total+'</span></div><div class="progress-track"><div class="progress-fill" style="width:'+percent+'%"></div></div><span class="progress-note">'+percent+' % erledigt · Daten bleiben auf deinem iPhone</span></div>'+
 '<div class="section-row"><h2>Trainingskalender</h2><span class="tiny">Tag antippen</span></div><div class="card calendar-card"><div class="calendar-head"><strong>'+esc(new Intl.DateTimeFormat("de-DE",{month:"long",year:"numeric"}).format(first))+'</strong><div class="month-controls"><button class="mini-icon-button" type="button" data-month="-1" aria-label="Monat zurück">‹</button><button class="mini-icon-button" type="button" data-month="1" aria-label="Monat vor">›</button></div></div><div class="weekdays"><span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span></div><div class="calendar-grid">'+grid+'</div><div class="calendar-legend"><span class="legend-chip"><i class="legend-dot"></i>Geplant</span><span class="legend-chip"><i class="legend-check">✓</i>Erledigt</span></div></div>'+
 '<div class="card day-card">'+card+'</div><div class="card start-card"><label for="startDate">Startdatum<small>Beginn am nächsten Montag</small></label><input id="startDate" type="date" value="'+state.start+'"></div><div class="backups"><button class="secondary-button" type="button" id="exportButton">Fortschritt sichern</button><button class="secondary-button" type="button" id="importButton">Sicherung laden</button></div><p class="privacy-note">Kein Konto nötig. Fortschritte werden lokal im Browser gespeichert und nicht mit GitHub synchronisiert.</p>';
}
function renderIntro(){
 return '<p class="eyebrow">Einleitung · Deine Vorbereitung</p><h1 class="page-title">Gut vorbereitet.<br>Sanft trainieren.</h1><p class="subline">Qualität und Freude sind bei einem zwölfjährigen Hund wichtiger als viele Wiederholungen.</p>'+
 '<div class="intro-banner"><div class="intro-copy"><strong>Fit bleiben.<br>Mit Freude.</strong><p>Sanftes Training mit unserem vierbeinigen Liebling.</p></div><img src="./assets/abby-portrait.webp" alt="Abby"></div>'+
 '<section class="card info-card"><h2>Das brauchst du</h2><ul class="checklist"><li>Kleine Leckerli</li><li>Rutschfeste Yogamatte</li><li>Niedrige stabile Erhöhung</li><li>Cavaletti-Stange (sehr niedrig beginnen)</li><li>Später optional ein flaches Balancekissen</li></ul></section>'+
 '<section class="card info-card"><h2>Ablauf je Training</h2><ul class="checklist"><li>5–10 Minuten entspannt aufwärmen</li><li>2–3 der angegebenen Übungen machen</li><li>Wenige saubere Wiederholungen und Pausen</li><li>Langsam auslaufen lassen</li><li>Mindestens einen Ruhetag zwischen Krafttagen</li></ul></section>'+
 '<div class="warning"><strong>Seniorhund-Sicherheit</strong>Bei Schmerzen, Lahmheit, Unsicherheit oder bekannten orthopädischen Erkrankungen bitte vor Beginn tierärztlich oder physiotherapeutisch abklären. Bei Wegknicken, Stolpern oder Erschöpfung sofort abbrechen.</div>'+
 '<button class="primary-button" type="button" data-go="2">Übung 1 entdecken →</button>';
}
function renderExercise(n){
 const e=EXERCISES[n-1];
 return '<p class="eyebrow">Übung '+n+' von 11</p><h1 class="page-title">'+esc(e.title)+'</h1><div class="badge-row"><span class="chip '+(e.level==="Fortgeschritten"?"orange":"")+'">'+esc(e.level)+'</span><span class="chip blue">'+esc(e.equipment)+'</span></div>'+
 '<figure class="card ex-hero">'+illustration(e)+'<figcaption class="ex-hero-caption">Abbys Bildkarte · langsam und kontrolliert arbeiten</figcaption></figure>'+
 '<div class="goal-card"><span class="goal-label">Ziel der Übung</span>'+esc(e.goal)+'</div>'+
 '<div class="card info-card"><h2>Schritt für Schritt</h2><ol class="steps">'+e.steps.map((s,i)=>'<li class="step"><span class="step-num">'+(i+1)+'</span><p>'+esc(s)+'</p></li>').join("")+'</ol></div>'+
 '<div class="card how-many"><span class="emoji">⏱</span><div><strong>Dosierung</strong><p>'+esc(e.dose)+'</p></div></div>'+
 '<div class="warning"><strong>'+(e.level==="Fortgeschritten"?"Nur unter fachlicher Anleitung":"Worauf du achten solltest")+'</strong>'+esc(e.tip)+'</div>'+
 '<p class="exercise-footer">Die Angaben sind allgemeine Orientierungswerte und ersetzen keine individuelle physiotherapeutische Anleitung.</p>';
}
function go(n){state.page=Math.max(0,Math.min(12,n));render();window.scrollTo(0,0)}
function render(){
 main.innerHTML=state.page===0?renderCalendar():state.page===1?renderIntro():renderExercise(state.page-1);
 document.getElementById("topPill").textContent=state.page===0?"6-Wochen-Plan":state.page===1?"Einleitung":"Übung "+(state.page-1)+"/11";
 document.getElementById("pageLabel").textContent=state.page===0?"Kalender":state.page===1?"Einleitung":"Übung "+(state.page-1)+"/11";
 document.getElementById("prevButton").disabled=state.page===0;
 document.getElementById("nextButton").disabled=state.page===12;
 document.getElementById("pageDots").innerHTML=Array.from({length:13},(_,i)=>'<span class="'+(i===state.page?"active":"")+'"></span>').join("");
}
document.getElementById("homeButton").addEventListener("click",()=>go(0));
document.getElementById("navHome").addEventListener("click",()=>go(0));
document.getElementById("prevButton").addEventListener("click",()=>go(state.page-1));
document.getElementById("nextButton").addEventListener("click",()=>go(state.page+1));
main.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.dataset.go){go(+b.dataset.go);return}
 if(b.dataset.exercise){go(+b.dataset.exercise+1);return}
 if(b.dataset.month){state.month=monthBy(state.month,+b.dataset.month);render();return}
 if(b.dataset.date){state.selected=b.dataset.date;save();render();return}
 if(b.dataset.toggle){const v=b.dataset.toggle;if(!plan()[v])return;state.done[v]=!state.done[v];save();render();return}
 if(b.id==="exportButton"){const blob=new Blob([JSON.stringify({version:1,start:state.start,selected:state.selected,done:state.done},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="abby-training-fortschritt.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return}
 if(b.id==="importButton"){document.getElementById("importInput").click();return}
});
main.addEventListener("change",e=>{if(e.target.id!=="startDate")return;if(valid(e.target.value)){state.start=monday(e.target.value);state.selected=state.start;state.month=state.start.slice(0,7);state.done={};save()}render()});
document.getElementById("importInput").addEventListener("change",async e=>{
 const f=e.target.files[0];if(!f)return;
 try{
  if(f.size>100000)throw Error("too large");
  const p=JSON.parse(await f.text());
  if(p.version!==1||!valid(p.start)||!p.done||typeof p.done!=="object"||Array.isArray(p.done))throw Error("format");
  if(!confirm("Den bisherigen Trainingsfortschritt durch diese Sicherung ersetzen?"))return;
  state.start=monday(p.start);state.selected=valid(p.selected)?p.selected:state.start;state.month=state.selected.slice(0,7);state.done=Object.fromEntries(Object.entries(p.done).filter(([d,v])=>valid(d)&&v===true));save();render();alert("Sicherung eingelesen");
 }catch(err){alert("Die Sicherung konnte nicht gelesen werden.")}finally{e.target.value=""}
});
let touch=null;
main.addEventListener("touchstart",e=>{if(e.touches.length!==1){touch=null;return}touch={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
main.addEventListener("touchend",e=>{if(!touch||e.changedTouches.length!==1)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.4)go(state.page+(dx>0?1:-1))},{passive:true});
document.addEventListener("keydown",e=>{if(["INPUT","TEXTAREA"].includes(document.activeElement?.tagName))return;if(e.key==="ArrowRight")go(state.page+1);if(e.key==="ArrowLeft")go(state.page-1)});
if(!valid(saved.selected)){state.selected=upcoming(plan())||state.start;state.month=state.selected.slice(0,7)}
render();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
