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
  };
}
