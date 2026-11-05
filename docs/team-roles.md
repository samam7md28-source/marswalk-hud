# Team Roles & Task Breakdown

2026 NASA Space Apps Challenge — Marswalk Helmet HUD

## Roles

### Sama — Frontend & Infrastructure Lead
Owns the skeleton: the repo, the panorama rendering, and the framework.
- Set up the project repo and tech stack (plain HTML/JS, no build step).
- Build the panorama viewer using Pannellum (pan/zoom on 360° Mars images).
- Create the clickable hotspot system (science targets + hazards).
- Handle state management: current view, selected targets, planned route.
- Ensure it loads fast and runs smoothly on a projector for the judge demo.

### Haneen — UI/UX & HUD Designer
Owns the "wow factor": the sci-fi helmet visor overlay.
- Design the HUD layout: corner widgets, crosshairs, resource bars, mini-map.
- Build the HUD in HTML/CSS (or SVG for crisp sci-fi lines).
- Color scheme: dark visor edges, cyan/amber elements, red warnings.
- Pop-up panels for science targets; animate the HUD (pulsing warnings, boot-up).
- Fonts: Orbitron (headings) + Share Tech Mono (data).

### Mariem — Logic & Interactivity Developer
Owns the trade-offs: the engineering decisions that make it a real planning tool.
- Route-planning system: user clicks waypoints, app draws a path.
- Resource math: deduct Oxygen (distance), Battery (time), Comms (terrain).
- Trade-off logic: sunlight recharges battery but raises radiation; ridges block comms.
- Mission preview screen: summary before the user commits to the route.
- Failure/success conditions.

### Fatema — NASA Data & Research Lead
Owns the science layer: real NASA data, not made-up sci-fi.
- Find high-res 360° rover panoramas (Perseverance/Curiosity raw image archives).
- Research what NASA found at each location; document science targets.
- Pull real hazard data (slope angles, dust seasons, radiation).
- Compile everything into `data/scenes.json`.
- Write the science briefing text shown when targets are clicked.

### Malak — Polish, Audio & Pitch Lead
Owns the experience and the story.
- Source and integrate sound effects: radio static, breathing, alarms, boot-up chimes.
- Ambient audio: a low Mars wind drone.
- Build the mission briefing intro screen.
- Write and design the final pitch presentation.
- Integration testing: play through the whole experience end-to-end.

## 48-Hour Timeline

| When | Milestone |
|---|---|
| Sat morning | Kickoff, parallel setup, first panorama + viewer |
| Sat afternoon | Core build: HUD, hotspots, route logic, data |
| Sat night | First integration — minimum viable product |
| Sun morning | Trade-offs wired, animations, second panorama |
| Sun afternoon | Full playthroughs, bug fixing, pitch rehearsal |
| Sun evening | Final polish, record demo backup, submit |

## Integration Points

| Pair | When | What |
|---|---|---|
| Sama + Haneen | Sat night | Merge HUD onto panorama viewer |
| Sama + Mariem | Sun morning | Wire route logic into components |
| Fatema + Mariem | Sat evening | Data JSON feeds the logic |
| Haneen + Malak | Sun morning | Design the intro briefing screen |
| Malak + everyone | Sun afternoon | Playtest, find bugs, assign fixes |
