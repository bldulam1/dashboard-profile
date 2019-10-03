const router = require("express").Router();
const TestCatalog = require("../schemas/test-catalog");
const TestCatalogCode = require("../schemas/test-catalog.dictionary");
const { createSchedule } = require("./ExcelCreator/DCSchedule");
const fs = require("fs");
const Path = require("path");
const xlsx = require("xlsx");
const multer = require("multer");

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

  let subFeaturesMeaning = await Promise.all(
    subFeatures.map(keyName =>
      TestCatalogCode.findOne({ project, keyName }, { value: 1, _id: 0 })
    )
  );

  subFeaturesMeaning = subFeaturesMeaning.map(sfm => sfm && sfm.value);

  res.send({
    skip,
    limit,
    count,
    rows,
    subFeatures,
    subFeaturesMeaning
  });
});

router.get("/:project/unique/sheetName", async (req, res) => {
  const { project } = req.params;
  const sheetNames = await TestCatalog.distinct("sheetName", { project });
  const features = sheetNames.map(name => name.slice(0, name.indexOf("_")));
  const sortedUniqeFeatures = [...new Set(features)].sort();

  const featuresMeaning = await Promise.all(
    sortedUniqeFeatures.map(keyName =>
      TestCatalogCode.findOne({ project, keyName }, { _id: 0, value: 1 })
    )
  );
  res.send({
    features: sortedUniqeFeatures,
    featuresMeaning: featuresMeaning.map(fm => fm && fm.value)
  });
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
  const sheets = wb.SheetNames.filter(s => s.includes("_"));

  res.send(sheets);
});

router.get(
  "/:project/workbook=:workbook/sheet=:sheetName",
  async (req, res) => {
    const { project, workbook, sheetName } = req.params;
    let wbPath = Path.resolve("./tmp/TestCatalog/", project, workbook);

    const wb = xlsx.readFile(wbPath);
    const sheetNames = wb.SheetNames;
    const stats = { inserted: 0, deleted: 0 };
    for (const sheetName of sheetNames) {
      if (
        /update/gi.test(sheetName) ||
        /reference/gi.test(sheetName) ||
        /front_page/gi.test(sheetName) ||
        /description/gi.test(sheetName) ||
        /tab/gi.test(sheetName) ||
        /sp_image/gi.test(sheetName)
      ) {
        continue;
      }

      const ws = wb.Sheets[sheetName];
      const [newValues, oldValues] = await Promise.all([
        getSheetContents(ws, project, sheetName),
        TestCatalog.deleteMany({ project, sheetName })
      ]).catch(console.error);
      await TestCatalog.insertMany(newValues);
      stats.inserted += newValues.length;
      stats.deleted += oldValues.deletedCount;
    }

    res.send(stats);
  }
);

var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "tmp/TestCatalog");
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});
router.post("/:project/update", upload.array("files", 50), async (req, res) => {
  let tcPath = Path.resolve("./tmp/TestCatalog/");

  let files = fs.readdirSync(tcPath);
  res.send(files);
  files = files.map(file => Path.resolve(tcPath, file));
  const { project } = req.params;

  for (let index = 0; index < files.length; index++) {
    const wbPath = files[index];
    const wb = xlsx.readFile(wbPath);
    const sheetNames = wb.SheetNames;
    const stats = { inserted: 0, deleted: 0 };
    for (const sheetName of sheetNames) {
      if (!sheetName.includes("_") || sheetName.includes("FRONT_")) {
        continue;
      }

      const ws = wb.Sheets[sheetName];

      let newValues = null,
        oldValues = null;
      newValues = await getSheetContents(ws, project, sheetName);
      if (newValues) {
        oldValues = await TestCatalog.deleteMany({ project, sheetName });
        await TestCatalog.insertMany(newValues);
        stats.inserted += newValues.length;
        stats.deleted += oldValues.deletedCount;
      }
    }
    fs.unlinkSync(wbPath);
    console.log(wbPath);
    console.log(stats);
  }
});

router.get("/:project/test-catalog-codes/:codes(*)", async (req, res) => {
  const { project } = req.params;
  const keyNames = JSON.parse(req.params.codes);
  const values = await Promise.all(
    keyNames.map(keyName => {
      return TestCatalogCode.findOne(
        { project, keyName },
        { _id: 0, value: 1 }
      );
    })
  );

  res.send({ keyNames, values: values.map(val => val.value) });
});

module.exports = router;

function getSheetContents(ws, project, sheetName) {
  return new Promise((resolve, reject) => {
    const HEADER_ROW = 2;
    const SUBHEADER_ROW = 3;
    const DATA_START_ROW = 4;

    let rowContents = {};

    const cell = (row, col) => {
      rowValue = ws[`${col}${row}`] && ws[`${col}${row}`].v;
      return rowValue;
    };

    const getKey = col => {
      const headerName = cell(HEADER_ROW, col);
      const subHeaderName = cell(SUBHEADER_ROW, col);
      let keyName = headerName ? headerName : subHeaderName;
      keyName = keyName ? keyName.replace(/(\n)|(#)/g, "") : `${col}2`;
      return keyName;
    };

    const values = [];

    for (const cellName in ws) {
      const row = parseInt(cellName.match(/\d+$/));
      const col = cellName.replace(/[0-9]/g, "");

      if (cellName[0] == "!") {
        continue;
      } else if (row === 1) {
        let [feature, num] = sheetName.split("_");
        let [featureMeaning, subFeature] = cell(row, col).split(num);
        featureMeaning = featureMeaning
          .replace(/\[|\]|^[ ]+|[ ]+$|\n/g, "")
          .replace(new RegExp(feature, "i"), "");
        let subFeatureMeaning =
          subFeature && subFeature.replace(num, "").replace(":", "").replace(/^[ ]+|[ ]+$|\n/g, "");
        subFeature = sheetName;
        if (!(feature && featureMeaning && subFeature && subFeatureMeaning)) {
          continue;
        }
        console.log({ feature, featureMeaning, subFeature, subFeatureMeaning });

        if (!subFeatureMeaning && subFeature.includes(sheetName)) {
          subFeatureMeaning = subFeature;
          subFeature = sheetName;
        }

        if (feature && featureMeaning && subFeature && subFeatureMeaning) {
          Promise.all([
            TestCatalogCode.findOneAndUpdate(
              { project, keyName: feature },
              { project, keyName: feature, value: featureMeaning },
              { upsert: true, new: true }
            ),
            TestCatalogCode.findOneAndUpdate(
              { project, keyName: subFeature },
              { project, keyName: subFeature, value: subFeatureMeaning },
              { upsert: true, new: true }
            )
          ]).then(() => {
            console.log("Success", sheetName);
          });
        } else {
          console.log("Format Error", {
            subFeature,
            sheetName,
            subFeature,
            subFeatureMeaning
          });
        }
      } else if (row === SUBHEADER_ROW) {
        let keyName = cell(HEADER_ROW, col);
        const value = cell(SUBHEADER_ROW, col).replace(/(\n)|(#)/g, "");
        if (!keyName) {
          keyName = value;
        } else {
          keyName = keyName.replace(/(\n)|(#)/g, "");
        }

        TestCatalogCode.findOneAndUpdate(
          { keyName, project },
          { keyName, value, project },
          { upsert: true, new: true }
        ).then(() => {});
      } else if (row >= DATA_START_ROW) {
        if (col === "A" && Object.keys(rowContents).length > 2) {
          values.push({ ...rowContents, project, sheetName });
          rowContents = {};
        }
        const keyName = getKey(col);
        let rowValue = cell(row, col);
        const isString = "string" === typeof rowValue;

        if (isString) {
          const floatValue = parseFloat(rowValue);
          if (floatValue) rowValue = floatValue;
        }

        rowContents[keyName] = rowValue;
      }
    }
    resolve(values);
  });
}
