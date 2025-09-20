# Patient Monitoring Prototype (SIT217 6.3D)

A minimal, client-only prototype to demonstrate a safety‑critical patient monitoring concept.

## Features
- Simulated vitals: HR, SBP/DBP, SpO₂, RR (random walk)
- Per‑patient thresholds (editable)
- Alerts after **sustained breach for ≥10 seconds**
- Multi‑channel notifications (simulated): on‑screen, audible beep, SMS/Email buttons
- Alert log with timestamps and acknowledgement (stored in localStorage)
- Clean UI (dark) and responsive cards

## How to Run Locally
Just open `index.html` in a modern browser.

## How to Deploy on GitHub Pages
1. Create a new repo named, for example, `patient-monitoring-prototype`.
2. Upload `index.html`, `styles.css`, and `app.js` to the repo root.
3. In the repo settings, enable **Pages** → Source: **Deploy from a branch**, Branch: `main`, Folder: `/root`.
4. Your prototype will be available at: `https://<your-username>.github.io/patient-monitoring-prototype/`

## Notes
- This is **not** a medical device and is for demonstration only.
- No backend required; all data is simulated in the browser.
