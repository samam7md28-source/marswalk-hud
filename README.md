# Marswalk Helmet HUD

A first-person astronaut Helmet HUD for planning Marswalks on the Martian surface — built for the **2026 NASA Space Apps Challenge**.

## The Challenge
**Interplanetary Survival Guide: Martian Map** — create a layered, integrated view of a location or route on the Martian surface that pulls together data from multiple NASA science missions, helping a human explorer plan and carry out a successful Marswalk.

## The Concept
Most teams will build a top-down 2D map. We're building a **first-person Helmet HUD**: the astronaut looks out at a real NASA rover panorama, with a sci-fi visor overlay showing science targets, hazards, and life-support constraints. The user plots a route across the terrain, balancing Oxygen, Battery, Comms, and Radiation to complete science objectives and return safely.

**Why it wins:** it's immersive, cinematic, and human-centric. It fuses geology, hazard avoidance, and life-support trade-offs into a single heads-up experience — the way a real astronaut would actually need it on the surface.

## Tech Stack
- **Plain HTML / CSS / JavaScript** — no build step, no `npm install`
- [Pannellum](https://pannellum.org/) — 360° panorama viewer (loaded via CDN)
- Google Fonts — Orbitron & Share Tech Mono for the HUD aesthetic
- Run it: open `index.html` in a browser, or serve locally

## Team
| Member | Role | Owns |
|---|---|---|
| Sama | Frontend & Infrastructure | Repo, panorama viewer, state management |
| Haneen | NASA Data & Research | The visor overlay, animations, visual polish |
| Mariem | Logic & Interactivity | Route planning, resource trade-offs, win/lose states |
| Fatema | Polish, Audio & Pitch | Scene data, science targets, real NASA data |
| Malak | UI/UX & HUD Design | Sound design, briefing flow, final presentation |

See [`docs/team-roles.md`](docs/team-roles.md) for the full task breakdown.

## Project Structure
```
marswalk-hud/
├── index.html              # App entry point
├── css/
│   └── hud.css             # HUD overlay styles
├── js/
│   ├── panorama.js         # Panorama viewer + hotspots
│   ├── logic.js            # Route planning + resource math
│   └── data.js             # Scene data loader
├── assets/
│   ├── panoramas/          # 360° Mars images (equirectangular, 2:1 ratio)
│   ├── audio/              # Sound effects + ambient audio
│   └── icons/              # HUD icons & markers
├── data/
│   └── scenes.json         # Structured scene/target data
└── docs/
    ├── team-roles.md       # Role & task assignments
    └── pitch.md            # Pitch notes & narrative
```

## Getting Started
1. Clone the repo.
2. Open `index.html` in your browser (Chrome or Firefox recommended).
3. If the panorama doesn't load (some browsers block local image textures), serve it locally:
   ```
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

## Development Workflow
- Work on a branch named after you: `git checkout -b sama/frontend`
- Commit small, commit often.
- Merge to `main` when a piece works — no formal PR review needed for a 48-hour hackathon.
- Pull before starting each session: `git pull origin main`
