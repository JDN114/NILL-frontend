# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.js >> Accessibility — public pages >> gobd (/gobd) has no serious WCAG violations
- Location: tests/e2e/a11y.spec.js:109:9

# Error details

```
Error: 1 WCAG violation(s) at impact "serious"+ on "gobd":
  [serious] color-contrast: Elements must meet minimum color contrast ratio thresholds

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 268

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"nf-copy\">© 2026 NILL</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".nf-copy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/Impressum\">Impressum</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"Impressum\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/Datenschutz\">Datenschutz</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"Datenschutz\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/agb\">AGB</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"agb\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/Widerruf\">Widerruf</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"Widerruf\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/gobd\">GoBD</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"gobd\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#03060a",
+               "contrastRatio": 3.12,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#5d5e5e",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<html lang=\"de\" data-theme=\"dark\">",
+                 "target": Array [
+                   "html",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.12 (foreground color: #5d5e5e, background color: #03060a, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a class=\"nf-link\" href=\"/barrierefreiheit\">Barrierefreiheit</a>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "a[href$=\"barrierefreiheit\"]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - img
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e10]: Cookies & Datenschutz
        - paragraph [ref=e11]:
          - text: Wir verwenden Cookies für anonyme Nutzungsanalysen — Seitenaufrufe, Verweildauer, Länder und Interaktionen. Du entscheidest, was du erlaubst.
          - button "Details ▼" [ref=e12] [cursor=pointer]
      - generic [ref=e13]:
        - button "Nur notwendige" [ref=e14] [cursor=pointer]
        - button "Alle akzeptieren ✓" [ref=e15] [cursor=pointer]
  - generic [ref=e17]:
    - button "NILL" [ref=e18] [cursor=pointer]:
      - generic [ref=e21]: NILL
    - generic [ref=e22]: Rechtliche Informationen
    - heading "So ist NILL GoBD-konform" [level=1] [ref=e24]
    - generic [ref=e26]:
      - paragraph [ref=e27]:
        - text: Die
        - strong [ref=e28]: GoBD
        - text: („Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form sowie zum Datenzugriff", BMF-Schreiben vom 28.11.2019) sind der Maßstab, an dem das Finanzamt jede digitale Buchführung misst. Wer dagegen verstößt, riskiert Hinzuschätzungen bei der Betriebsprüfung.
      - paragraph [ref=e29]: NILL wurde von Grund auf entlang dieser Anforderungen gebaut — nicht nachträglich „GoBD-ready" gemacht. Hier ist, wie jede Anforderung konkret umgesetzt ist.
      - generic [ref=e30]:
        - generic [ref=e31]:
          - generic [ref=e32]: 🔒
          - heading "Unveränderlichkeit (§146 Abs. 4 AO)" [level=3] [ref=e33]
          - paragraph [ref=e34]: Festgeschriebene Buchungen können in NILL technisch nicht mehr geändert oder gelöscht werden — Datenbank-Trigger verhindern das auch auf Systemebene. Korrekturen erfolgen ausschließlich über dokumentierte Stornobuchungen. Jeder Buchungssatz trägt einen HMAC-SHA256-Integritätshash.
        - generic [ref=e35]:
          - generic [ref=e36]: 🧾
          - heading "Lückenlose Journale" [level=3] [ref=e37]
          - paragraph [ref=e38]: Jede Buchung erhält eine fortlaufende Journalnummer (GoBD Rz. 51). Soll und Haben müssen je Buchungssatz ausgeglichen sein — unvollständige Buchungen werden vom System abgelehnt. Eingangs- wie Ausgangsrechnungen sind durchgängig mit Buchungssätzen verknüpft.
        - generic [ref=e39]:
          - generic [ref=e40]: 📜
          - heading "Nachvollziehbarkeit & Audit-Trail" [level=3] [ref=e41]
          - paragraph [ref=e42]: "Jede Änderung an buchführungsrelevanten Daten landet in einem Audit-Log: wer, wann, was, warum. Die nach GoBD Rz. 151 ff. geforderte Verfahrensdokumentation generiert NILL automatisch aus der tatsächlichen Systemkonfiguration — immer aktuell, nie veraltet."
        - generic [ref=e43]:
          - generic [ref=e44]: 🗄️
          - heading "Aufbewahrung 10 Jahre (§147 AO)" [level=3] [ref=e45]
          - paragraph [ref=e46]: Belege werden revisionssicher archiviert; Löschversuche innerhalb der gesetzlichen Aufbewahrungsfrist werden durch Datenbank-Trigger blockiert. Zusätzlich erstellt NILL monatliche GoBD-Archiv-Snapshots mit dauerhafter Aufbewahrung.
        - generic [ref=e47]:
          - generic [ref=e48]: 🔍
          - heading "Datenzugriff Z1 / Z2 / Z3 (§147 Abs. 6 AO)" [level=3] [ref=e49]
          - paragraph [ref=e50]: "Für die Betriebsprüfung bietet NILL alle drei Zugriffsarten: einen zeitlich begrenzten read-only Prüferzugang (Z1), Auswertungen im System (Z2) und die Datenträgerüberlassung (Z3) als ZIP-Export nach dem Beschreibungsstandard der Finanzverwaltung — direkt einlesbar in IDEA & Co., inklusive SHA-256-Prüfsummen-Manifest."
        - generic [ref=e51]:
          - generic [ref=e52]: 💶
          - heading "Kassenführung & TSE (§146a AO)" [level=3] [ref=e53]
          - paragraph [ref=e54]: Anbindung zertifizierter technischer Sicherheitseinrichtungen (Swissbit, Deutsche Fiskal, VariConnect), DSFinV-K-Export für die Kassennachschau und Unterstützung der Mitteilungspflicht nach §146a Abs. 4 AO — mit vorbefüllten ELSTER-Meldedaten und Fristen-Überwachung.
        - generic [ref=e55]:
          - generic [ref=e56]: 📧
          - heading "E-Rechnung & Formate" [level=3] [ref=e57]
          - paragraph [ref=e58]: ZUGFeRD/Factur-X (EN 16931), XRechnung und UBL 2.1 — NILL erzeugt und verarbeitet strukturierte E-Rechnungen und erfüllt damit die seit 2025 geltende E-Rechnungspflicht im B2B-Geschäft. Girocode (EPC-QR) auf jeder Rechnung beschleunigt den Zahlungseingang.
        - generic [ref=e59]:
          - generic [ref=e60]: ⏱️
          - heading "Zeitnahe & vollständige Erfassung" [level=3] [ref=e61]
          - paragraph [ref=e62]: Belege kommen per Foto, E-Mail-Postfach oder Upload automatisch ins System — die KI extrahiert Beträge, Steuersätze und schlägt das passende SKR03-Konto vor. So gelingt die von den GoBD geforderte zeitnahe Erfassung (Rz. 45 ff.) ohne Mehraufwand.
        - generic [ref=e63]:
          - generic [ref=e64]: 🤝
          - heading "Steuerberater-Anbindung" [level=3] [ref=e65]
          - paragraph [ref=e66]: DATEV-Buchungsstapel (EXTF), DATEV-Lohn-Bewegungsdaten und ein sicherer read-only Kanzlei-Zugang mit eigenem Token — Ihr Steuerberater arbeitet direkt mit Ihren Daten, ohne dass Sie etwas exportieren oder per E-Mail verschicken müssen.
        - generic [ref=e67]:
          - generic [ref=e68]: 🚗
          - heading "Elektronisches Fahrtenbuch" [level=3] [ref=e69]
          - paragraph [ref=e70]: "Finanzamtskonform nach §8 Abs. 2 EStG: lückenlose Kilometerstände, Fahrten nach Erfassung unveränderlich, Korrekturen nur per dokumentiertem Storno, SHA-256-Hash-Kette gegen Manipulation — inklusive PDF-Export für die Prüfung."
      - heading "GoBD-Anforderungen im Überblick" [level=2] [ref=e71]
      - table [ref=e73]:
        - rowgroup [ref=e74]:
          - row "Anforderung (GoBD) Umsetzung in NILL" [ref=e75]:
            - columnheader "Anforderung (GoBD)" [ref=e76]
            - columnheader "Umsetzung in NILL" [ref=e77]
        - rowgroup [ref=e78]:
          - row "Nachvollziehbarkeit & Nachprüfbarkeit (Rz. 30 ff.) ✓Audit-Log, Hash-Ketten, Beleg-Buchung-Verknüpfung" [ref=e79]:
            - cell "Nachvollziehbarkeit & Nachprüfbarkeit (Rz. 30 ff.)" [ref=e80]
            - cell "✓Audit-Log, Hash-Ketten, Beleg-Buchung-Verknüpfung" [ref=e81]
          - row "Vollständigkeit (Rz. 36 ff.) ✓Lückenlose Journalnummern, Pflichtfeld-Validierung, Soll=Haben-Prüfung" [ref=e82]:
            - cell "Vollständigkeit (Rz. 36 ff.)" [ref=e83]
            - cell "✓Lückenlose Journalnummern, Pflichtfeld-Validierung, Soll=Haben-Prüfung" [ref=e84]
          - row "Richtigkeit (Rz. 44) ✓Automatische USt-Logik (19/7 %, §13b, §19, OSS), VIES-USt-ID-Prüfung" [ref=e85]:
            - cell "Richtigkeit (Rz. 44)" [ref=e86]
            - cell "✓Automatische USt-Logik (19/7 %, §13b, §19, OSS), VIES-USt-ID-Prüfung" [ref=e87]
          - row "Zeitgerechte Erfassung (Rz. 45 ff.) ✓KI-Belegerfassung per Foto & E-Mail, Bank-Sync, Erfassungszeitstempel" [ref=e88]:
            - cell "Zeitgerechte Erfassung (Rz. 45 ff.)" [ref=e89]
            - cell "✓KI-Belegerfassung per Foto & E-Mail, Bank-Sync, Erfassungszeitstempel" [ref=e90]
          - row "Ordnung (Rz. 53 ff.) ✓SKR03/SKR04-Kontenrahmen, Kontierungsvorschläge, Belegarchiv mit Volltextsuche" [ref=e91]:
            - cell "Ordnung (Rz. 53 ff.)" [ref=e92]
            - cell "✓SKR03/SKR04-Kontenrahmen, Kontierungsvorschläge, Belegarchiv mit Volltextsuche" [ref=e93]
          - row "Unveränderbarkeit (Rz. 58 ff., §146 Abs. 4 AO) ✓Festschreibung, Storno-Prinzip, DB-Trigger gegen UPDATE/DELETE, HMAC-Hashes" [ref=e94]:
            - cell "Unveränderbarkeit (Rz. 58 ff., §146 Abs. 4 AO)" [ref=e95]
            - cell "✓Festschreibung, Storno-Prinzip, DB-Trigger gegen UPDATE/DELETE, HMAC-Hashes" [ref=e96]
          - row "Aufbewahrung (Rz. 113 ff., §147 AO) ✓10-Jahres-Archiv, Löschschutz-Trigger, monatliche Archiv-Snapshots" [ref=e97]:
            - cell "Aufbewahrung (Rz. 113 ff., §147 AO)" [ref=e98]
            - cell "✓10-Jahres-Archiv, Löschschutz-Trigger, monatliche Archiv-Snapshots" [ref=e99]
          - row "Datenzugriff (Rz. 158 ff., §147 Abs. 6 AO) ✓Prüferzugang (Z1), Systemauswertungen (Z2), Export nach Beschreibungsstandard (Z3)" [ref=e100]:
            - cell "Datenzugriff (Rz. 158 ff., §147 Abs. 6 AO)" [ref=e101]
            - cell "✓Prüferzugang (Z1), Systemauswertungen (Z2), Export nach Beschreibungsstandard (Z3)" [ref=e102]
          - row "Verfahrensdokumentation (Rz. 151 ff.) ✓Automatisch generiert aus der realen Systemkonfiguration" [ref=e103]:
            - cell "Verfahrensdokumentation (Rz. 151 ff.)" [ref=e104]
            - cell "✓Automatisch generiert aus der realen Systemkonfiguration" [ref=e105]
          - row "Kassenführung (§146a AO, KassenSichV) ✓TSE-Anbindung, DSFinV-K-Export, §146a Abs. 4-Meldeassistent" [ref=e106]:
            - cell "Kassenführung (§146a AO, KassenSichV)" [ref=e107]
            - cell "✓TSE-Anbindung, DSFinV-K-Export, §146a Abs. 4-Meldeassistent" [ref=e108]
      - generic [ref=e109]:
        - heading "Wichtig zu wissen" [level=3] [ref=e110]
        - paragraph [ref=e111]:
          - text: Es gibt keine offizielle „GoBD-Zertifizierung" durch die Finanzverwaltung — entsprechende Werbeversprechen anderer Anbieter sind rechtlich ohne Bindungswirkung (GoBD Rz. 179 ff.). GoBD-Konformität entsteht immer aus dem Zusammenspiel von Software
          - emphasis [ref=e112]: und
          - text: "ihrer korrekten Nutzung: zeitnahe Belegerfassung, regelmäßige Festschreibung und eine aktuelle Verfahrensdokumentation. NILL nimmt Ihnen davon so viel wie technisch möglich ab — die Verfahrensdokumentation erstellt das System automatisch, Festschreibung und Fristen überwacht es für Sie."
      - paragraph [ref=e114]:
        - text: Fragen zur GoBD-Umsetzung oder zur Betriebsprüfung mit NILL? Schreiben Sie uns —
        - link "info@nillai.de" [ref=e115] [cursor=pointer]:
          - /url: mailto:info@nillai.de
  - contentinfo [ref=e116]:
    - generic [ref=e117]:
      - generic [ref=e118]: © 2026 NILL
      - navigation [ref=e119]:
        - link "Impressum" [ref=e120] [cursor=pointer]:
          - /url: /Impressum
        - link "Datenschutz" [ref=e121] [cursor=pointer]:
          - /url: /Datenschutz
        - link "AGB" [ref=e122] [cursor=pointer]:
          - /url: /agb
        - link "Widerruf" [ref=e123] [cursor=pointer]:
          - /url: /Widerruf
        - link "GoBD" [ref=e124] [cursor=pointer]:
          - /url: /gobd
        - link "Barrierefreiheit" [ref=e125] [cursor=pointer]:
          - /url: /barrierefreiheit
        - button "Cookie-Einstellungen" [ref=e126] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | 
  4   | /*
  5   |  * Accessibility (BFSG / WCAG 2.1 AA) automated checks.
  6   |  *
  7   |  * Why this exists: the Lighthouse CI job scans `./dist` (the static SPA shell),
  8   |  * so it only ever audits the public landing page — never the authenticated
  9   |  * accounting / invoice tables that Barrierefreiheit.jsx flags as not yet
  10  |  * conformant. These Playwright specs log in and run axe-core against the real
  11  |  * pages, including the ones behind auth.
  12  |  *
  13  |  * axe-core only covers the automatable subset of WCAG (~30-40%); a passing run
  14  |  * is NOT a full WCAG audit, but it catches the regressions that machines can.
  15  |  */
  16  | 
  17  | const HAS_CREDS = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);
  18  | 
  19  | // WCAG 2.0 + 2.1, levels A and AA — the BFSG-relevant scope.
  20  | const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
  21  | 
  22  | // Which impact levels fail the build. axe levels: minor < moderate < serious < critical.
  23  | // Default fails on serious+critical (the ones that actually block users such as
  24  | // screen-reader-broken tables and missing names); moderate/minor are reported only.
  25  | const FAIL_LEVEL = process.env.A11Y_FAIL_LEVEL || 'serious';
  26  | const RANK = { minor: 1, moderate: 2, serious: 3, critical: 4 };
  27  | const FAIL_RANK = RANK[FAIL_LEVEL] || RANK.serious;
  28  | 
  29  | /**
  30  |  * Run axe on the current page, attach a full report, log a summary, and assert
  31  |  * there are no violations at or above FAIL_LEVEL.
  32  |  */
  33  | async function checkA11y(page, testInfo, label) {
  34  |   // Cross-origin iframes (e.g. itrk.legal legal docs) can't be analysed by axe
  35  |   // and aren't ours to fix — exclude them so they don't add noise.
  36  |   //
  37  |   // SPAs perform client-side redirects/route normalisation after mount, which
  38  |   // can destroy the execution context mid-scan. Let the page settle, then retry
  39  |   // the analysis a couple of times if a navigation races the injected axe run.
  40  |   let results;
  41  |   for (let attempt = 1; attempt <= 3; attempt++) {
  42  |     try {
  43  |       await page.waitForLoadState('domcontentloaded');
  44  |       await page.waitForTimeout(1200); // let post-mount redirects settle
  45  |       results = await new AxeBuilder({ page })
  46  |         .withTags(WCAG_TAGS)
  47  |         .exclude('iframe')
  48  |         .analyze();
  49  |       break;
  50  |     } catch (err) {
  51  |       const racing = /execution context was destroyed|navigation|frame was detached/i.test(err.message);
  52  |       if (racing && attempt < 3) {
  53  |         await page.waitForTimeout(1500);
  54  |         continue;
  55  |       }
  56  |       throw err;
  57  |     }
  58  |   }
  59  | 
  60  |   const violations = results.violations;
  61  | 
  62  |   // Attach the raw report to the Playwright HTML report for triage.
  63  |   await testInfo.attach(`axe-${label}.json`, {
  64  |     body: JSON.stringify(violations, null, 2),
  65  |     contentType: 'application/json',
  66  |   });
  67  | 
  68  |   // Human-readable summary in the console / CI log.
  69  |   if (violations.length) {
  70  |     const summary = violations
  71  |       .map(v => `  [${v.impact || 'n/a'}] ${v.id} — ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})\n      ${v.helpUrl}`)
  72  |       .join('\n');
  73  |     console.log(`\nA11y violations on "${label}" (${violations.length}):\n${summary}\n`);
  74  |   } else {
  75  |     console.log(`A11y: no WCAG ${WCAG_TAGS.join('/')} violations on "${label}".`);
  76  |   }
  77  | 
  78  |   // Gate: only fail on impact >= FAIL_LEVEL.
  79  |   const blocking = violations.filter(v => (RANK[v.impact] || 0) >= FAIL_RANK);
  80  |   expect(
  81  |     blocking,
  82  |     `${blocking.length} WCAG violation(s) at impact "${FAIL_LEVEL}"+ on "${label}":\n` +
  83  |       blocking.map(v => `  [${v.impact}] ${v.id}: ${v.help}`).join('\n')
> 84  |   ).toEqual([]);
      |     ^ Error: 1 WCAG violation(s) at impact "serious"+ on "gobd":
  85  | }
  86  | 
  87  | async function login(page) {
  88  |   await page.goto('/login');
  89  |   await page.fill('input[type="email"], input[name="email"]', process.env.TEST_EMAIL);
  90  |   await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
  91  |   await page.click('button[type="submit"]');
  92  |   await page.waitForURL(/\/(dashboard|home|overview)/, { timeout: 15000 });
  93  | }
  94  | 
  95  | // ── Public pages — no credentials needed ──────────────────────────────────────
  96  | test.describe('Accessibility — public pages', () => {
  97  |   const publicPages = [
  98  |     { path: '/', label: 'landing-login' },
  99  |     { path: '/pricing', label: 'pricing' },
  100 |     { path: '/Impressum', label: 'impressum' },
  101 |     { path: '/Datenschutz', label: 'datenschutz' },
  102 |     { path: '/agb', label: 'agb' },
  103 |     { path: '/Widerruf', label: 'widerruf' },
  104 |     { path: '/barrierefreiheit', label: 'barrierefreiheit' },
  105 |     { path: '/gobd', label: 'gobd' },
  106 |   ];
  107 | 
  108 |   for (const { path, label } of publicPages) {
  109 |     test(`${label} (${path}) has no serious WCAG violations`, async ({ page }, testInfo) => {
  110 |       test.setTimeout(60_000); // axe + settle/retry can exceed the 30s default
  111 |       await page.goto(path);
  112 |       await checkA11y(page, testInfo, label);
  113 |     });
  114 |   }
  115 | });
  116 | 
  117 | // ── Authenticated pages — the ones Lighthouse-on-dist can't reach ─────────────
  118 | test.describe('Accessibility — authenticated pages', () => {
  119 |   // The accounting/invoice/team pages are the data tables the accessibility
  120 |   // statement explicitly flags (missing ARIA table roles, aria-live).
  121 |   const authPages = [
  122 |     { path: '/dashboard', label: 'dashboard' },
  123 |     { path: '/dashboard/accounting', label: 'accounting' },
  124 |     { path: '/dashboard/accounting/Transaction', label: 'transaction' },
  125 |     { path: '/dashboard/emails', label: 'emails' },
  126 |     { path: '/dashboard/workflow/team', label: 'workflow-team' },
  127 |     { path: '/dashboard/settings', label: 'settings' },
  128 |   ];
  129 | 
  130 |   for (const { path, label } of authPages) {
  131 |     test(`${label} (${path}) has no serious WCAG violations`, async ({ page }, testInfo) => {
  132 |       test.skip(!HAS_CREDS, 'TEST_EMAIL / TEST_PASSWORD not set');
  133 |       test.setTimeout(60_000); // axe + login + settle/retry can exceed the 30s default
  134 |       await login(page);
  135 |       await page.goto(path);
  136 |       await checkA11y(page, testInfo, label);
  137 |     });
  138 |   }
  139 | });
  140 | 
```