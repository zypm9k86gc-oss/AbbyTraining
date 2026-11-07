/* AbbyTraining: shared two-account group and individual exercise audit trail. */
(()=>{
'use strict';
const area=document.getElementById('cloudPanel');
if(!area)return;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const cloud=()=>window.abbyCloud;
const client=()=>cloud()?.getClient?.();
const user=()=>cloud()?.getUser?.();
const membership=()=>cloud()?.getGroupInfo?.();
const owner=()=>cloud()?.getOwner?.();
let members=[],events=[],invite='',message='',pending=false,logging=false,lastUserId='',loaded=false;
const exerciseName=id=>(typeof EXERCISES!=='undefined'&&EXERCISES[id-1]?.title)||('Übung '+id);
const displayDate=date=>{try{return new Intl.DateTimeFormat('de-AT',{dateStyle:'medium'}).format(new Date(date+'T12:00:00'))}catch{return date}};
const displayTime=ts=>{try{return new Intl.DateTimeFormat('de-AT',{dateStyle:'medium',timeStyle:'short'}).format(new Date(ts))}catch{return ts}};
const who=id=>members.find(m=>m.member_id===id)?.display_name||'Mitglied';
const note=()=>message?'<p role="status" class="abby-shared-note">'+esc(message)+'</p>':'';
function render(){
 const auth=user(), c=client();
 const old=area.querySelector('#abbySharedPanel');if(old)old.remove();
 if(!auth||!c)return;
 const section=document.createElement('section');section.id='abbySharedPanel';section.className='abby-shared-panel';
 const m=membership();
 let html='<h3>🐾 Gemeinsamer Abby-Trainingsplan</h3>';
 if(!m){
   html+='<p>Du kannst deinen Trainingsstand mit einem zweiten, getrennten Konto teilen. Beide Personen melden sich mit ihrer eigenen E-Mail-Adresse und ihrem eigenen Passwort an.</p>';
   html+='<form id="abbyMakeInvite" class="abby-cloud-form"><label>Dein Name (wird im Protokoll angezeigt)<input name="displayName" required maxlength="50" placeholder="z. B. Alex" autocomplete="nickname"></label><button type="submit" class="primary-button">Trainingsgruppe erstellen und Einladungscode anzeigen</button></form>';
   html+='<details class="abby-cloud-recovery"><summary>Ich habe bereits einen Einladungscode</summary><form id="abbyJoinInvite" class="abby-cloud-form"><label>Dein Name<input name="displayName" maxlength="50" required placeholder="z. B. Sam"></label><label>Einladungscode<input name="token" maxlength="64" minlength="64" autocapitalize="off" spellcheck="false" required placeholder="Code vom ersten Handy"></label><button type="submit" class="primary-button">Gemeinsamer Gruppe beitreten</button></form></details>';
 }else{
   html+='<p>Ihr verwendet einen gemeinsamen Trainingskalender. Trainingseinträge enthalten das genaue Datum, die Uhrzeit und die ausführende Person.</p>';
   html+='<div class="abby-shared-people"><strong>Mitglieder:</strong> '+(members.length?members.map(m=>esc(m.display_name)+(m.role==='owner'?' (Verwaltung)':'')).join(' · '):'Wird geladen …')+'</div>';
   if(m.role==='owner'){
     if(members.length<2)html+='<form id="abbyMakeInvite" class="abby-cloud-form"><label>Dein Anzeigename<input name="displayName" maxlength="50" required value="'+esc(m.display_name)+'"></label><button class="secondary-button" type="submit">Neuen Einladungscode erzeugen (48 Stunden gültig)</button></form>';
     if(invite)html+='<div class="abby-shared-invite"><strong>Einladungscode</strong><code id="abbyInviteText">'+esc(invite)+'</code><button type="button" class="secondary-button" id="abbyCopyInvite">Code kopieren</button><small>Nur an die zweite Person weitergeben. Einmal verwendbar, nach 48 Stunden abgelaufen.</small></div>';
   }
   html+='<form id="abbyDisplayName" class="abby-cloud-form"><label>Deinen Namen im Trainingsprotokoll ändern<input name="displayName" required maxlength="50" value="'+esc(m.display_name)+'"></label><button type="submit" class="secondary-button">Namen speichern</button></form>';
   html+='<h3 class="abby-history-title">Trainingsverlauf</h3><p>Jede protokollierte Übung ist mit Zeitpunkt und Person gespeichert. Setze das Kalenderhäkchen weiterhin separat, wenn eine ganze Einheit erledigt ist.</p>';
   html+=events.length?'<div class="abby-shared-log">'+events.slice(0,35).map(e=>'<div class="abby-shared-log-item"><strong>'+esc(exerciseName(e.exercise_id))+'</strong><small>'+esc(displayTime(e.performed_at))+' · '+esc(who(e.actor_id))+'</small></div>').join('')+'</div>':'<p>Noch keine einzelnen Übungen protokolliert. Öffne eine Übungsseite und tippe auf „Übung jetzt protokollieren“.</p>';
 }
 section.innerHTML=html+note();
 area.append(section);onRender();
}
function onRender(){
 const slot=document.getElementById('abbyExerciseTracking');
 if(!slot)return;
 const m=membership(),auth=user();
 if(!auth||!m){
   slot.innerHTML='<strong>Trainingsprotokoll</strong><p>Zum Aufzeichnen von Datum, Uhrzeit und Person zuerst anmelden und eine Trainingsgruppe erstellen oder ihr beitreten.</p>';
   return;
 }
 const n=state.page-1;
 if(!(n>=1&&n<=11))return;
 slot.innerHTML='<h2>Übung protokollieren</h2><p>Nach der Durchführung hier bestätigen. Der Zeitpunkt wird von Supabase gespeichert; im gemeinsamen Kalender sehen beide, wer die Übung ausgeführt hat.</p><button type="button" class="done-button" id="abbyLogExercise" data-id="'+n+'" '+(logging?'disabled':'')+'>✓ Übung jetzt protokollieren</button>'+(logging?'<p>Speichere …</p>':'');
}
async function refresh(){
 const u=user(),c=client();
 if(!u||!c){members=[];events=[];loaded=false;render();return}
 const m=membership();
 if(!m){members=[];events=[];loaded=true;render();return}
 const [a,b]=await Promise.all([
   c.from('abby_group_members').select('member_id,display_name,role').eq('group_owner_id',m.group_owner_id),
   c.from('abby_exercise_events').select('id,group_owner_id,actor_id,training_date,exercise_id,performed_at').eq('group_owner_id',m.group_owner_id).order('performed_at',{ascending:false}).limit(120)
 ]);
 if(a.error)throw a.error;if(b.error)throw b.error;
 members=a.data||[];events=b.data||[];loaded=true;render();
}
async function onSessionChanged(){
 const u=user();
 if(!u){members=[];events=[];message='';invite='';lastUserId='';render();onRender();return}
 if(u.id!==lastUserId){members=[];events=[];invite='';message='';lastUserId=u.id;}
 try{await refresh()}catch(e){message='Trainingsgruppe: '+(e.message||'Verbindung fehlgeschlagen');render()}
}
async function createInvite(form){
 const name=form.elements.displayName.value.trim();
 const r=await client().rpc('abby_issue_invite',{p_display_name:name});
 if(r.error)throw r.error;
 invite=r.data;message='Der Code ist bereit. Öffne AbbyTraining auf dem zweiten Handy und melde dich dort mit dem Yahoo-Konto an.';
 await cloud().refreshGroup();await refresh();
}
async function joinInvite(form){
 const name=form.elements.displayName.value.trim(),token=form.elements.token.value.trim().toLowerCase();
 const r=await client().rpc('abby_accept_invite',{p_token:token,p_display_name:name});
 if(r.error)throw r.error;
 invite='';message='Erfolgreich verbunden! Beide Konten sehen nun denselben Kalender.';
 await cloud().refreshGroup();await refresh();
}
async function rename(form){
 const m=membership();if(!m)throw Error('Bitte zuerst Gruppe erstellen oder beitreten.');
 const name=form.elements.displayName.value.trim();
 const r=await client().from('abby_group_members').update({display_name:name}).eq('member_id',user().id);
 if(r.error)throw r.error;
 message='Anzeigename aktualisiert.';await cloud().refreshGroup();await refresh();
}
async function record(exerciseId){
 if(logging)return;
 const n=Number(exerciseId),m=membership(),u=user(),c=client();
 if(!m||!u||!c||!(n>=1&&n<=11))throw Error('Für das Protokoll muss eine gemeinsame Trainingsgruppe aktiv sein.');
 if(!navigator.onLine)throw Error('Zum genauen Zeitstempel ist eine Internetverbindung erforderlich. Die Übung wurde noch nicht gespeichert.');
 logging=true;onRender();
 try{
   const today=iso(new Date());
   const r=await c.from('abby_exercise_events').insert({
      group_owner_id:m.group_owner_id,actor_id:u.id,training_date:today,exercise_id:n
   }).select('id,performed_at').single();
   if(r.error)throw r.error;
   message=exerciseName(n)+' wurde um '+displayTime(r.data.performed_at)+' für '+who(u.id)+' gespeichert.';
   await refresh();
   alert(message);
 }finally{logging=false;onRender()}
}
area.addEventListener('submit',async e=>{
 const form=e.target;
 if(!['abbyMakeInvite','abbyJoinInvite','abbyDisplayName'].includes(form.id))return;
 e.preventDefault();
 if(pending)return;pending=true;
 try{
   if(form.id==='abbyMakeInvite')await createInvite(form);
   if(form.id==='abbyJoinInvite')await joinInvite(form);
   if(form.id==='abbyDisplayName')await rename(form);
 }catch(err){message='Fehler: '+(err.message||'Vorgang fehlgeschlagen');render()}
 finally{pending=false}
});
area.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='abbyCopyInvite'){
   try{await navigator.clipboard.writeText(invite);message='Einladungscode kopiert.'}catch{message='Bitte den Code gedrückt halten und manuell kopieren.'}
   render();
 }
});
main.addEventListener('click',async e=>{
 const b=e.target.closest('#abbyLogExercise');if(!b)return;
 try{await record(b.dataset.id)}catch(err){message='Übung nicht gespeichert: '+(err.message||'Fehler');alert(message);render()}
});
window.addEventListener('online',()=>{if(user())refresh().catch(()=>{})});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&user())refresh().catch(()=>{})});
setInterval(()=>{if(!document.hidden&&user())refresh().catch(()=>{})},45000);
window.abbyShared={render,onRender,onSessionChanged,refresh};
onSessionChanged();
})();