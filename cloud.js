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
let before=snap(),client=null,user=null,notice='',mail='',busy=false,choice=false,paused=false,runTimer=null,authUser=null,passkeyEntries=[],passkeyListLoaded=false,groupOwner=null,groupInfo=null;
const loadJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}};
const storeJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
function config(){const built=window.ABBY_SUPABASE_CONFIG||{},local=loadJSON(CONFIG_KEY,{});return {url:(built.url||local.url||'').trim(),key:(built.publishableKey||local.key||'').trim()}}
function configValid(c){try{const u=new URL(c.url);if(u.protocol!=='https:'||!u.hostname.endsWith('.supabase.co'))return false}catch{return false}
if(c.key.startsWith('sb_publishable_'))return c.key.length>25;
if(c.key.startsWith('eyJ')){try{const role=JSON.parse(atob(c.key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role;return role==='anon'}catch{return false}}
return false}
function ownerId(){return groupOwner||user?.id}
function queueKey(){return QUEUE_PREFIX+user.id+':'+ownerId()}
function queue(){
 const key=queueKey();
 let q=loadJSON(key,null);
 // Convert pre-group pending writes exactly once; never copy another user's queue into this group.
 if(!q&&user&&ownerId()===user.id){
   q=loadJSON(QUEUE_PREFIX+user.id,null);
   if(q){storeJSON(key,q);try{localStorage.removeItem(QUEUE_PREFIX+user.id)}catch{}}
 }
 q=q||{start:null,days:{}};
 if(!q.days||typeof q.days!=='object')q.days={};
 return q;
}
function show(){
  const c=config(),configured=configValid(c);
  let body='';
  if(!configured)body='<h2>☁️ Cloud verbinden</h2><p>Für die automatische Synchronisierung Projekt-URL und öffentlichen Supabase-Schlüssel eintragen.</p><form id="cloudConfig" class="abby-cloud-form"><label>Supabase-Projekt-URL<input name="url" type="url" required placeholder="https://xxxx.supabase.co"></label><label>Publishable Key<input name="key" type="text" required autocomplete="off" placeholder="sb_publishable_..."></label><button class="primary-button">Verbinden</button></form><p class="cloud-caption">Nur einen öffentlichen Publishable-/Anon-Key verwenden. Niemals einen Secret- oder Service-Role-Key.</p>';
  else if(!client)body='<h2>☁️ Cloud verbinden</h2><p>Die Verbindung ist noch nicht bereit. Offline kannst du weitertrainieren.</p><button class="secondary-button" id="cloudRetry" type="button">Erneut verbinden</button>';
  else if(!user)body='<h2>🔐 Bei AbbyTraining anmelden</h2><p>Melde dich bequem mit Face ID, Touch ID oder deinem Passkey an und synchronisiere deinen Trainingsstand.</p><button type="button" class="primary-button abby-passkey-main" id="cloudPasskeyLogin">Mit Face ID / Passkey anmelden</button><details class="abby-cloud-recovery" '+(mail?'open':'')+'><summary>Erste Anmeldung oder Zugang wiederherstellen</summary><p>Einmalig per E-Mail-Link anmelden, danach Face ID einrichten. Der Link hilft dir auch beim Gerätewechsel.</p><form class="abby-cloud-form" id="cloudEmail"><label>E-Mail-Adresse<input name="email" type="email" required autocomplete="email" placeholder="name@beispiel.de"></label><button type="submit" class="secondary-button">Anmeldelink senden</button></form>'+(mail?'<form class="abby-cloud-form" id="cloudCode"><label>Optional: Code aus der E-Mail<input name="code" inputmode="numeric" pattern="[0-9]{6,8}" maxlength="8" required autocomplete="one-time-code" placeholder="123456"></label><button type="submit" class="primary-button">Mit Code anmelden</button></form>':'')+'</details><details class="abby-cloud-recovery"><summary>Mit E-Mail und Passwort anmelden</summary><p>Jede Person verwendet die eigene E-Mail-Adresse und ein eigenes Passwort.</p><form class="abby-cloud-form" id="abbyPasswordLogin"><label>E-Mail<input type="email" name="email" required autocomplete="username"></label><label>Passwort<input type="password" name="password" required autocomplete="current-password"></label><button class="primary-button" type="submit">Anmelden</button></form><details><summary>Neues Konto erstellen</summary><form class="abby-cloud-form" id="abbyPasswordSignup"><label>E-Mail<input type="email" name="email" required></label><label>Passwort (mindestens 12 Zeichen)<input type="password" name="password" required minlength="12" autocomplete="new-password"></label><button class="secondary-button" type="submit">Konto erstellen</button></form></details><details><summary>Passwort vergessen?</summary><form class="abby-cloud-form" id="abbyPasswordReset"><label>E-Mail<input type="email" name="email" required></label><button class="secondary-button" type="submit">Zurücksetzlink senden</button></form></details></details>';
  else {const q=queue(),pending=Object.keys(q.days).length+(q.start?1:0);
    body='<div class="abby-cloud-head"><h2>☁️ Cloud verbunden</h2><span class="abby-cloud-state">'+(pending?'⏳ '+pending+' offen':'✓ Synchronisiert')+'</span></div><p>Angemeldet: <strong>'+escapeText(user.email||'Benutzer')+'</strong></p>';
    if(choice)body+='<p class="abby-cloud-alert">Die lokalen Daten unterscheiden sich vom Cloud-Trainingsplan. Wähle bevorzugt den Cloud-Stand, wenn du gerade einer Gruppe beigetreten bist. Lokale Daten übernehmen kann bestehende Gruppeneinträge ändern.</p><div class="abby-cloud-actions"><button class="secondary-button" type="button" id="cloudDownload">Gemeinsamen Cloud-Stand verwenden</button><button class="secondary-button" type="button" id="cloudUpload">Lokale Daten in Cloud schreiben</button></div>';
    body+='<section class="abby-passkey-box"><h3>🔑 Face ID und Passkeys</h3><p>Jetzt einen Passkey einrichten. Für den Notfall bleibt die E-Mail-Anmeldung erhalten. Hinterlege möglichst einen zweiten Passkey.</p><div class="abby-cloud-actions"><button class="primary-button" type="button" id="cloudRegisterPasskey">Face ID / Passkey einrichten</button><button class="secondary-button" type="button" id="cloudManagePasskeys">Passkeys verwalten</button></div>'+(passkeyListLoaded?'<div class="abby-passkey-list">'+(passkeyEntries.length?passkeyEntries.map(p=>'<div class="abby-passkey-item"><span>'+escapeText(p.friendly_name||'Passkey')+'<small> · '+escapeText(p.created_at?new Date(p.created_at).toLocaleDateString('de-DE'):'')+'</small></span><button type="button" class="secondary-button" data-passkey-remove="'+escapeText(p.id)+'">Entfernen</button></div>').join(''):'<p>Noch kein Passkey hinterlegt.</p>')+'</div>':'')+'</section>';
    body+='<details class="abby-cloud-recovery"><summary>Passwort für dieses Konto festlegen oder ändern</summary><form class="abby-cloud-form" id="abbyPasswordChange"><label>Neues Passwort (mindestens 12 Zeichen)<input type="password" name="password" required minlength="12" autocomplete="new-password"></label><button type="submit" class="secondary-button">Passwort speichern</button></form></details><div class="abby-cloud-actions"><button class="secondary-button" type="button" id="cloudSync">Jetzt synchronisieren</button><button class="secondary-button" type="button" id="cloudLogout">Abmelden</button></div>';
  }
  area.innerHTML=body+(notice?'<p class="abby-cloud-note" role="status">'+escapeText(notice)+'</p>':'');
  window.abbyShared?.render?.();
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
// Shared cloud API is defined after group helpers.
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
   client.from('abby_settings').select('start_date').eq('user_id',ownerId()).maybeSingle(),
   client.from('abby_training_days').select('training_date,completed').eq('user_id',ownerId())
 ]);
 if(a.error)throw a.error;if(b.error)throw b.error;
 return {settings:a.data,days:b.data||[]};
}
async function uploadQueue(){
 let q=queue();
 if(q.start){
  const r=await client.from('abby_settings').upsert({user_id:ownerId(),start_date:q.start},{onConflict:'user_id'});
  if(r.error)throw r.error;q.start=null;storeJSON(queueKey(),q);
 }
 for(const [day,done] of Object.entries(q.days)){
  if(valid(day)){const r=await client.from('abby_training_days').upsert({user_id:ownerId(),training_date:day,completed:!!done},{onConflict:'user_id,training_date'});if(r.error)throw r.error}
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
    const r=await client.from('abby_settings').upsert({user_id:ownerId(),start_date:state.start},{onConflict:'user_id'});
    if(r.error)throw r.error;
    latest.settings={start_date:state.start};
  }
  apply(latest);
  notice='Stand aktualisiert · '+new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit'}).format(new Date());
 }catch(err){notice='Offline oder Cloud-Fehler: '+(err.message||'Keine Verbindung')+'. Änderungen bleiben lokal gespeichert.'}
 finally{busy=false;show();if(user&&!choice){const q=queue();if(q.start||Object.keys(q.days).length)schedule()}}
}
function schedule(){if(runTimer)clearTimeout(runTimer);runTimer=setTimeout(()=>sync(),600)}
async function loadGroup(){
 if(!client||!user){groupOwner=null;groupInfo=null;return}
 const r=await client.from('abby_group_members').select('group_owner_id,member_id,display_name,role').eq('member_id',user.id).maybeSingle();
 if(r.error)throw r.error;
 groupInfo=r.data||null;groupOwner=r.data?.group_owner_id||user.id;
}
async function reloadGroup(){
 if(!user)return;
 const oldOwner=ownerId();
 await loadGroup();choice=false;
 if(oldOwner!==ownerId())before=snap();
 await sync(true);
 window.abbyShared?.onSessionChanged?.();
}
window.abbyCloud={
 onLocalSave:localChanged,
 getClient:()=>client,
 getUser:()=>user,
 getOwner:()=>ownerId(),
 getGroupInfo:()=>groupInfo,
 refreshGroup:reloadGroup
};
async function sessionChanged(s){
 const next=s?.user||null;const id=next?.id||null;const changed=id!==authUser;
 user=next;authUser=id;if(changed){choice=false;passkeyEntries=[];passkeyListLoaded=false;}
 if(!user){groupOwner=null;groupInfo=null;notice='';show();window.abbyShared?.onSessionChanged?.();return}
 if(changed){try{await loadGroup()}catch(err){notice='Gruppenzuordnung nicht verfügbar: '+(err.message||'Fehler');groupOwner=null;groupInfo=null;show();return}await sync(true)}
 else show();
 window.abbyShared?.onSessionChanged?.();
}

function ensurePasskeySupport(){
 if(!window.isSecureContext||!window.PublicKeyCredential||!navigator.credentials)throw Error('Passkeys benötigen HTTPS und einen kompatiblen Browser, z. B. Safari auf dem iPhone.');
 if(!client||typeof client.auth.signInWithPasskey!=='function'||typeof client.auth.registerPasskey!=='function')throw Error('Die Supabase-Bibliothek unterstützt Passkeys noch nicht. Bitte die Seite aktualisieren.');
}
async function refreshPasskeys(){
 if(!user)return;
 const r=await client.auth.passkey.list();
 if(r.error)throw r.error;
 passkeyEntries=Array.isArray(r.data)?r.data:((r.data&&r.data.passkeys)||[]);
 passkeyListLoaded=true;show();
}
async function passkeyLogin(){
 ensurePasskeySupport();
 const r=await client.auth.signInWithPasskey();
 if(r.error)throw r.error;
 notice='Mit Passkey angemeldet. Der Trainingsstand wird synchronisiert.';show();
}
async function passkeyRegister(){
 if(!user)throw Error('Melde dich zuerst mit E-Mail-Link oder Passwort an.');
 ensurePasskeySupport();
 const r=await client.auth.registerPasskey();
 if(r.error)throw r.error;
 notice='Face ID / Passkey eingerichtet. Registriere nach Möglichkeit auch einen zweiten Passkey.';
 await refreshPasskeys();
}
async function passkeyRemove(id){
 if(!user||!passkeyEntries.some(p=>p.id===id))throw Error('Passkey nicht gefunden. Bitte Liste aktualisieren.');
 if(!confirm('Diesen Passkey entfernen? Prüfe zuerst, ob du deine bestätigte E-Mail zur Wiederherstellung erreichen kannst.'))return;
 const r=await client.auth.passkey.delete({passkeyId:id});
 if(r.error)throw r.error;
 notice='Passkey entfernt. Ein E-Mail-Einmalcode ermöglicht weiterhin die Anmeldung.';
 await refreshPasskeys();
}

async function connect(){
 const c=config();
 if(!configValid(c)){client=null;show();return}
 if(!window.supabase||!window.supabase.createClient){client=null;notice='Supabase-Bibliothek ist gerade nicht verfügbar.';show();return}
 try{
   client=window.supabase.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'abbytraining-supabase-session',experimental:{passkey:true}}});
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
   }else if(f.id==='abbyPasswordLogin'){
      const r=await client.auth.signInWithPassword({email:f.elements.email.value.trim(),password:f.elements.password.value});
      if(r.error)throw r.error;notice='Angemeldet. Der gemeinsame Trainingsstand wird geladen.';show();
   }else if(f.id==='abbyPasswordSignup'){
      const r=await client.auth.signUp({email:f.elements.email.value.trim(),password:f.elements.password.value,options:{emailRedirectTo:location.origin+location.pathname}});
      if(r.error)throw r.error;notice=r.data.session?'Konto erstellt und angemeldet.':'Konto angelegt. Bitte bestätige deine E-Mail, bevor du dich anmeldest.';show();
   }else if(f.id==='abbyPasswordReset'){
      const r=await client.auth.resetPasswordForEmail(f.elements.email.value.trim(),{redirectTo:location.origin+location.pathname});
      if(r.error)throw r.error;notice='Falls die Adresse registriert ist, erhältst du eine E-Mail zum Zurücksetzen des Passworts.';show();
   }else if(f.id==='abbyPasswordChange'){
      if(!user)throw Error('Bitte zuerst anmelden.');
      const r=await client.auth.updateUser({password:f.elements.password.value});
      if(r.error)throw r.error;notice='Passwort aktualisiert.';show();
   }else if(f.id==='cloudEmail'){
      mail=f.elements.email.value.trim();
      const r=await client.auth.signInWithOtp({email:mail,options:{emailRedirectTo:location.origin+location.pathname}});
      if(r.error)throw r.error;notice='Anmeldelink angefordert. Öffne die E-Mail und tippe auf „Sign in“. Erhältst du stattdessen einen Code, kannst du ihn unten eingeben.';show();
   }else if(f.id==='cloudCode'){
      const r=await client.auth.verifyOtp({email:mail,token:f.elements.code.value.trim(),type:'email'});
      if(r.error)throw r.error;mail='';notice='Erfolgreich angemeldet.';show();
   }
 }catch(err){notice='Fehler: '+(err.message||'Unbekannt');show()}
});
area.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 try{
  if(b.id==='cloudPasskeyLogin')await passkeyLogin();
  if(b.id==='cloudRegisterPasskey')await passkeyRegister();
  if(b.id==='cloudManagePasskeys')await refreshPasskeys();
  if(b.dataset.passkeyRemove)await passkeyRemove(b.dataset.passkeyRemove);
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