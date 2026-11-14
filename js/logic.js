if (typeof MISSION_STATE === 'undefined') {
  window.MISSION_STATE = {
    waypoints: [],
    visitedTargets: new Set(),
    oxygen: 100,
    battery: 100,
    comms: 100,
    radiation: 0,
    startTime: null,
    started: false
  };
}

// Safety check to ensure numbers never become NaN
function sanitizeState() {
  if (isNaN(MISSION_STATE.oxygen)) MISSION_STATE.oxygen = 100;
  if (isNaN(MISSION_STATE.battery)) MISSION_STATE.battery = 100;
  if (isNaN(MISSION_STATE.comms)) MISSION_STATE.comms = 100;
  if (isNaN(MISSION_STATE.radiation)) MISSION_STATE.radiation = 0;
}

function coordsToVector(yaw, pitch) {
  const phi = (pitch * Math.PI) / 180;
  const theta = (yaw * Math.PI) / 180;
  return {
    x: Math.cos(phi) * Math.cos(theta),
    y: Math.sin(phi),
    z: Math.cos(phi) * Math.sin(theta)
  };
}

function calculateSegmentDistance(p1, p2) {
  const v1 = coordsToVector(p1.yaw, p1.pitch);
  const v2 = coordsToVector(p2.yaw, p2.pitch);
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const clampedDot = Math.max(-1, Math.min(1, dot));
  return Math.acos(clampedDot) * 100;
}

function addWaypoint(yaw, pitch) {
  
  sanitizeState();
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
    let radiationDelta = isExposed ? 2.5 : 0.5;

    if (isExposed) {
      batteryDelta += 5; // Solar recharge
    }

    MISSION_STATE.oxygen = Math.max(0, MISSION_STATE.oxygen - oxygenCost);
    MISSION_STATE.battery = Math.min(100, Math.max(0, MISSION_STATE.battery + batteryDelta));
    MISSION_STATE.comms = isBehindRidge ? 0 : 100;
    MISSION_STATE.radiation = Math.min(100, MISSION_STATE.radiation + radiationDelta);
  }

  sanitizeState();
  if (typeof updateHUD === 'function') updateHUD();
}

/**
 * Allows the team to hook up UI sliders to override/test resources instantly
 */
function setResourceOverride(resourceName, value) {
  if (MISSION_STATE.hasOwnProperty(resourceName)) {
    MISSION_STATE[resourceName] = Number(value);
    sanitizeState();
    if (typeof updateHUD === 'function') updateHUD();
  }
}

function previewMission() {
  sanitizeState();
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