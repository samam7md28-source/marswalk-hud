/* =====================================================================
   PANORAMA VIEWER  — SAMA owns this (Tasks 2.2-2.4).
   - Initializes the Pannellum 360° viewer with pan/zoom.
   - Places hotspots from SCENE_DATA onto the terrain (they move as
     you pan — unlike the flat version).
   - Clicking a hotspot calls HUD.open(), which slides in Haneen's
     target info card.
   - Syncs the telemetry heading to the actual panorama yaw.
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
    vaov: 101.01,        // partial vertical (Mastcam-Z mosaic FOV)
    vOffset: 0,          // horizon roughly centered
    minPitch: -40,       // limit downward pan (partial pano)
    maxPitch: 40,        // limit upward pan (partial pano)
    hotSpotDebug: true,   // logs yaw/pitch on click — Fatema uses this to place real targets
    autoLoad: true,
    showZoomCtrl: false,   // scroll to zoom instead, keeps the HUD clean
    showFullscreenCtrl: false,
    compass: false,
    hotSpots: buildHotspots()
  });

  // Hook for Mariem: wire terrain clicks to addWaypoint().
  // Pannellum fires 'mousedown' on bare terrain; hotspot clicks are
  // handled separately by clickFunc. Uncomment once Mariem is ready.
  // viewer.on("mousedown", function (event) {
  //   const c = viewer.mouseEventToCoords(event);   // [yaw, pitch]
  //   addWaypoint(c[0], c[1]);
  // });

  viewer.on("load", () => console.log("Panorama loaded:", SCENE_DATA.title));

  // Sync the telemetry heading to where the astronaut is actually looking.
  setInterval(() => {
    if (!viewer) return;
    const yaw = viewer.getYaw();
    const h = ((Math.round(yaw) % 360) + 360) % 360;
    document.getElementById("hdg").textContent = String(h).padStart(3, "0");
  }, 200);
}

initPanorama();
