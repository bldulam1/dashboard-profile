const router = require("express").Router();
const Worker = require("../schemas/worker");
const Task = require("../schemas/task");
const { executeTasks } = require("../utils/taskAssignment");

// root: /service-workers

router.get("/stats-on/all", async (req, res) => {
  const workers = await Worker.find({}, null, {
    sort: { active: 1, serverName: 1 }
  });
  res.send(workers);
});

router.get("/stats-on/current-only", async (req, res) => {
  let workers = await Worker.find({}, null, {
    sort: { active: 1, serverName: 1 }
  });
  workers = workers.map(worker => {
    const { _id, serverName, active, taskID, type } = worker;
    const cpu = active ? worker.cpu[worker.cpu.length - 1].currentload : 0;
    const { used, total } = worker.mem[worker.mem.length - 1];
    const { ifaces } = worker.network[worker.network.length - 1];
    const rx_bytes = active
      ? ifaces.reduce((acc, { rx_bytes }) => acc + rx_bytes, 0)
      : 0;
    const tx_bytes = active
      ? ifaces.reduce((acc, { tx_bytes }) => acc + tx_bytes, 0)
      : 0;

    return {
      _id,
      serverName,
      active,
      type,
      cpu,
      mem: active ? (100 * used) / total : 0,
      rx_bytes,
      tx_bytes,
      taskID
    };
  });

  for (let index = 0; index < workers.length; index++) {
    if (workers[index].taskID) {
      const task = await Task.findById(workers[index].taskID, {
        operation: 1
      });
      if (task) {
        workers[index].taskID = task.operation;
      }
    }
  }

  res.send(workers);
});

router.get("/stats-off/all", async (req, res) => {
  const workers = await Worker.find({}, { serverName: 1, url: 1, active: 1 });
  res.send(workers);
});

router.put("/update/:id", async (req, res) => {
  Worker.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(worker => res.send(worker))
    .catch(error => res.send(error));
});

router.post("/new", async (req, res) => {
  const { serverName } = req.body;
  const worker = await Worker.findOneAndUpdate(
    { serverName },
    { ...req.body, active: true },
    {
      upsert: true,
      new: true
    }
  );
  res.send(worker);
  executeTasks();
});

module.exports = router;
