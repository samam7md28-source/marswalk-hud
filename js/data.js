/* =====================================================================
   SCENE DATA  — FATEMA owns this file.
   - Swap the panorama path with a real NASA equirectangular image (2:1).
   - Set real pitch/yaw per target. TIP: leave hotSpotDebug:true in
     panorama.js and click the terrain — the console logs the exact
     yaw/pitch to use.
     pitch: -90 (down) .. +90 (up);  yaw: -180 .. +180 (compass heading).
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
      id: "t-silica", pitch: -8, yaw: 12,
      label: "Hydrated Silica Rock",
      mineral: "Opaline Silica (Hydrated)",
      hazard: "Low",
      coord: "Sector A-3",
      briefing: "Perseverance detected hydrated silica here — a strong candidate for preserving biosignatures. Sampling priority: HIGH."
    },
    {
      id: "t-delta", pitch: -3, yaw: -25,
      label: "Delta Sediment Layers",
      mineral: "Clay / Carbonate",
      hazard: "Medium (loose footing)",
      coord: "Sector B-1",
      briefing: "Layered sediments from an ancient river delta. Each layer is a chapter in Mars' wet past."
    },
    {
      id: "t-ridge", pitch: 5, yaw: 145,
      label: "Ridge Lookout",
      mineral: "Basalt (volcanic)",
      hazard: "High (steep slope, exposure)",
      coord: "Sector D-4",
      briefing: "Elevated vantage point. Offers comms line-of-sight but maximum radiation exposure in direct sun."
    }
  ]
};

/* =====================================================================
   MISSION STATE  — MARIEM owns this.
   Update these values as the route is planned; call updateHUD()
   (in panorama.js) afterwards to refresh the bars.
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
