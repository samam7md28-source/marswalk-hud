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
    haov: 360,
    vaov: 180,
    vOffset: 0,
    minPitch: -90,
    maxPitch: 90,
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