const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");

router.get("/:project/count", async (req, res) => {
  const count = await Scene.countDocuments({});
  res.send({
    count
  });
});

router.get("/:project/unique/tags", async (req, res) => {
  const { project } = req.params;
  const tagKeys = await Scene.distinct("tags.key", { project });
  const keys = [
    "path",
    "parentFolder",
    "fileName",
    "extension",
    "size",
    "date.modified",
    "date.birth",
    "date.mapped"
  ];
  res.send([...keys, ...tagKeys.map(key => `tags.${key}`)]);
});

router.get("/:project/unique/tag/:key", async (req, res) => {
  const { project, key } = req.params;
  const uniqueKeys = await Scene.distinct(key, { project });
  res.send(uniqueKeys);
});

module.exports = router;
