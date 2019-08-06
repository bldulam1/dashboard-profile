const router = require("express").Router();
var tasks = new Set();
var allowedTasksLen = 1;
var allowedTasks = [];

function isServerAvailable() {}

router.get("/", async (req, res) => {
  res.send(tasks);
});

router.get("/is-available", async (req, res) => {
  let length = 0;
  for (const _id in tasks) {
    length++;
  }
  res.send(!length);
});

router.post("/max", async (req, res) => {
  allowedTasksLen = req.body.max;
  res.send({ allowedTasksLen });
});

router.post("/execute", async (req, res) => {
  const newTask = req.body;
  tasks.add(newTask);
  res.send([...tasks])
});

router.get("/allowed-tasks", async (req, res) => {
  res.send(allowedTasks);
});

router.post("/update/allowed-tasks", async (req, res) => {
  allowedTasks = req.body;
  res.send(allowedTasks);
});

module.exports = router;
