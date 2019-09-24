const router = require("express").Router();
const Path = require("path");
const xmlReader = require("read-xml");
const convert = require("xml-js");
const fs = require("fs");
const axios = require("axios");
const { Scene } = require("../schemas/scene");

router.get("/parse-kml/1/kml=:kmlFile(*)", async (req, res) => {
  const kmlFile = Path.normalize(req.params.kmlFile);
  let coordinates = [];

  if (fs.existsSync(kmlFile)) {
    xmlReader.readXML(fs.readFileSync(kmlFile), function(err, data) {
      if (err) res.send({ error: "file does not exits", coordinates });

      var xml = data.content;
      var result = JSON.parse(
        convert.xml2json(xml, { compact: true, spaces: 4 })
      );

      try {
        coordinates = result.kml.Document.Placemark.LineString.coordinates._text
          .split("\n")
          .filter(onlyUnique)
          .filter(s => s.length)
          .map(xyz => xyz.split(",").map(point => Number(point)));

        const center = coordinates[Math.ceil(coordinates.length / 2)];
        const distance = coordinates
          .slice(0, coordinates.length - 1)
          .reduce((totalDist, point, index) => {
            return totalDist + getUnitDistance(point, coordinates[index + 1]);
          }, 0);

        const _markers = [
          [139.656482, 35.510685],
          [139.657285, 35.510858],
          [139.657539, 35.510888],
          [139.658134, 35.510848],
          [139.658432, 35.510812],
          [139.658892, 35.510798],
          [139.659748, 35.510841],
          [139.660185, 35.510943],
          [139.660367, 35.510998],
          [139.660593, 35.511062],
          [139.660797, 35.511124],
          [139.66115, 35.511222],
          [139.66165, 35.511367],
          [139.662235, 35.51153],
          [139.662532, 35.51162],
          [139.662703, 35.5116],
          [139.663215, 35.511492],
          [139.663469, 35.511316],
          [139.664047, 35.510698],
          [139.664146, 35.510541],
          [139.664338, 35.510068],
          [139.665711, 35.50984],
          [139.666919, 35.51046],
          [139.667325, 35.51037],
          [139.668256, 35.51016],
          [139.668919, 35.510014],
          [139.66918, 35.509952],
          [139.671485, 35.50882]
        ];

        res.send({ center, coordinates, distance, markers });
      } catch (error) {
        res.send({ error: "invalid format", coordinates });
      }
    });
  } else {
    res.send({ error: "file does not exist" });
  }
});

router.get("/:project/intersections/1/cvw=:cvwFile(*)", async (req, res) => {
  const { cvwFile, project } = req.params;
  const file = await Scene.find(
    {
      project,
      fileName: { $regex: cvwFile },
      extension: "kml"
    },
    { fileName: 1, path: 1 }
  );

  const kmlFile = Path.resolve(file.path, file.fileName);

  res.send(kmlFile);
});

module.exports = router;

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function getUnitDistance(point1, point2) {
  const lat1 = degreesToRadians(point1[0]),
    lat2 = degreesToRadians(point2[0]),
    dLat = degreesToRadians(point2[0] - point1[0]),
    dLon = degreesToRadians(point2[1] - point1[1]),
    a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
