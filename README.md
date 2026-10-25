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
