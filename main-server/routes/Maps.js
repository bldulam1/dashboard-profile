const router = require("express").Router();
const Path = require("path");
const xmlReader = require("read-xml");
const convert = require("xml-js");
const fs = require("fs");
const axios = require("axios");
const { Scene } = require("../schemas/scene");
const {
  getIntersectionsData,
  getIntersectionsCoordinates
} = require("../utils/subaruRadarLabel");

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

        res.send({ center, coordinates, distance });
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
  const file = await Scene.findOne(
    {
      $and: [
        {
          project,
          fileName: { $regex: cvwFile },
          extension: "csv"
        },
        { fileName: { $regex: "intersection" } }
      ]
    },
    { fileName: 1, path: 1 }
  );
  const intersectionFile = Path.join(file.path, file.fileName);

  if (fs.existsSync(intersectionFile)) {
    getIntersectionsCoordinates(intersectionFile).then(summary => {
      summary.forEach(intersection => {
        console.log(intersection);
      });

      res.send(summary);
    });
  } else {
    res.send({ error: "file not found" });
  }
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
