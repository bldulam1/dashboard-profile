const router = require("express").Router();
const TestCatalog = require("../schemas/test-catalog");

router.get("/:project/:page/:rowsPerPage/:queryString(*)", async (req, res) => {
  const { page, rowsPerPage, queryString } = req.params;
  const skip = page * rowsPerPage;
  const limit = rowsPerPage * 1;

  const query = JSON.parse(queryString);

  const count_tc = await Promise.all([
    TestCatalog.countDocuments(query),
    TestCatalog.find(query, null, { skip, limit })
  ]);

  res.send({ skip, limit, count: count_tc[0], rows: count_tc[1] });
});

// router.get("/:project/count", async (req, res) => {
//   const count = await Scene.countDocuments({});
//   res.send({
//     count
//   });
// });

// router.get("/:project/unique/tags", async (req, res) => {
//   const { project } = req.params;
//   const tagKeys = await Scene.distinct("tags.key", { project });
//   const keys = [
//     "path",
//     "parentFolder",
//     "fileName",
//     "extension",
//     "size",
//     "date.modified",
//     "date.birth",
//     "date.mapped"
//   ];
//   res.send([...keys, ...tagKeys.map(key => `tags.${key}`)]);
// });
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

router.get("/:project/unique/sheetName", async (req, res) => {
  const { project } = req.params;
  const sheetNames = await TestCatalog.distinct("sheetName", { project });
  const features = sheetNames.map(name => name.slice(0, name.indexOf("_")));
  const sortedUniqeFeatures = [...new Set(features)].sort();

  res.send(sortedUniqeFeatures);
});

module.exports = router;
