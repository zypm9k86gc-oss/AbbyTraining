/* AbbyTraining – Cloud sync via Supabase; localStorage stays available offline. */
(()=>{
'use strict';
const area=document.getElementById('cloudPanel');
if(!area)return;
const CONFIG_KEY='abby-supabase-public-config-v1';
const QUEUE_PREFIX='abby-supabase-pending:';
const escapeText=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const checked=()=>Object.fromEntries(Object.entries(state.done).filter(([d,v])=>valid(d)&&v===true));
const snap=()=>({start:state.start,days:checked()});
let before=snap(),client=null,user=null,notice='',mail='',busy=false,choice=false,paused=false,runTimer=null,authUser=null;
const loadJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}};
const storeJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
function config(){const built=window.ABBY_SUPABASE_CONFIG||{},local=loadJSON(CONFIG_KEY,{});return {url:(built.url||local.url||'').trim(),key:(built.publishableKey||local.key||'').trim()}}
function configValid(c){try{const u=new URL(c.url);if(u.protocol!=='https:'||!u.hostname.endsWith('.supabase.co'))return false}catch{return false}
if(c.key.startsWith('sb_publishable_'))return c.key.length>25;
if(c.key.startsWith('eyJ')){try{const role=JSON.parse(atob(c.key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role;return role==='anon'}catch{return false}}
return false}
function queueKey(){return QUEUE_PREFIX+user.id}
function queue(){const q=loadJSON(queueKey(),{start:null,days:{}});if(!q.days||typeof q.days!=='object')q.days={};return q}
function show(){
  const c=config(),configured=configValid(c);
  let body='';
  if(!configured)body='<h2>☁️ Cloud verbinden</h2><p>Für die automatische Synchronisierung Projekt-URL und öffentlichen Supabase-Schlüssel eintragen.</p><form id="cloudConfig" class="abby-cloud-form"><label>Supabase-Projekt-URL<input name="url" type="url" required placeholder="https://xxxx.supabase.co"></label><label>Publishable Key<input name="key" type="text" required autocomplete="off" placeholder="sb_publishable_..."></label><button class="primary-button">Verbinden</button></form><p class="cloud-caption">Nur einen öffentlichen Publishable-/Anon-Key verwenden. Niemals einen Secret- oder Service-Role-Key.</p>';
  else if(!client)body='<h2>☁️ Cloud verbinden</h2><p>Die Verbindung ist noch nicht bereit. Offline kannst du weitertrainieren.</p><button class="secondary-button" id="cloudRetry" type="button">Erneut verbinden</button>';
  else if(!user)body='<h2>☁️ Trainingsdaten synchronisieren</h2><p>Auf allen Geräten mit derselben E-Mail-Adresse anmelden.</p><form class="abby-cloud-form" id="cloudEmail"><label>E-Mail<input name="email" type="email" required autocomplete="email" placeholder="name@beispiel.de"></label><button class="primary-button">Einmalcode senden</button></form>'+(mail?'<form class="abby-cloud-form" id="cloudCode"><label>Code aus der E-Mail<input name="code" inputmode="numeric" pattern="[0-9]{6,8}" maxlength="8" required autocomplete="one-time-code" placeholder="123456"></label><button class="secondary-button">Anmelden</button></form>':'');
  else {const q=queue(),pending=Object.keys(q.days).length+(q.start?1:0);
    body='<div class="abby-cloud-head"><h2>☁️ Cloud verbunden</h2><span class="abby-cloud-state">'+(pending?'⏳ '+pending+' offen':'✓ Synchronisiert')+'</span></div><p>Angemeldet: <strong>'+escapeText(user.email||'Benutzer')+'</strong></p>';
    if(choice)body+='<p class="abby-cloud-alert">Lokale Trainingshäkchen unterscheiden sich von der Cloud. Welchen Stand möchtest du verwenden?</p><div class="abby-cloud-actions"><button class="secondary-button" type="button" id="cloudUpload">Lokale Daten übernehmen</button><button class="secondary-button" type="button" id="cloudDownload">Cloud-Stand übernehmen</button></div>';
    body+='<div class="abby-cloud-actions"><button class="secondary-button" type="button" id="cloudSync">Jetzt synchronisieren</button><button class="secondary-button" type="button" id="cloudLogout">Abmelden</button></div>';
  }
  area.innerHTML=body+(notice?'<p class="abby-cloud-note" role="status">'+escapeText(notice)+'</p>':'');
}
function localChanged(){
 if(paused){before=snap();return}
 const now=snap();
 if(user){const q=queue();if(before.start!==now.start)q.start=now.start;
   for(const day of new Set([...Object.keys(before.days),...Object.keys(now.days)]))
     if(!!before.days[day]!==!!now.days[day])q.days[day]=!!now.days[day];
   storeJSON(queueKey(),q);schedule();
 }
 before=now;
}
window.abbyCloud={onLocalSave:localChanged};
function apply(remote){
  const q=user?queue():{days:{},start:null};
  paused=true;
  state.start=q.start||remote.settings?.start_date||state.start;
  state.done=Object.fromEntries((remote.days||[]).filter(d=>d.completed&&valid(d.training_date)).map(d=>[d.training_date,true]));
  for(const [date,val] of Object.entries(q.days||{}))if(valid(date)){if(val)state.done[date]=true;else delete state.done[date]}
  save();paused=false;before=snap();render();
}
async function fetchRemote(){
 const [a,b]=await Promise.all([
   client.from('abby_settings').select('start_date').eq('user_id',user.id).maybeSingle(),
   client.from('abby_training_days').select('training_date,completed').eq('user_id',user.id)
 ]);
 if(a.error)throw a.error;if(b.error)throw b.error;
 return {settings:a.data,days:b.data||[]};
}
async function uploadQueue(){
 let q=queue();
 if(q.start){
  const r=await client.from('abby_settings').upsert({user_id:user.id,start_date:q.start},{onConflict:'user_id'});
  if(r.error)throw r.error;q.start=null;storeJSON(queueKey(),q);
 }
 for(const [day,done] of Object.entries(q.days)){
  if(valid(day)){const r=await client.from('abby_training_days').upsert({user_id:user.id,training_date:day,completed:!!done},{onConflict:'user_id,training_date'});if(r.error)throw r.error}
  delete q.days[day];storeJSON(queueKey(),q);
 }
}
async function sync(first=false){
 if(!user||!client||busy||choice||!navigator.onLine)return;
 busy=true;notice='Synchronisiere …';show();
 try{
  const remote=await fetchRemote();
  if(first&&Object.values(state.done).some(Boolean)&&!queue().start&&Object.keys(queue().days).length===0){
    const local=snap();
    const rd=Object.fromEntries(remote.days.filter(r=>r.completed).map(r=>[r.training_date,true]));
    if(local.start!==(remote.settings?.start_date||local.start)||JSON.stringify(local.days)!==JSON.stringify(rd)){
      choice=true;notice='Bitte wähle, welche vorhandenen Daten übernommen werden sollen.';return;
    }
  }
  await uploadQueue();
  const latest=await fetchRemote();
  if(!latest.settings){
    const r=await client.from('abby_settings').upsert({user_id:user.id,start_date:state.start},{onConflict:'user_id'});
    if(r.error)throw r.error;
    latest.settings={start_date:state.start};
  }
  apply(latest);
  notice='Stand aktualisiert · '+new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit'}).format(new Date());
 }catch(err){notice='Offline oder Cloud-Fehler: '+(err.message||'Keine Verbindung')+'. Änderungen bleiben lokal gespeichert.'}
 finally{busy=false;show();if(user&&!choice){const q=queue();if(q.start||Object.keys(q.days).length)schedule()}}
}
function schedule(){if(runTimer)clearTimeout(runTimer);runTimer=setTimeout(()=>sync(),600)}
async function sessionChanged(s){
 const next=s?.user||null;const id=next?.id||null;const changed=id!==authUser;
 user=next;authUser=id;if(changed)choice=false;
 if(!user){notice='';show();return}
 if(changed)await sync(true);else show();
}
async function connect(){
 const c=config();
 if(!configValid(c)){client=null;show();return}
 if(!window.supabase||!window.supabase.createClient){client=null;notice='Supabase-Bibliothek ist gerade nicht verfügbar.';show();return}
 try{
   client=window.supabase.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'abbytraining-supabase-session'}});
   const res=await client.auth.getSession();if(res.error)throw res.error;
   client.auth.onAuthStateChange((_event,s)=>setTimeout(()=>sessionChanged(s),0));
   await sessionChanged(res.data.session);
 }catch(err){client=null;notice='Verbindung fehlgeschlagen: '+(err.message||'Fehler');show()}
}
area.addEventListener('submit',async e=>{
 e.preventDefault();
 const f=e.target;
 try{
   if(f.id==='cloudConfig'){
      const c={url:f.elements.url.value.trim(),key:f.elements.key.value.trim()};
      if(!configValid(c))throw Error('Ungültige URL oder Schlüssel. Nur Publishable-/Anon-Key eingeben.');
      storeJSON(CONFIG_KEY,{url:c.url,publishableKey:c.key});notice='Einstellungen gespeichert.';await connect();
   }else if(f.id==='cloudEmail'){
      mail=f.elements.email.value.trim();
      const r=await client.auth.signInWithOtp({email:mail,options:{emailRedirectTo:location.origin+location.pathname}});
      if(r.error)throw r.error;notice='Anmeldecode angefordert. Gib den Code aus der E-Mail ein.';show();
   }else if(f.id==='cloudCode'){
      const r=await client.auth.verifyOtp({email:mail,token:f.elements.code.value.trim(),type:'email'});
      if(r.error)throw r.error;mail='';notice='Erfolgreich angemeldet.';show();
   }
 }catch(err){notice='Fehler: '+(err.message||'Unbekannt');show()}
});
area.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 try{
  if(b.id==='cloudRetry')await connect();
  if(b.id==='cloudSync')await sync();
  if(b.id==='cloudLogout'){await client.auth.signOut();user=null;show()}
  if(b.id==='cloudUpload'){
    const q=queue();q.start=state.start;
    for(const [date,v]of Object.entries(state.done))if(valid(date))q.days[date]=!!v;
    storeJSON(queueKey(),q);choice=false;await sync();
  }
  if(b.id==='cloudDownload'){choice=false;await sync()}
 }catch(err){notice='Fehler: '+(err.message||'Unbekannt');show()}
});
window.addEventListener('online',()=>sync());
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
setInterval(()=>{if(!document.hidden)sync()},45000);
connect();
})();