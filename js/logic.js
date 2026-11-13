/* =====================================================================
   ROUTE LOGIC  — MARIEM owns this file (Task 4.x).
   Stubs are provided so the rest of the app compiles; implement the
   real distance + resource math here.

   Resource keys (match the HUD bars):
     HUD.set("oxygen", value)   /   HUD.set("battery", value)
     HUD.set("comms", value)    /   HUD.set("radiation", value)
   Values are 0-100. The HUD auto-refreshes on each set().
===================================================================== */

// Drop a waypoint at a clicked panorama location.
// viewer.mouseEventToCoords(event) returns [yaw, pitch] in degrees.
function addWaypoint(yaw, pitch) {
  MISSION_STATE.waypoints.push({ yaw, pitch, order: MISSION_STATE.waypoints.length });
  // TODO (Mariem): draw the path on the panorama, sum distances,
  // deduct resources via HUD.set(), then update MISSION_STATE.
  console.log("Waypoint added:", { yaw: yaw.toFixed(1), pitch: pitch.toFixed(1) },
              "total:", MISSION_STATE.waypoints.length);
}

// Compute totals before the astronaut commits to the route.
function previewMission() {
  const wp = MISSION_STATE.waypoints;
  // TODO (Mariem): real distance + resource math.
  return {
    waypoints: wp.length,
    oxygenCost: wp.length * 10,   // placeholder: 10% per waypoint
    timeHours: wp.length * 0.4    // placeholder: ~24 min per waypoint
   ROUTE LOGIC  — MARIEM owns this file (Tasks 4.1 - 4.5).
   Synchronized with Sama's panorama.js and Fatema's SCENE_DATA.
===================================================================== */

// Ensure MISSION_STATE matches what Sama's panorama.js expects
if (typeof MISSION_STATE === 'undefined') {
  window.MISSION_STATE = {
    waypoints: [],
    visitedTargets: new Set(),
    oxygen: 100,
    battery: 100,
    comms: 100,     // Percentage or active status read by HUD
    radiation: 0,
    startTime: null,
    started: false
  };
}

/**
 * Helper: Convert yaw and pitch (in degrees) to a 3D unit vector.
 */
function coordsToVector(yaw, pitch) {
  const phi = (pitch * Math.PI) / 180;
  const theta = (yaw * Math.PI) / 180;
  return {
    x: Math.cos(phi) * Math.cos(theta),
    y: Math.sin(phi),
    z: Math.cos(phi) * Math.sin(theta)
  };
}

/**
 * Helper: Calculate surface distance (in meters) between two spherical points.
 */
function calculateSegmentDistance(p1, p2) {
  const v1 = coordsToVector(p1.yaw, p1.pitch);
  const v2 = coordsToVector(p2.yaw, p2.pitch);
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const clampedDot = Math.max(-1, Math.min(1, dot));
  const angularDistance = Math.acos(clampedDot);
  return angularDistance * 100; // Scaling factor for Martian terrain distance
}

/**
 * Task 4.1 & 4.2: Drop a waypoint at a clicked panorama location.
 */
function addWaypoint(yaw, pitch) {
  const newWaypoint = { yaw, pitch, order: MISSION_STATE.waypoints.length };
  MISSION_STATE.waypoints.push(newWaypoint);

  // If we have at least 2 waypoints, calculate distance & resource drain
  if (MISSION_STATE.waypoints.length >= 2) {
    const p1 = MISSION_STATE.waypoints[MISSION_STATE.waypoints.length - 2];
    const p2 = newWaypoint;
    
    const distance = calculateSegmentDistance(p1, p2);
    
    // Task 4.3: Trade-off Math
    const oxygenCost = distance * 0.15;
    const isExposed = pitch > 0;         // Sunlight exposure
    const isBehindRidge = pitch < -10;   // Blocked / trench

    let batteryDelta = -(distance * 0.1);
    let radiationDelta = 0;

    if (isExposed) {
      batteryDelta += 5;     // Solar recharge bonus
      radiationDelta += 2.5; // Higher radiation in the open sun
    } else {
      radiationDelta += 0.5; // Safe from cosmic rays in shadow
    }

    // Update flat properties required by Sama's updateHUD() in panorama.js
    MISSION_STATE.oxygen = Math.max(0, MISSION_STATE.oxygen - oxygenCost);
    MISSION_STATE.battery = Math.min(100, Math.max(0, MISSION_STATE.battery + batteryDelta));
    MISSION_STATE.comms = isBehindRidge ? 0 : 100; 
    MISSION_STATE.radiation = Math.min(100, MISSION_STATE.radiation + radiationDelta);
  }

  // Automatically refresh Sama's HUD resource bars
  if (typeof updateHUD === 'function') {
    updateHUD();
  }

  console.log("Waypoint added:", { yaw: yaw.toFixed(1), pitch: pitch.toFixed(1) },
              "total waypoints:", MISSION_STATE.waypoints.length);
}

/**
 * Task 4.4: Compute totals before the astronaut commits to the route[cite: 2].
 */
function previewMission() {
  const wp = MISSION_STATE.waypoints;
  if (wp.length < 2) {
    return {
      waypoints: wp.length,
      oxygenCost: 0,
      timeHours: 0,
      warning: "Add at least 2 waypoints to preview route."
    };
  }

  let totalDistance = 0;
  for (let i = 0; i < wp.length - 1; i++) {
    totalDistance += calculateSegmentDistance(wp[i], wp[i + 1]);
  }

  const oxygenCost = totalDistance * 0.15;
  const timeHours = (totalDistance / 1000) * 1.2;

  return {
    waypoints: wp.length,
    totalDistanceMeters: totalDistance.toFixed(1),
    oxygenCost: Math.round(oxygenCost),
    timeHours: timeHours.toFixed(2),
    commsStatus: MISSION_STATE.comms > 50 ? "Stable" : "Blackout Risk"
  };
}

/**
 * Task 4.5: Check failure/success conditions
 */
function checkMissionStatus() {
  if (MISSION_STATE.oxygen <= 0 || MISSION_STATE.battery <= 0) {
    return "FAILURE: Life support depleted.";
  }
  return "IN_PROGRESS";
}