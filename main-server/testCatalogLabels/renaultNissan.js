function newLabel(parameter, shortDescription, description) {
  return { parameter, shortDescription, description };
}

module.exports = new Set([
  newLabel("LngSpd", "Speed, (km/h)", "Vehicle Speed (Constant)"),
  newLabel(
    "LngSpd_TOL",
    "Speed Tolerance (km/h)",
    "Vehicle Speed tolerance (Constant)"
  ),
  newLabel(
    "LngSpd_INI",
    "Initial Speed, (km/h)",
    "Initial vehicle speed in gear shifting"
  ),
  newLabel(
    "LngSpd_INI_TOL",
    "Initial Speed Tolerance (km/h)",
    "Initial vehicle speed in gear shifting toleramce"
  ),
  newLabel(
    "LngSpd_MID",
    "Middle Speed, (km/h)",
    "Intermediate vehicle speed in gear shifting toleramce"
  ),
  newLabel(
    "LngSpd_MID_TOL",
    "Middle Speed Tolerance (km/h)",
    "Intermediate vehicle speed in gear shifting toleramce tolerance"
  ),
  newLabel(
    "LngSpd_FIN",
    "Final Speed, (km/h)",
    "Final vehicle speed in gear shifting toleramce"
  ),
  newLabel(
    "LngSpd_FIN_TOL",
    "Final Speed Tolerance (km/h)",
    "Final vehicle speed in gear shifting toleramce tolerance"
  ),
  newLabel(
    "LatSpeed",
    "Lateral Speed (m/sec)",
    "Vehicle lateral traveling speed (Constant)"
  ),
  newLabel(
    "LatSpeed_TOL",
    "Lateral Speed Tolerance, (m/sec)",
    "Vehicle lateral traveling speed tolerance (Constant)"
  ),
  newLabel(
    "LatSpeed_INI",
    "Initial Lateral Speed (m/sec)",
    "Initial vehicle traveling speed in gear shifting"
  ),
  newLabel(
    "LatSpeed_INI_TOL",
    "Initial Lateral Speed Tolerance, (m/sec)",
    "Initial vehicle traveling speed in gear shifting tolerance"
  ),
  newLabel(
    "LatSpd_MID",
    "Middle Lateral Speed, (km/h)",
    "Intermediate vehicle traveling speed in gear shifting"
  ),
  newLabel(
    "LatSpd_MID_TOL",
    "Middle Lateral Speed Tolerance (km/h)",
    "Intermediate vehicle traveling speed in gear shifting tolerance"
  ),
  newLabel(
    "LatSpd_FIN",
    "Final Lateral Speed, (km/h)",
    "Final vehicle traveling speed in gear shifting"
  ),
  newLabel(
    "LatSpd_FIN_TOL",
    "Final Lateral Speed Tolerance (km/h)",
    "Final vehicle traveling speed in gear shifting tolerance"
  ),
  newLabel(
    "LatDist_INI",
    "Initial Lateral Distance, (m)",
    "Initial horizontal position distance with other vehicle"
  ),
  newLabel(
    "LatDist_INI_TOL",
    "Initial Lateral Distance Tolerance, (m)",
    "Initial horizontal position distance with other vehicle tolerance"
  ),
  newLabel(
    "LatDist_MID",
    "Middle Lateral Distance, (m)",
    "Intermediate horizontal position distance with other vehicle"
  ),
  newLabel(
    "LatDist_MID_TOL",
    "Middle Lateral Distance Tolerance, (m)",
    "Intermediate horizontal position distance with other vehicle tolerance"
  ),
  newLabel(
    "LatDist_FIN",
    "Final Lateral Distance, (m)",
    "Final horizontal position distance with other vehicle"
  ),
  newLabel(
    "LatDist_FIN_TOL",
    "Final Lateral Distance Tolerance, (m)",
    "Final horizontal position distance with other vehicle tolerance"
  ),
  newLabel(
    "LngDist_INI",
    "Initial Longitudinal Distance, (m)",
    "Initial vertical position distance with other vehicle"
  ),
  newLabel(
    "LngDist_INI_TOL",
    "Initial Longitudinal Distance Tolerance, (m)",
    "Initial vertical position distance with other vehicle tolerance"
  ),
  newLabel(
    "LngDist_MID",
    "Middle Longitudinal Distance, (m)",
    "Intermediate vertical position distance with other vehicle"
  ),
  newLabel(
    "LngDist_MID_TOL",
    "Middle Longitudinal Distance Tolerance, (m)",
    "Intermediate vertical position distance with other vehicle tolerance"
  ),
  newLabel(
    "LngDist_FIN",
    "Final Longitudinal Distance, (m)",
    "Final vertical position distance with other vehicle"
  ),
  newLabel(
    "LngDist_FIN_TOL",
    "Final Longitudinal Distance Tolerance, (m)",
    "Final vertical position distance with other vehicle tolerance"
  ),
  newLabel(
    "Accel_LngDist",
    "Acceleration Timing Longitudinal Distance, (m)",
    "Longitudinal distance of the timing when the vehicle accelerates"
  ),
  newLabel(
    "Accel_LngDist_TOL",
    "Acceleration Timing Longitudinal Distance Tolerance, (m)",
    "Longitudinal distance of the timing when the vehicle accelerates tolerance"
  ),
  newLabel(
    "Accel_LatDist",
    "Acceleration Timing Lateral Distance, (m)",
    "Lateral distance of the timing when the vehicle accelerates"
  ),
  newLabel(
    "Accel_LatDist_TOL",
    "Acceleration Timing Lateral Distance Tolerance, (m)",
    "Lateral distance of the timing when the vehicle accelerates tolerance"
  ),
  newLabel(
    "Brake_LngDist",
    "Braking Timing Longitudinal Distance, (m)",
    "Longitudinal distance of the timing when the vehicle brake"
  ),
  newLabel(
    "Brake_LngDist_TOL",
    "Braking Timing Longitudinal Distance Tolerance, (m)",
    "Longitudinal distance of the timing when the vehicle brake tolerance"
  ),
  newLabel(
    "Brake_LatDist",
    "Braking Timing Lateral Distance, (m)",
    "Lateral distance of the timing when the vehicle brake"
  ),
  newLabel(
    "Brake_LatDist_TOL",
    "Braking Timing Lateral Distance Tolerance, (m)",
    "Lateral distance of the timing when the vehicle brake tolerance"
  ),
  newLabel(
    "LC_LngDist",
    "Lane Change Timing Longitudinal Distance, (m)",
    "Longitudinal distance when the vehicle lanes change"
  ),
  newLabel(
    "LC_LngDist_TOL",
    "Lane Change Timing Longitudinal Distance Tolerance, (m)",
    "Longitudinal distance when the vehicle lanes change tolerance"
  ),
  newLabel(
    "LC_LatDist",
    "Lane Change Timing Lateral Distance, (m)",
    "Lateral distance when the vehicle lanes change"
  ),
  newLabel(
    "LC_LatDist_TOL",
    "Lane Change Timing Lateral Distance Tolerance, (m)",
    "Lateral distance when the vehicle lanes change tolerance"
  ),
  newLabel("YawRate", "parking Angle, (degree)", "Vehicle YawRate"),
  newLabel(
    "YawRate_TOL",
    "parking Angle Tolerance, (degree)",
    "Vehicle YawRate tolerance"
  ),
  newLabel("YawRate_INI", "Yaw Rate (deg/s)", "Initial vehicle YawRate"),
  newLabel(
    "YawRate_INI_TOL",
    "Yaw Rate Tolerance (deg/s)",
    "Initial vehicle YawRate tolerance"
  ),
  newLabel(
    "YawRate_MID",
    "Initial YawRate Angle, (deg/s)",
    "Middle vehicle YawRate"
  ),
  newLabel(
    "YawRate_MID_TOL",
    "Initial YawRate Tolerance, (deg/s)",
    "Middle vehicle YawRate tolerance"
  ),
  newLabel("YawRate_FIN", "Middle YawRate, (deg/s)", "Final vehicle YawRate"),
  newLabel(
    "YawRate_FIN_TOL",
    "Middle YawRate Tolerance, (deg/s)",
    "Final vehicle YawRate tolerance"
  ),
  newLabel("App_Angle", "Final YawRate, (deg/s)", "Approach angle of vehicle"),
  newLabel(
    "App_Angle_TOL",
    "Final YawRate Tolerance, (deg/s)",
    "Approach angle of vehicle tolerance"
  ),
  newLabel(
    "Park_Angle",
    "Approaching Angle (degree)",
    "Parking angle of vehicle"
  ),
  newLabel(
    "Park_Angle_TOL",
    "Approaching Angle Tolerance (degree)",
    "Parking angle of vehicle tolerance"
  ),
  newLabel(
    "Park_LngDist",
    "Parking Longitudinal Distance (m)",
    "Longitudinal distance between parked vehicles"
  ),
  newLabel(
    "Park_LngDist_TOL",
    "Parking Longitudinal Distance Toleranc (m)",
    "Longitudinal distance between parked vehicles tolerance"
  ),
  newLabel(
    "Park_LatDist",
    "Parking_Lateral Distance (m)",
    "Lateral distance between parked vehicles"
  ),
  newLabel(
    "Park_LatDist_TOL",
    "Parking_Lateral Distance Toleranc (m)",
    "Lateral distance between parked vehicles tolerance"
  ),
  newLabel(
    "Start_LngDist",
    "Start Longitudinal Distance (m)",
    "Starting position of vehicle"
  ),
  newLabel(
    "Start_LngDist_TOL",
    "Start Longitudinal Distance Tolerance (m)",
    "Starting position of vehicle tolerance"
  ),
  newLabel(
    "Start_LatDist",
    "Start Lateral Distance (m)",
    "Starting position of vehicle"
  ),
  newLabel(
    "Start_LatDist_TOL",
    "Start Lateral Distance Tolerance (m)",
    "Starting position of vehicle tolerance"
  ),
  newLabel(
    "Stop_LngDist",
    "Stop Longitudinal Distance (m)",
    "Stopping position of vehicle"
  ),
  newLabel(
    "Stop_LngDist_TOL",
    "Stop Longitudinal Distance Tolerance (m)",
    "Stopping position of vehicle tolerance"
  ),
  newLabel(
    "Stop_LatDist",
    "Stop Lateral Distance (m)",
    "Stopping position of vehicle"
  ),
  newLabel(
    "Stop_LatDist_TOL",
    "Stop Lateral Distance Tolerance (m)",
    "Stopping position of vehicle tolerance"
  ),
  newLabel("Blck_Spec", "Blockage Spec", "Blockage adhering to vehicle"),
  newLabel(
    "Blck_Spec_TOL",
    "Blockage Spec Tolerance (cm)",
    "Blockage adhering to vehicle tolerance"
  ),
  newLabel("Rec_Time", "Recording Time (min)", "Recording time in vehicle"),
  newLabel(
    "Rec_Time_TOL",
    "Recording Tolerance (min)",
    "Recording time in vehicle tolerance"
  ),
  newLabel(
    "Mnt_Elev_Angl",
    "Mounting Elevation Angle Error",
    "Mounting Elevation Angle Parameter Error (Alignment Test)"
  ),
  newLabel(
    "Mnt_Elev_Angl_TOL",
    "Mounting Elevation Angle Error Tolerance",
    "Mounting Elevation Angle Parameter Error Tolerance (Alignment Test)"
  ),
  newLabel(
    "Mnt_Azim_Angl",
    "Mounting Azimuth Angle Error",
    "Mounting Azimuth Angle Parameter Error (Alignment Test)"
  ),
  newLabel(
    "Mnt_Azim_Angl_TOL",
    "Mounting Azimuth Angle Error Tolerance",
    "Mounting Azimuth Angle Parameter Error Tolerance (Alignment Test)"
  ),
  newLabel(
    "Sens_Reset",
    "Sensor Reset",
    "Presence or absence of sensor reset (Yes/No)"
  ),
  newLabel(
    "GW_Reset",
    "Gate Way Reset",
    "Presence or absence of Gate Wey reset (Yes/No)"
  ),
  newLabel("Description", "Description", "Description"),
  newLabel(
    "Time",
    "Time required, 1-Trial, (Minute)",
    "Enter the measurement time per one."
  ),
  newLabel("Object", "Object", "Select types of object from TAB"),
  newLabel("R", "Course Radius", "Definition of R in curve scenario"),
  newLabel(
    "Curve",
    "Direction",
    "Select direction in case of curve scenario from TAB"
  ),
  newLabel(
    "TestCOV_EntraceSide",
    "Coverage Entrance Side Distance (m)",
    "Coverage Entrance Side Distance (m), (CTA scenario)"
  ),
  newLabel(
    "TestCOV_ExitSide",
    "Coverage Exit Side Distance (m)",
    "Coverage Exit Side Distance (m), (CTA scenario)"
  ),
  newLabel(
    "TestCOV_Front",
    "Coverage Front Distance (m)",
    "Front data acquisition range"
  ),
  newLabel(
    "TestCOV_Rear",
    "Coverage Rear Distance (m)",
    "Rear data acquisition range"
  )
]);
