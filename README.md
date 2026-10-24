# Hinterhand – iPhone-Trainingsapp für Seniorhunde

Eine schlanke, deutschsprachige Progressive Web App (PWA) für einen 12-jährigen schwarzen Labrador-Mischling mit weißer Brust.

## Enthalten

- Trainingskalender als Startseite mit sechs Wochen und drei Terminen pro Woche (18 Einheiten)
- Häkchen pro Einheit, Fortschrittsanzeige und Wahl des Startmontags
- Einleitungsseite und **11 fortlaufend nummerierte Übungen** mit eigenen Skizzen, Schritten und Dosierung
- Touch-Navigation: **Finger nach rechts wischen = nächste Seite**; nach links = zurück
- Hundefoto als Logo und Homescreen-Icon
- Speicherstand auf dem Gerät per `localStorage`; JSON-Export und -Import als Backup
- Offline-Nutzung nach dem ersten Laden durch Service Worker; keine Accounts, Tracking-Skripte oder externen Dienste

## Veröffentlichung mit GitHub Pages

1. Auf https://github.com/new ein **öffentliches** Repository erstellen, z. B. `hinterhand-training`.
2. In das neue Repository gehen, **Add file → Upload files** wählen. Den gesamten Inhalt dieses Ordners (die Dateien und den Unterordner `assets`) hochladen. `index.html` muss auf der obersten Ebene liegen.
3. **Settings → Pages → Build and deployment** öffnen.
4. Als **Source** `Deploy from a branch` wählen, **Branch** `main`, Ordner `/(root)`, dann **Save**.
5. Nach Veröffentlichung öffnen unter `https://DEIN-GITHUB-NAME.github.io/hinterhand-training/` (Repository-Namen ggf. anpassen).

Hinweis: Bei öffentlichen GitHub-Pages-Seiten sind Quellcode und enthaltene Bilder öffentlich sichtbar. Das mitgelieferte Logo ist aus dem vom Nutzer bereitgestellten Hundefoto erstellt. Wer das Foto nicht veröffentlichen möchte, ersetzt die Dateien im `assets`-Ordner vor dem Upload.

### Als iPhone-App zum Home-Bildschirm hinzufügen

Veröffentlichte URL in Safari öffnen → **Teilen** → **Zum Home-Bildschirm** → **Hinzufügen**. Danach startet die App wie eine gewöhnliche Home-Bildschirm-App.

### Lokale Vorschau

Es sind keine Pakete oder Build-Tools nötig. Ein lokaler HTTP-Server reicht:

```bash
python3 -m http.server 8080
```

Anschließend `http://localhost:8080/` öffnen. Offline-Modus, Service Worker und Installationsverhalten erfordern HTTP/HTTPS (auf iOS die veröffentlichte HTTPS-Seite).

### Wichtige Hinweise

- Daten werden **nicht** mit GitHub oder anderen Geräten synchronisiert. Sie liegen im jeweiligen Safari-/PWA-Speicher. Für einen Gerätewechsel den Fortschritt als JSON sichern.
- Der 6-Wochen-Kalender ist eine vorsichtige Orientierung, kein medizinisch individuell angepasster Therapieplan. Schwierige Balanceübungen 10 und 11 gehören ausdrücklich nicht zur verpflichtenden Kalenderfolge.
- Bei Schmerzen, Lahmheit oder Unsicherheit das Training beenden und Tierarzt bzw. Hundephysiotherapie einbeziehen.