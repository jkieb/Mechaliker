# Mechaliker

Nachhilfe in Mechanik für TU, FH und HTL – Website unter dem Motto
**s<ins>TU</ins>nde<ins>M</ins>it<ins>E</ins>inemla<ins>CH</ins>en** (die hervorgehobenen Buchstaben ergeben *TU MECH*).

## Seiten

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite: Hero mit Motto, Fächerübersicht, Ablauf in drei Schritten, Team, Preise, Stimmen, FAQ |
| `kurse.html` | Alle Kurse mit Inhalten, Filter nach Zielgruppe, Crashkurs-Termine |
| `tutoren.html` | Geschichte, Haltung, Team, Zahlen |
| `preise.html` | Pakete, Ermäßigungen, Fragen zur Zahlung |
| `kontakt.html` | Anfrageformular, Kontaktdaten, Anfahrt, Impressum, Datenschutz |

## Baustellen-Sperre

Solange die Seite nicht fertig ist, liegt vor jeder Seite eine „Under Construction"-Sperre:
ein Vollbild-Hinweis, der erklärt, dass alle Angaben Platzhalter sind, und der erst durch
einen Klick auf *Trotzdem hineinschauen* verschwindet (gemerkt pro Browser-Sitzung via
`sessionStorage`). Zusätzlich bleibt oben ein gestreifter Hinweisbalken stehen.

Die Sperre steckt im HTML, nicht im Skript – ohne JavaScript bleibt sie also stehen.
Zum Entfernen vor dem Livegang: in allen `*.html` den Block `<div class="uc-gate">…</div>`
sowie `<div class="uc-banner">…</div>` löschen, dazu Abschnitt 20b in `css/mechaliker.css`
und den Abschnitt „Baustellen-Sperre" in `js/mechaliker.js`.

## Technik

- Statisches HTML, kein Build-Schritt, keine externen Abhängigkeiten (keine CDNs,
  keine Fremd-Schriftarten, keine Tracker) – DSGVO-freundlich und offline lauffähig.
- `css/mechaliker.css` – das gesamte Design-System (Farbtokens, Komponenten, Responsive Layout).
- `js/mechaliker.js` – mobiles Menü, Scroll-Effekte, Zähler, Kursfilter, Formularprüfung.
- Alle Illustrationen in `images/*.svg` sind eigens für dieses Projekt gezeichnet
  (Logo, Freischnitt-Blaupause, Fach-Icons, Portraits, Wien-Silhouette) – frei von Lizenzfragen.
- Barrierefreiheit: Skip-Link, sichtbarer Fokus, `aria`-Attribute an Menü, Filter und Formular,
  Respekt vor `prefers-reduced-motion`.

## Lokal ansehen

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Vor dem Livegang zu erledigen

- Kontaktformular an ein echtes Backend hängen (`php/form-process.php` ist noch die
  Vorlage aus dem alten Template; aktuell zeigt das Formular nur eine Bestätigung an).
- Platzhalter ersetzen: Adresse, Telefonnummer, E-Mail, Impressumsdaten, Preise, Termine.
- Team-Texte und Bewertungen durch echte Angaben ersetzen.
