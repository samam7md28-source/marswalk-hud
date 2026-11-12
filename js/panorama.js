/* =====================================================================
   PANORAMA VIEWER + HUD WIRING  — SAMA owns this (Tasks 2.2-2.4).
   - Initializes the Pannellum 360° viewer with pan/zoom.
   - Renders hotspots from SCENE_DATA (Fatema's data).
   - Manages view state + target selection.
   - Reflects MISSION_STATE into the HUD bars.
===================================================================== */

let viewer = null;

function buildHotspots() {
  return SCENE_DATA.targets.map(t => ({
    id: t.id,
    pitch: t.pitch,
    yaw: t.yaw,
    type: "info",
    text: t.label,
    clickFuncArgs: t.id,
    clickFunc: selectTarget
  }));
}

function initPanorama() {
  viewer = pannellum.viewer("panorama", {
    type: "equirectangular",
    panorama: SCENE_DATA.panorama,
    hotSpotDebug: true,   // logs yaw/pitch on click — essential for placing targets
    compass: true,
    showZoomCtrl: true,
    showFullscreenCtrl: true,
    autoLoad: true,
    hotSpots: buildHotspots()
  });

  // Hook for Mariem: wire terrain clicks to addWaypoint().
  // Pannellum fires 'mousedown' on bare terrain; hotspot clicks are
  // handled separately by clickFunc. Uncomment once Mariem is ready,
  // and guard against hotspot/drag clicks there.
  // viewer.on("mousedown", function (event) {
  //   const c = viewer.mouseEventToCoords(event);   // [yaw, pitch]
  //   addWaypoint(c[0], c[1]);
  // });

  viewer.on("load", () => console.log("Panorama loaded:", SCENE_DATA.title));
}

/* ===== Target selection — wires Fatema's data into the side panel ==== */
function selectTarget(targetId) {
  const t = SCENE_DATA.targets.find(x => x.id === targetId);
  if (!t) return;
  document.getElementById("tp-name").textContent = t.label;
  document.getElementById("tp-mineral").textContent = t.mineral;
  document.getElementById("tp-hazard").textContent = t.hazard;
  document.getElementById("tp-coord").textContent = t.coord;
  document.getElementById("tp-briefing").textContent = t.briefing;
  document.getElementById("target-panel").classList.add("open");
  MISSION_STATE.visitedTargets.add(targetId);
}

function closeTargetPanel() {
  document.getElementById("target-panel").classList.remove("open");
}

/* ===== HUD rendering — reflects MISSION_STATE into the bars ========== */
function updateHUD() {
  for (const f of ["oxygen", "battery", "comms", "radiation"]) {
    const v = MISSION_STATE[f];
    const bar = document.getElementById("bar-" + f);
    document.getElementById("val-" + f).textContent = Math.round(v) + "%";
    bar.style.width = v + "%";
    bar.className = "resource-fill" + (v < 25 ? " crit" : v < 50 ? " warn" : "");
  }
}

function updateSceneInfo() {
  document.getElementById("scene-title").textContent = SCENE_DATA.title;
  document.getElementById("scene-coord").textContent = SCENE_DATA.coord;
  document.getElementById("briefing-site").textContent = SCENE_DATA.title;
  document.getElementById("objectives").innerHTML = SCENE_DATA.objectives
    .map((o, i) => "<div>" + (i + 1) + ". " + o + "</div>").join("");
}

/* ===== EVA timer — Malak owns the briefing flow; this is the clock === */
let timerInterval = null;

function startTimer() {
  MISSION_STATE.startTime = Date.now();
  timerInterval = setInterval(() => {
    const e = Math.floor((Date.now() - MISSION_STATE.startTime) / 1000);
    document.getElementById("eva-timer").textContent =
      String(Math.floor(e / 60)).padStart(2, "0") + ":" + String(e % 60).padStart(2, "0");
  }, 1000);
}

function startEVA() {
  document.getElementById("briefing").style.display = "none";
  MISSION_STATE.started = true;
  startTimer();
  updateHUD();
}

/* ===== Boot ===== */
updateSceneInfo();
initPanorama();
