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
      executeTasks();
      return res.send(tasks);
    default:
      break;
  }
});

router.put("/update/:id", async (req, res) => {
  const newData = await Task.findByIdAndUpdate(req.params.id, { ...req.body });
  console.log(req.body);
  res.send(newData);
});

router.post("/:project/SIMS/check-validity", async (req, res) => {
  const { fileIDs } = req.body;
  const inValidFiles = await Scene.find(
    {
      _id: { $in: fileIDs },
      extension: { $ne: "cvw" }
    },
    { fileName: 1 }
  );
  res.send(inValidFiles);
});

router.get(
  "/:project/skip=:_skip/limit=:_limit/sort=:sortString(*)/query=:queryString(*)",
  async (req, res) => {
    const { _skip, _limit, sortString, queryString } = req.params;
    const skip = _skip * 1;
    const limit = _limit * 1;
    const sort = JSON.parse(sortString);
    const query = JSON.parse(queryString);
    // console.log({ skip, limit, sort, query });

    const count_tasks = await Promise.all([
      Task.countDocuments(query),
      Task.find(query, null, { skip, limit })
    ]);

    res.send({ skip, limit, count: count_tasks[0], tasks: count_tasks[1] });
  }
);

module.exports = router;

async function executeTasks() {
  console.log("Task Scheduling");
  const workers = await Worker.find(
    { taskID: null },
    { url: 1, allowedTasks: 1, serverName: 1 }
  );

  console.log(workers.length);
  for (let index = 0; index < workers.length; index++) {
    const worker = workers[index];
    const task = Boolean(worker)
      ? await Task.findOne(
          {
            assignedWorker: null,
            operation: { $in: worker.allowedTasks }
          },
          { script: 1 },
          { sort: { priority: -1, requestDate: 1 } }
        )
      : null;

    if (worker && !task) {
      // await Worker.findByIdAndUpdate(worker._id, { skipped: true });
    } else if (worker && task) {
      // assign task
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
        console.log("Task Completed");
      });
    }
  }
  console.log("Task Exited");
}
