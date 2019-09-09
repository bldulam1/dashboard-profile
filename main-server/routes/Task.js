const router = require("express").Router();
const { Scene } = require("../schemas/scene");
const Task = require("../schemas/task");
const { createSimsTasks } = require("./Operations/Operation.SIMS");
const {
  createIDW4ConvTasks
} = require("./Operations/Operation.IDW4Conversion");
const {
  fetchFileInfo,
  alignFileInfo
} = require("./Operations/Operation.ExportList");

const { executeTasks } = require("../utils/taskAssignment");

router.post("/:operation/new", async (req, res) => {
  const { operation } = req.params;
  const files = await Scene.find(
    { _id: { $in: req.body.fileIDs } },
    { fileName: 1, path: 1, size: 1 }
  );
  let tasks = [];
  switch (operation) {
    case "CVW Conversion":
      return res.send("Hello");

    case "Export List":
      const { fileIDs, selectedFileInfo } = req.body;
      const fileInfo = await fetchFileInfo(fileIDs);
      return res.send(await alignFileInfo(fileInfo, selectedFileInfo));

    case "File Splitting":
      return res.send("Hello");

    case "HIL":
      return res.send("Hello");

    case "IDW4 Conversion":
      tasks = await createIDW4ConvTasks(req.body, files);
      executeTasks();
      return res.send(tasks);

    case "SIMS":
      tasks = await createSimsTasks(req.body, files);
      executeTasks();
      return res.send(tasks);

    default:
      break;
  }
});

router.put("/update/:id", async (req, res) => {
  const newData = await Task.findByIdAndUpdate(req.params.id, { ...req.body });
  // console.log(req.body);
  res.send(newData);
});

router.post(
  "/check-extensions/:project/:operation/ext=:extension",
  async (req, res) => {
    const { extension } = req.params;
    const { fileIDs } = req.body;
    const inValidFiles = await Scene.find(
      {
        _id: { $in: fileIDs },
        extension: { $ne: extension }
      },
      { fileName: 1 }
    );
    res.send(inValidFiles);
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

    const count_tasks = await Promise.all([
      Task.countDocuments(query),
      Task.find(query, null, { skip, limit, sort })
    ]);

    res.send({ skip, limit, count: count_tasks[0], tasks: count_tasks[1] });
  }
);

router.get("/:project/get-ids/query=:queryString(*)", async (req, res) => {
  const query = JSON.parse(req.params.queryString);
  const tasks = await Task.find(query, { _id: 1 });
  res.send(tasks.map(({ _id }) => _id));
});

module.exports = router;
