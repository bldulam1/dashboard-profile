const router = require("express").Router();
const { Scene } = require("../schemas/scene");
const Path = require("path");
const Task = require("../schemas/task");
const Tag = require("../schemas/tag");

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

router.get("/:project/unique/key=:key", async (req, res) => {
  const { project, key } = req.params;
  Scene.distinct(key, { project })
    .then(results => res.send(results.sort()))
    .catch(() => res.send([]));
});

router.get("/:project/unique/tag/:key", async (req, res) => {
  const { project, key } = req.params;
  const uniqueKeys = await Scene.distinct(key, { project });
  res.send(uniqueKeys);
});

router.post("/:project/ids-only", async (req, res) => {
  const { sort, query } = req.body;
  let ids = await Scene.find(query, { _id: 1 }, { sort });
  res.send(ids.map(s => s._id));
});

router.get(
  "/:project/get-ops/file=:inputFile/path=:inputLocation(*)",
  async (req, res) => {
    const { inputFile, project } = req.params;
    const inputLocation = Path.resolve(req.params.inputLocation);
    const [operations, tags] = await Promise.all([
      Task.find(
        {
          inputFile,
          inputLocation,
          project
        },
        {
          status: 1,
          operation: 1,
          requestedBy: 1,
          assignedWorker: 1,
          requestDate: 1
        }
      ),
      Tag.find(
        {
          fileName: inputFile,
          path: inputLocation,
          project
        },
        { key: 1, value: 1 }
      )
    ]);

    res.send({ operations, tags });
  }
);

router.get(
  "/:project/skip=:_skip/limit=:_limit/sort=:sortString(*)/query=:queryString(*)",
  async (req, res) => {
    const { _skip, _limit, sortString, queryString } = req.params;
    const skip = _skip * 1;
    const limit = _limit * 1;
    const sort = JSON.parse(sortString);
    const query = JSON.parse(queryString);
    // console.log({ skip, limit, sort, query });
    // console.log(queryString);

    const count_scenes = await Promise.all([
      Scene.countDocuments(query),
      Scene.find(query, null, { skip, limit, sort })
    ]);

    res.send({ skip, limit, count: count_scenes[0], scenes: count_scenes[1] });
  }
);

router.post("/:project/fetch-scenes", async (req, res) => {
  const { skip, limit, sort, query } = req.body;

  const count_scenes = await Promise.all([
    Scene.countDocuments(query),
    Scene.find(query, null, { skip, limit, sort })
  ]);

  res.send({ skip, limit, count: count_scenes[0], scenes: count_scenes[1] });
});

module.exports = router;
