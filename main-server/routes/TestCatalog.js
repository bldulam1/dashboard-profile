const router = require("express").Router();
const TestCatalog = require("../schemas/test-catalog");
const { createSchedule } = require("./ExcelCreator/DCSchedule");
const fs = require("fs");
const Path = require("path");
const xlsx = require("xlsx");

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

  const [count, rows, subFeatures] = await Promise.all([
    TestCatalog.countDocuments(query),
    TestCatalog.find(query, null, { skip, limit }),
    TestCatalog.distinct("sheetName", query)
  ]);

  res.send({
    skip,
    limit,
    count,
    rows,
    subFeatures
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
  const outputFile = await createSchedule(req.body, req.params.project);
  setTimeout(() => {
    res.sendFile(outputFile, () =>
      setTimeout(() => {
        fs.unlinkSync(outputFile);
      }, 1000)
    );
  }, 1000);
});

router.get("/:project/workbooks", async (req, res) => {
  const wbPath = Path.resolve("./tmp/TestCatalog/", req.params.project);
  res.send(fs.readdirSync(wbPath));
});

router.get("/:project/workbook=:workbook/sheets", async (req, res) => {
  const { project, workbook } = req.params;
  let wbPath = Path.resolve("./tmp/TestCatalog/", project, workbook);

  const wb = xlsx.readFile(wbPath);
  const sheets = wb.SheetNames;

  res.send(sheets);
});

router.get("/:project/workbook=:workbook/sheet=:sheet", async (req, res) => {
  const { project, workbook, sheet } = req.params;
  let wbPath = Path.resolve("./tmp/TestCatalog/", project, workbook);

  const wb = xlsx.readFile(wbPath);
  const sheets = wb.SheetNames;

  res.send(sheets);
});


module.exports = router;
