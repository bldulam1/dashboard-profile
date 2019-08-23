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

router.get("/:project/unique/roots", async (req, res) => {
  const { project } = req.params;
  Scene.aggregate([
    { $match: { project } },
    {
      $group: {
        _id: "$root",
        totalSize: { $sum: "$size" },
        count: { $sum: 1 },
        date: { $max: "$date.mapped" }
      }
    }
  ])
    .then(values => res.send(values))
    .catch(() => res.send([]));
});

router.get("/:project/unique/tag/:key", async (req, res) => {
  const { project, key } = req.params;
  const uniqueKeys = await Scene.distinct(key, { project });
  res.send(uniqueKeys);
});

router.get("/:project/:_skip/:_limit/:queryString(*)", async (req, res) => {
  const { project, _skip, _limit, queryString } = req.params;
  const skip = _skip * 1;
  const limit = _limit * 1;

  const query = JSON.parse(queryString);

  const count_scenes = await Promise.all([
    Scene.countDocuments(query),
    Scene.find(query, null, { skip, limit })
  ]);

  res.send({ skip, limit, count: count_scenes[0], scenes: count_scenes[1] });
});

module.exports = router;
