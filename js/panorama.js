/* =====================================================================
   PANORAMA VIEWER  — SAMA owns this (Tasks 2.2-2.4).
   - Initializes the Pannellum 360° viewer with pan/zoom.
   - Places hotspots from SCENE_DATA onto the terrain.
   - Clicking a hotspot calls HUD.open().
   - Syncs telemetry heading to actual panorama yaw.
===================================================================== */

let viewer = null;

function buildHotspots() {
  return SCENE_DATA.targets.map(t => ({
    id: t.id,
    pitch: t.pitch,
    yaw: t.yaw,
    type: "info",
    cssClass: "geo-marker",
    text: t.label,
    clickFuncArgs: t.id,
    clickFunc: function (id) { HUD.open(id); }
  }));
}

function initPanorama() {
  viewer = pannellum.viewer("panorama", {
    type: "equirectangular",
    panorama: SCENE_DATA.panorama,
    haov: 360,           // full horizontal coverage
    vaov: 180,           // CHANGED: Expanded to full vertical range (180 degrees) so you can look straight up and down
    vOffset: 0,          // horizon centered
    minPitch: -90,       // CHANGED: Allow looking straight down (-90 degrees)
    maxPitch: 90,        // CHANGED: Allow looking straight up (+90 degrees)
    hotSpotDebug: true,  
    autoLoad: true,
    showZoomCtrl: false,   
    showFullscreenCtrl: false,
    compass: false,
    hotSpots: buildHotspots()
  });

  // Active click hook for Mariem's addWaypoint()[cite: 12]
  viewer.on("mousedown", function (event) {
    const c = viewer.mouseEventToCoords(event);
    if (c) {
      addWaypoint(c[0], c[1]);
    }
  });

  viewer.on("load", () => console.log("Panorama loaded:", SCENE_DATA.title));

  // Sync telemetry heading
  setInterval(() => {
    if (!viewer) return;
    const yaw = viewer.getYaw();
    const h = ((Math.round(yaw) % 360) + 360) % 360;
    const hdgEl = document.getElementById("hdg");
    if (hdgEl) hdgEl.textContent = String(h).padStart(3, "0");
  }, 200);
}
initPanorama();