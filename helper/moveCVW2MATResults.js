const fs = require("fs");
const Path = require("path");
const mkdirp = require("mkdirp");

const location =
  "V:\\JP01\\DataLake\\Common_Write\\CLARITY_OUPUT\\Subaru_77GHz\\CVW_Conversion\\Brendon_Dulam\\20190918_103333";

const LIDAR = "Lidar";
const BRAKE = "brake";
const CAN = "CAN";
const LABELLING = "Labelling";

fs.readdir(location, (err, files) => {
  if (err) return console.error(err);
  else {
    files.forEach(file => {
      let newPath = null;
      const oldPath = Path.join(location, file);
      if (file.includes(`${LIDAR}.csv`)) {
        newPath = Path.join(location, LIDAR, file);
      } else if (file.includes(`${BRAKE}.csv`)) {
        newPath = Path.join(location, BRAKE, file);
      } else if (file.includes(`${CAN}.csv`)) {
        newPath = Path.join(location, CAN, file);
      } else if (file.includes(`${LABELLING}.csv`)) {
        newPath = Path.join(location, LABELLING, file);
      } else if (file.includes(`.mat`)) {
        newPath = Path.join(location, `MAT`, file);
      } else if (file.includes(`.asc`)) {
        newPath = Path.join(location, `ASC`, file);
      } else if (file.includes(`.kml`)) {
        newPath = Path.join(location, `KML`, file);
      }

      if (newPath) {
        const newLocation = Path.parse(newPath).dir;
        fs.existsSync(newLocation)
          ? fs.rename(oldPath, newPath, err => err && console.log(err))
          : mkdirp(Path.parse(newPath).dir, (err, made) => {
              !err &&
                fs.rename(oldPath, newPath, err => err && console.log(err));
            });
      }
    });
  }
});

// db.tasks.updateMany(
//   {
//     inputFile: {
//       $in: [
//         "20190825_161500_FCR_SBR_AD2_R0601D62_JARITSUKUBA_JSOIMPREZA_ISS_02_039_L_01.cvw",
//         "20190825_161900_FCR_SBR_AD2_R0601D62_JARITSUKUBA_JSOIMPREZA_ISS_02_039_L_03.cvw",
//         "20190825_161800_FCR_SBR_AD2_R0601D62_JARITSUKUBA_JSOIMPREZA_ISS_02_039_L_02.cvw"
//       ]
//     },
//     requestDate: {
//       $in: [
//         ISODate("2019-10-16T08:42:35.266Z"),
//         ISODate("2019-10-15T06:53:49.391Z")
//       ]
//     },
//   },
//   { $set: { status: { text: "Pending", value: 0 }, assignedWorker: null } }
// );
