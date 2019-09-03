const router = require("express").Router();
const { Scene } = require("../schemas/scene");
const Task = require("../schemas/task");
const { createSimsTasks } = require("./SIMS/Task.SIMS");
const Worker = require("../schemas/worker");
const Axios = require("axios");

router.post("/:operation/new", async (req, res) => {
  const { operation } = req.params;
  const files = await Scene.find(
    { _id: { $in: req.body.fileIDs } },
    { operations: 1, fileName: 1, path: 1, size: 1 }
  );
  switch (operation) {
    case "SIMS":
      const tasks = await createSimsTasks(req.body, files);
      // const
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

async function executeTasks() {
  const workers = await Worker.find(
    { taskID: null, active: true },
    { url: 1, allowedTasks: 1, serverName: 1 }
  );

  for (let index = 0; index < workers.length; index++) {
    const worker = workers[index];
    const task = await Task.findOne(
      {
        assignedWorker: null,
        operation: { $in: worker.allowedTasks }
      },
      { script: 1 },
      { sort: { priority: -1, requestDate: 1 } }
    );

    if (worker && task) {
      await Promise.all([
        Worker.findByIdAndUpdate(worker._id, {
          taskID: task._id
        }),
        Task.findByIdAndUpdate(task._id, {
          assignedWorker: worker.serverName
        })
      ]);

      Axios.post(`${worker.url}/tasks/execute`, { task }).then(() => {
        Worker.findByIdAndUpdate(worker._id, {
          taskID: null
        }).then(executeTasks);
      });
    }
  }
}
