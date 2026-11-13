/* =====================================================================
   SCENE DATA  — FATEMA owns this file.
   - Swap the panorama path with a real NASA equirectangular image (2:1).
   - Set real pitch/yaw per target. TIP: leave hotSpotDebug:true in
     panorama.js and click the terrain — the console logs the exact
     yaw/pitch to use.
     pitch: -90 (down) .. +90 (up);  yaw: -180 .. +180 (compass heading).
   - bearing aligns to yaw so the radar mini-map matches the panorama.
   - comp = composition bars shown in Haneen's target card.
===================================================================== */
const SCENE_DATA = {
  title: "Hogwallow Flats",
  panorama: "assets/panoramas/placeholder-mars.jpg",
  coord: "LAT 18.4447N / LON 77.4508E",
  objectives: [
    "Collect hydrated silica sample",
    "Survey delta sediment layers",
    "Reach the ridge lookout"
  ],
  targets: [
    {
      id: "T-01", pitch: -8, yaw: 12, bearing: 12,
      label: "Hydrated Silica Rock",
      mineral: "Opaline Silica (Hydrated)",
      hazard: "Low",
      coord: "Sector A-3",
      dist: 42, mass: "~180 kg", temp: "-58°C",
      comp: [["SiO2", 49], ["H2O", 12], ["FeO", 18]],
      briefing: "Perseverance detected hydrated silica here — a strong candidate for preserving biosignatures. Sampling priority: HIGH."
    },
    {
      id: "T-02", pitch: -3, yaw: -25, bearing: 335,
      label: "Delta Sediment Layers",
      mineral: "Clay / Carbonate",
      hazard: "Medium (loose footing)",
      coord: "Sector B-1",
      dist: 77, mass: "~60 kg", temp: "-61°C",
      comp: [["SiO2", 38], ["SO3", 22], ["CaO", 11]],
      briefing: "Layered sediments from an ancient river delta. Each layer is a chapter in Mars' wet past. Scan before touching."
    },
    {
      id: "T-03", pitch: 5, yaw: 145, bearing: 145,
      label: "Ridge Lookout",
      mineral: "Basalt (Volcanic)",
      hazard: "High (steep slope, exposure)",
      coord: "Sector D-4",
      dist: 104, mass: "n/a (outcrop)", temp: "-54°C",
      comp: [["SiO2", 52], ["FeO", 16], ["MgO", 8]],
      briefing: "Elevated vantage point. Offers comms line-of-sight but maximum radiation exposure in direct sun."
    }
  ]
};

/* =====================================================================
   MISSION STATE  — MARIEM owns this.
   Update these values as the route is planned; call HUD.set()
   afterwards to refresh the bars.
===================================================================== */
const MISSION_STATE = {
  started: false,
  startTime: null,
  oxygen: 100,
  battery: 100,
  comms: 100,
  radiation: 100,
  waypoints: [],
  visitedTargets: new Set()
};
