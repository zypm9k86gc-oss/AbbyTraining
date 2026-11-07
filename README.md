# AbbyTraining – Trainingsplan für Abby

iPhone-taugliche Web-App mit 6-Wochen-Kalender, 11 Übungen, Abbys Bildern, Wischsteuerung und optionaler Supabase-Cloud-Synchronisierung.

**App:** https://zypm9k86gc-oss.github.io/AbbyTraining/

## Bestehende Funktionen
- 18 geplante Trainingseinheiten, Häkchen für erledigte Tage.
- Kalender, Intro, 11 Übungen, Navigationspfeile und Wischgesten (links = nächste Seite).
- Offline-Modus und lokale Sicherung (Fortschritt sichern / Sicherung laden).
- Trainingsfortschritt liegt zunächst im Browser; GitHub speichert keine Trainingsdaten.

## Cloud-Synchronisierung mit Supabase

### 1. Projekt erstellen
1. Unter https://supabase.com/dashboard ein Projekt eröffnen bzw. auswählen.
2. Im Dashboard **SQL Editor** öffnen.
3. Den Inhalt von [supabase-setup.sql](./supabase-setup.sql) **einmal** ausführen.
4. Prüfen, dass **Authentication > Sign In / Providers > Email** aktiviert ist.
5. Unter **Authentication > Email Templates > Magic Link** den Nachrichtentext auf einen **Einmalcode** umstellen, z. B.:

    <p>Dein AbbyTraining-Anmeldecode: {{ .Token }}</p>

   Damit kann die iPhone-App den Code direkt prüfen. Der Standard-Magic-Link funktioniert nicht identisch.
6. Unter **Authentication > URL Configuration** eintragen:
   - **Site URL:** `https://zypm9k86gc-oss.github.io/AbbyTraining/`
   - **Redirect URL:** `https://zypm9k86gc-oss.github.io/AbbyTraining/`
   - Optional zusätzliche exakte URL `https://zypm9k86gc-oss.github.io/AbbyTraining/index.html`.

### 2. Öffentliche Projektkonfiguration eintragen
In **Project Settings > API Keys** den neuen **Publishable Key** (`sb_publishable_...`) und die **Project URL** ablesen.

Es gibt zwei Wege:

- **Direkt in der App:** Auf der Kalenderseite das Cloud-Formular ausfüllen. Dann werden URL und Publishable Key nur auf diesem Gerät gespeichert; auf einem zweiten Gerät müssen die Werte noch einmal eingegeben werden.
- **Einmal für alle Geräte:** [supabase-config.js](./supabase-config.js) ausfüllen und nach GitHub pushen. So ist die Verbindung für alle Geräte bereits voreingestellt; Nutzer müssen nur noch ihre E-Mail eingeben.

**Wichtig:** Nur ein öffentlicher Publishable Key, niemals einen Secret-/Service-Role-Key oder einen persönlichen Access Token im Browser oder GitHub ablegen. Im Projekt ist Row Level Security aktiviert und die SQL-Policies beschränken den Zugriff auf eigene Daten.

### 3. Auf beiden Geräten anmelden
1. AbbyTraining öffnen und denselben E-Mail-Account auf beiden Geräten verwenden.
2. Einmalcode anfordern und eingeben.
3. Falls zuvor lokale Trainingsdaten vorhanden waren, beim ersten Login zwischen **„Lokale Daten übernehmen“** und **„Cloud-Stand übernehmen“** wählen.
4. Trainingstage abhaken. Die App speichert sofort lokal, synchronisiert beim Ändern, beim erneuten Öffnen und regelmäßig (alle 45 Sekunden, solange die Seite geöffnet ist).

### Verhalten und Sicherheit
- **Offline:** Änderungen werden weiter lokal gespeichert und nach Wiederherstellung der Verbindung nachgesendet, solange du auf diesem Gerät angemeldet bist.
- **Ohne Cloud-Projekt:** Die App bleibt wie bisher vollständig lokal nutzbar.
- **Konflikte:** Letzte bestätigte Änderung desselben Tages gewinnt; unterschiedliche Tage werden unabhängig synchronisiert. Bei gleichzeitigem Offline-Arbeiten auf mehreren Geräten kann für denselben Tag eine spätere Synchronisierung eine frühere Änderung überschreiben.
- **Datenschutz:** Tabellen `abby_settings` und `abby_training_days` sind per RLS geschützt und nur nach Anmeldung zugänglich. Das GitHub-Repository ist öffentlich, deshalb gehören dort keine privaten Zugangsdaten hinein.
- Der Cloud-Abgleich benötigt eine Internetverbindung und eine aktiv angemeldete Supabase-Sitzung.

## Veröffentlichung und Installation
Ein vorhandener GitHub-Actions-Workflow veröffentlicht die App via GitHub Pages. Einmalig unter **Settings > Pages > Source: GitHub Actions** konfigurieren. Auf dem iPhone die App in Safari öffnen und über **Teilen > Zum Home-Bildschirm hinzufügen** installieren.

## Hinweis zum Hundetraining
Dieser Plan ist eine allgemeine Orientierung und ersetzt keine tierärztliche oder physiotherapeutische Beurteilung. Schwierige Balanceübungen 10 und 11 gehören nicht zum verbindlichen Kalenderplan für einen zwölfjährigen Hund.

## Face ID und Passkeys über Supabase (November 2026)

Die App verwendet die öffentliche Supabase-Projekt-URL und einen **Publishable Key**. Ein Secret-/Service-Role-Key darf nie in GitHub stehen.

**Projekt:** https://supabase.com/dashboard/project/cvlcrsnbwsoywdcwipti

1. Projekt aktivieren, falls pausiert. Im SQL-Editor `supabase-setup.sql` ausführen, wenn die Tabellen noch fehlen. Row Level Security muss aktiviert bleiben.
2. Authentication → URL Configuration: Site URL `https://zypm9k86gc-oss.github.io/AbbyTraining/`, ebenso als erlaubte Redirect URL.
3. Authentication → Passkeys: **Enable Passkey authentication** einschalten. RP Display Name: `AbbyTraining`. RP ID: `zypm9k86gc-oss.github.io`. RP Origins: `https://zypm9k86gc-oss.github.io` (OHNE App-Pfad). Die RP ID nicht ändern, nachdem Passkeys registriert wurden.
4. **Wiederherstellung über E-Mail-Link:** Die Supabase-Standardvorlage verschickt einen Magic Link. Die App unterstützt diesen Link, ohne dass die E-Mail-Vorlage geändert werden muss.
5. Einmalig in AbbyTraining einen Anmeldelink anfordern und in der E-Mail auf „Sign in“ tippen. Anschließend unter „Face ID / Passkey einrichten“ einen Passkey hinterlegen.
6. **Wichtig:** Ohne Custom SMTP können nur Adressen des Supabase-Projektteams E-Mails empfangen. Der Standardversand ist außerdem stark begrenzt. Für weitere Empfänger unter Authentication → SMTP einen eigenen Maildienst einrichten.
7. Bei Geräteverlust per E-Mail-Link wieder anmelden, neuen Passkey hinterlegen, alten Passkey entfernen. JSON-Backups bleiben möglich. Falls du die E-Mail-Vorlage später auf `{{ .Token }}` umstellst, unterstützt die App weiterhin die Code-Eingabe.

Passkey ist laut Supabase aktuell **experimentell**. Die App nutzt die gepinnte Version `@supabase/supabase-js@2.105.0` mit `auth.experimental.passkey: true`. Die Einrichtung ist erst vollständig, wenn Passkeys im Dashboard aktiv sind und ein echter WebAuthn-Test auf iOS erfolgreich war.

## Zwei getrennte Konten mit gemeinsamem Trainingsplan

Unterstützt Hotmail und Yahoo mit je eigenem Supabase-E-Mail-/Passwort-Konto. Für Neuregistrierung und Passwortwiederherstellung müssen E-Mails zugestellt werden können: **Ohne eigenen SMTP-Dienst beschränkt Supabase die Zustellung auf das Projektteam**. Zur Aktivierung von Yahoo (oder weiterer E-Mail-Adressen) bei Bedarf unter Authentication → SMTP einen eigenen E-Mail-Sendedienst konfigurieren. Bei bestehenden bestätigten Konten kann ein Passwort im angemeldeten Zustand über die App festgelegt werden.

Nach der Anmeldung:
1. Auf dem ersten Handy die **Trainingsgruppe erstellen** und einen Anzeigenamen festlegen. Die App zeigt einen zufälligen, einmalig nutzbaren Code mit 48 Stunden Laufzeit.
2. Auf dem zweiten Handy mit eigenem Yahoo-Konto anmelden → **Ich habe bereits einen Einladungscode** → Namen und Code eingeben.
3. Beide Konten sehen die identischen Trainingshäkchen und das Startdatum der ersten Person. Vorhandene persönliche Daten des zweiten Kontos werden nicht gelöscht; die App fragt bei Abweichungen, welche Daten übernommen werden sollen.
4. Auf jeder Übungsseite nach Durchführung **Übung jetzt protokollieren** auswählen. Supabase speichert Übungsnummer, **Serverzeit (Datum und Uhrzeit)** und Benutzerkennung; der angezeigte Name stammt aus der Mitgliedschaft.
5. Im Kalender unter **Trainingsverlauf** sehen beide die einzelnen Übungseinträge. Der Haken für eine komplette Einheit wird weiterhin separat gesetzt und synchronisiert.

**Datenhistorie:** Bereits vor dieser Erweiterung gesetzte Tageshäkchen enthalten keinen ursprünglichen Zeitstempel oder Übungsdetails. Diese Informationen können nicht nachträglich zuverlässig ermittelt werden.

**Sicherheit:** Zwei Konten pro Gruppe, zeitlich begrenzter Einmalcode, Mitgliedschaftsprüfung in PostgreSQL/RLS, nur authentifizierte Benutzer, keine öffentlich lesbaren Trainingseinträge. Kein Service-Role-Key im Browser. Quelle der DB-Migration: `supabase/shared-training-migration.sql`.


## Eigene letzte Seite: Konto & Trainingsdaten

Die Navigation umfasst **14 Seiten**: Kalender, Einleitung, Übung 1–11 und schließlich **Konto & Trainingsdaten**.
Auf der letzten Seite befinden sich Anmeldung mit E-Mail/Passwort oder Passkey, Cloud-Synchronisierung, Gruppen-Einladung, Trainingsverlauf, Startdatum und JSON-Backup. Der Kalender enthält nur die Trainingsübersicht und Tageshäkchen.
Navigation per Pfeilen und Wischgesten bleibt erhalten. Vor dem Ändern des Startdatums warnt die App, falls bereits Häkchen gesetzt sind.
