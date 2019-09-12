const router = require("express").Router();
const TestCatalog = require("../schemas/test-catalog");
const { createSchedule } = require("./ExcelCreator/DCSchedule");
const fs = require("fs");

router.get("/:project/unique/feature/:feature", async (req, res) => {
  const { project, feature } = req.params;
  let sheetNames = await TestCatalog.distinct("sheetName", {
    project,
    sheetName: { $regex: feature, $options: "i" }
  });
  sheetNames = [...new Set(sheetNames)].sort();
  const instances = await Promise.all(
    sheetNames.map(sheetName =>
      TestCatalog.findOne({ sheetName }, { _id: 0, __v: 0, project: 0 })
    )
  );

  sheetNames = instances.map((instance, index) => ({
    sheetName: sheetNames[index],
    headers: [
      ...new Set(
        Object.keys(instance._doc).filter(header => header !== "sheetName")
      )
    ].sort()
  }));

  res.send(sheetNames);
});

router.get("/:project/labels-description/:labels(*)", async (req, res) => {
  const renaultNissanLabels = require("../testCatalogLabels/renaultNissan");
  const labels = JSON.stringify(req.params.labels);
  let descriptions = [];

  renaultNissanLabels.forEach(
    description =>
      labels.includes(description.parameter) && descriptions.push(description)
  );

  res.send({ labels, descriptions });
});

router.get("/:project/:page/:rowsPerPage/:queryString(*)", async (req, res) => {
  const { project, page, rowsPerPage, queryString } = req.params;
  const skip = page * rowsPerPage;
  const limit = rowsPerPage * 1;

  const query = { $and: [{ project }, JSON.parse(queryString)] };

  const count_tc = await Promise.all([
    TestCatalog.countDocuments(query),
    TestCatalog.find(query, null, { skip, limit }),
    TestCatalog.distinct("sheetName", query)
    // TestCatalog.find(query, null, { skip, limit, sort: {'Record ID': 1} })
  ]);

  res.send({
    skip,
    limit,
    count: count_tc[0],
    rows: count_tc[1],
    subFeatures: count_tc[2]
  });
});

router.get("/:project/unique/sheetName", async (req, res) => {
  const { project } = req.params;
  const sheetNames = await TestCatalog.distinct("sheetName", { project });
  const features = sheetNames.map(name => name.slice(0, name.indexOf("_")));
  const sortedUniqeFeatures = [...new Set(features)].sort();

  res.send({ features: sortedUniqeFeatures });
});

router.post("/:project/create-schedule/", async (req, res) => {
  const outputFile = createSchedule(req.body, req.params.project);
  res.sendFile(outputFile, () => console.log(outputFile));
});

module.exports = router;
