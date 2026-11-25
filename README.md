# Switch-Verkabelung

Netzwerk-Verkabelung im Browser planen und dokumentieren. Switches, Firewalls, Patchpanels, LWL-Panels, Server, USVs, Access Points und Hosts legst du in Schränken und Räumen an. Ihre Ports verbindest du per Drag & Drop.

- **Geräte im Stil gängiger Hersteller:** Lancom, UniFi, HP/HPE, FS, Dell, Supermicro, APC, Eaton, CyberPower, Aruba. Bei Firewalls zusätzlich Sophos, Fortinet, Palo Alto, WatchGuard und OPNsense.
- **Ports und Kabel:** RJ45, SFP, SFP+, SFP28, QSFP+ und QSFP28 sowie Patchpanels mit Vorder- und Rückseite. Kabel nach Cat-Standard, Glasfaser (OM1–OM5, OS2), DAC oder AOC, dazu die Transceiver.
- **Port-Nummerierung:** Bei zweireihigen Geräten wählbar: spaltenweise (1 oben, 2 unten oder 2 oben, 1 unten) oder nebeneinander (oben bzw. unten 1, 2, 3 …). Nummern und Beschriftungsfelder liegen immer über den Kabeln.
- **Strecke verfolgen:** Ein Klick auf einen Port oder ein Gerät markiert die ganze Strecke gelb, über Patchpanels hinweg bis zum Gegenport.
- **Prüfungen:** Geschwindigkeit, Transceiver-Reichweite, Faser- und Steckertyp, PoE, 100-m-Grenze bei Kupfer, LAG/STP.
- **Lebenszyklus:** Für jedes Gerät lässt sich ein Kaufjahr eintragen. Veraltete Geräte werden orange markiert (Standard: ab 5 Jahren), Geräte am Lebensende (EOL) rot (Standard: ab 10 Jahren). Die Schwellen sind fürs ganze Projekt und pro Gerät einstellbar.
- **Suche und Kategorien:** Die Suche findet Geräte, Personen, IPs und Port-Beschriftungen. Über „Ansicht“ lassen sich ganze Kategorien oder einzelne Räume, Schränke, Geräte und Hosts ausblenden.
- **Export:** Patchliste und Strecken als CSV, der Plan als SVG oder PNG, das Projekt als JSON.

## Auf einem Server betreiben (Docker)

Voraussetzung sind Docker und Docker Compose.

```bash
git clone https://github.com/theNic0ntr/switch-verkabelung.git
cd switch-verkabelung
docker compose up -d --build
```

Die App läuft danach auf `http://<server>:8080`. Der Plan wird auf dem Server gespeichert, also im Docker-Volume `daten` unter `/data/plan.json`, und ist damit in jedem Browser gleich. Speichern zwei Browser gleichzeitig, fragt die App, welche Version gelten soll.

### Anmeldung einschalten

Ohne Anmeldung kann jeder, der den Server erreicht, den Plan ändern. Trage in `docker-compose.yml` Benutzer und Passwort ein:

```yaml
    environment:
      AUTH_USER: admin
      AUTH_PASSWORD: ein-langes-passwort
```

Danach `docker compose up -d` ausführen. Die Anmeldung läuft über HTTP Basic Auth. Ist der Server von außen erreichbar, gehört davor ein Reverse Proxy mit HTTPS (z. B. Caddy, Traefik oder nginx), sonst gehen die Zugangsdaten unverschlüsselt über das Netz.

Beispiel mit Caddy, das sich automatisch um das Zertifikat kümmert:

```
netz.example.de {
    reverse_proxy 127.0.0.1:8080
}
```

### Einstellungen

| Variable | Standard | Bedeutung |
|---|---|---|
| `PORT` | `8080` | Port im Container |
| `AUTH_USER` / `AUTH_PASSWORD` | – | Anmeldung, nur zusammen gesetzt |
| `DATA_DIR` | `/data` | Ablage für `plan.json` und Sicherungen |
| `BACKUPS` | `50` | Anzahl der aufbewahrten Sicherungen (`0` = keine) |
| `BACKUP_MINUTES` | `10` | Höchstens eine Sicherung pro Zeitraum |
| `MAX_PLAN_MB` | `20` | Maximale Größe eines Plans |

### Sicherungen und Wiederherstellen

Vor dem Überschreiben legt der Server eine Kopie unter `/data/backups/` ab, höchstens alle 10 Minuten. Zusätzlich kannst du jederzeit über **Datei → Projekt speichern** eine JSON-Datei sichern und über **Datei → Projekt laden** wieder einspielen.

So kommst du an die Dateien im Volume:

```bash
docker compose cp switch-verkabelung:/data ./sicherung
```

### Aktualisieren

```bash
git pull
docker compose up -d --build
```

Fertige Images für amd64 und arm64 (auch Raspberry Pi) baut GitHub Actions bei jedem Push nach `ghcr.io/thenic0ntr/switch-verkabelung:latest`. Statt `build: .` kannst du in `docker-compose.yml` auch dieses Image verwenden.

### Ohne Docker

Benötigt wird Node.js ab Version 20. Weitere Pakete sind nicht nötig.

```bash
node scripts/build.mjs
DATA_DIR=./data node server/server.js
```

## Aufbau

```
src/          Quellen der App: head.html, base.css, extra.css, body.html, app.js, Schriften
scripts/      build.mjs fügt alles zu einer HTML-Datei zusammen
server/       server.js – liefert die App aus und speichert den Plan (nur Node-Bordmittel)
dist/         Build-Ergebnis (nicht im Repository)
```

`node scripts/build.mjs` erzeugt zwei Varianten:

- `dist/public/` ist die Server-Version mit lokal eingebundenen Schriften. Sie lädt nichts von Google und speichert über `/api/plan`.
- `dist/artifact.html` ist eine Einzeldatei mit Google Fonts, die auch ohne Server läuft und im Browser speichert (localStorage).

## Lizenz

Code: alle Rechte vorbehalten. Schrift: Hanken Grotesk, SIL Open Font License 1.1 (`src/fonts/OFL.txt`).
