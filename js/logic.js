/* =====================================================================
   ROUTE LOGIC  — Updated to fix NaN bugs and add control hooks
===================================================================== */

// Initialize MISSION_STATE with solid default values to prevent NaN% errors
if (typeof MISSION_STATE === 'undefined') {
  window.MISSION_STATE = {
    waypoints: [],
    visitedTargets: new Set(),
    oxygen: 100,      // Starts safely at 100%
    battery: 100,     // Starts safely at 100%
    comms: 100,       // Starts safely at 100%
    radiation: 0,     // Starts at 0
    startTime: null,
    started: false
  };
} else {
  // Ensure existing state properties are never undefined/NaN
  if (MISSION_STATE.oxygen === undefined) MISSION_STATE.oxygen = 100;
  if (MISSION_STATE.battery === undefined) MISSION_STATE.battery = 100;
  if (MISSION_STATE.comms === undefined) MISSION_STATE.comms = 100;
  if (MISSION_STATE.radiation === undefined) MISSION_STATE.radiation = 0;
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
  return angularDistance * 100; 
}

/**
 * Drop a waypoint at a clicked panorama location.
 */
function addWaypoint(yaw, pitch) {
  const newWaypoint = { yaw, pitch, order: MISSION_STATE.waypoints.length };
  MISSION_STATE.waypoints.push(newWaypoint);

  if (MISSION_STATE.waypoints.length >= 2) {
    const p1 = MISSION_STATE.waypoints[MISSION_STATE.waypoints.length - 2];
    const p2 = newWaypoint;
    
    const distance = calculateSegmentDistance(p1, p2);
    
    const oxygenCost = distance * 0.15;
    const isExposed = pitch > 0;         
    const isBehindRidge = pitch < -10;   

    let batteryDelta = -(distance * 0.1);
    let radiationDelta = 0;

    if (isExposed) {
      batteryDelta += 5;     
      radiationDelta += 1.5; // 
    } else {
      radiationDelta += 0.2; 
    }

    // Update state safely with bounds (0 to 100)
    MISSION_STATE.oxygen = Math.max(0, MISSION_STATE.oxygen - oxygenCost);
    MISSION_STATE.battery = Math.min(100, Math.max(0, MISSION_STATE.battery + batteryDelta));
    MISSION_STATE.comms = isBehindRidge ? 0 : 100; 
    MISSION_STATE.radiation = Math.min(100, Math.max(0, MISSION_STATE.radiation + radiationDelta));
  }

  if (typeof updateHUD === 'function') {
    updateHUD();
  }
}

/**
 * Control Hook: Override a resource value (oxygen, battery, comms, radiation) for testing/debugging.
 */
function overrideResource(resourceName, value) {
  if (MISSION_STATE.hasOwnProperty(resourceName)) {
    MISSION_STATE[resourceName] = Math.max(0, Math.min(100, value));
    if (typeof updateHUD === 'function') updateHUD();
  }
}

/**
 * Preview Mission
 */
function previewMission() {
  const wp = MISSION_STATE.waypoints;
  if (wp.length < 2) {
    return { waypoints: wp.length, oxygenCost: 0, timeHours: 0, warning: "Add at least 2 waypoints." };
  }

  let totalDistance = 0;
  for (let i = 0; i < wp.length - 1; i++) {
    totalDistance += calculateSegmentDistance(wp[i], wp[i + 1]);
  }

  return {
    waypoints: wp.length,
    totalDistanceMeters: totalDistance.toFixed(1),
    oxygenCost: Math.round(totalDistance * 0.15),
    timeHours: ((totalDistance / 1000) * 1.2).toFixed(2),
    commsStatus: MISSION_STATE.comms > 50 ? "Stable" : "Blackout Risk"
  };
}