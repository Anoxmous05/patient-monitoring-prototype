Patient Monitoring Prototype (SIT217 – 6.3D Distinction Task)

A lightweight, browser-based prototype of a hospital patient monitoring system.
Developed for the SIT217: Introduction to Software Engineering research project (Task 6.3D).

⚠️ Disclaimer: This prototype is for educational demonstration only and is not a medical device.

🚑 Overview

This prototype simulates a safety-critical hospital monitoring system that tracks vital signs in real time, detects threshold breaches, and issues alerts. It demonstrates the application of requirement engineering, hazard analysis, and usability considerations in a healthcare context.

The system is implemented with HTML, CSS, and JavaScript — no backend or installation required.

✨ Features

Simulated Vitals: Heart rate, blood pressure, oxygen saturation (SpO₂), and respiratory rate.

Thresholds per Patient: Configurable by authorised staff via on-screen form.

Sustained Breach Alerts: Triggers when thresholds are exceeded for ≥10 seconds.

Multi-Channel Alerts (simulated): On-screen banner, audible beep, “Send SMS” and “Send Email” buttons.

Alert Logging: Time-stamped entries stored in browser localStorage; includes acknowledgement.

Usability Focus: Clean dark UI, responsive grid layout, single-click alert acknowledgement.



🚀 How to Run

Download or clone the repository.

Open index.html in any modern browser (Chrome, Firefox, Edge).

The dashboard will start displaying simulated vitals immediately.

No server setup required.

🌐 Live Demo

If you enable GitHub Pages, your prototype will be available at:
👉 https://Anoxmous05.github.io/patient-monitoring-prototype/

🔧 Limitations & Future Work

Only uses simulated vitals (no real sensors).

No backend storage or authentication.

Limited to a single patient view.

Potential future improvements:

Multi-patient dashboards.

Integration with real devices or APIs.

Predictive analytics using machine learning.

Secure login and audit trail support.

📅 Project Info

Unit: SIT217 – Introduction to Software Engineering

Task: 6.3D Distinction Level Research Project

Author: Noyal Sebastian

Last Updated: September 2025

🙏 Acknowledgements

Built entirely with vanilla HTML, CSS, and JavaScript.

Inspired by literature on safety-critical systems and patient monitoring best practices.

Educational prototype; not intended for clinical use.
