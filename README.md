# AbbyTraining – iPhone-Web-App

Persönlicher Trainingsbegleiter für Abby (schwarzer Labrador-Mischling mit weißer Brust).

## Funktionen
- Trainingskalender mit **18 Einheiten über 6 Wochen**, drei Einheiten pro Woche und Ruhetagen
- Jede Einheit im Kalender abhaken; Fortschritt wird auf dem Gerät gespeichert
- **Einleitung und elf fortlaufend nummerierte Übungen** mit schematischen Zeichnungen, Dosierung und Sicherheits-Hinweisen
- Auf dem iPhone **nach rechts wischen = nächste Übung**, nach links = vorherige
- Abbys Foto als App-Logo
- Datenexport und Wiederherstellung als JSON
- Offline-Nutzung nach dem ersten erfolgreichen Besuch (Service Worker)

## GitHub Pages veröffentlichen
Der Quellcode liegt bereits auf `main`. Ein Workflow für die Veröffentlichung liegt unter `.github/workflows/deploy.yml`.

1. Im Repository **Settings → Pages** öffnen.
2. Bei **Build and deployment → Source** den Eintrag **GitHub Actions** wählen.
3. In **Actions** den Workflow **Publish AbbyTraining** prüfen; wenn nötig über **Run workflow** starten.
4. Die Webseite ist dann unter **https://zypm9k86gc-oss.github.io/AbbyTraining/** erreichbar, sofern der Workflow erfolgreich war.

Alternativ kann als Source auch **Deploy from a branch → main → /(root)** gewählt werden; für diese einfache statische App ist das ebenfalls ausreichend.

### Installation auf dem iPhone
Veröffentlichte Webseite in Safari öffnen → Teilen → Zum Home-Bildschirm hinzufügen.

### Datensicherheit
Fortschritte liegen nur im lokalen Browser-Speicher, nicht in GitHub. JSON-Backup verwenden, bevor die Browserdaten gelöscht oder das Gerät gewechselt wird.

**Hinweis:** Das GitHub-Repository ist öffentlich. Abbys Bild ist daher als Quellmaterial öffentlich zugänglich.

### Trainingssicherheit
Der Plan ist eine allgemeine Orientierung und ersetzt keine tierärztliche oder physiotherapeutische Beurteilung. Schwierige Balanceübungen 10 und 11 sind für den zwölfjährigen Hund nicht Teil der verbindlichen Kalenderfolge.
