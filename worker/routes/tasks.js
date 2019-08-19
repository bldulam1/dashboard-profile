const router = require("express").Router();
var tasks = new Set();
var allowedTasksLen = 1;
var allowedTasks = [];

var block = false;
var BlockingMiddleware = (req, res, next) => {
  if (block === true) return res.send(503); // 'Service Unavailable'
  next();
};

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

router.post("/execute", BlockingMiddleware, async (req, res) => {
  block = true;
  const newTask = req.body;
  tasks.add(newTask);
  block = false;
  res.send([...tasks]);
});

router.get("/allowed-tasks", async (req, res) => {
  res.send(allowedTasks);
});

router.post("/update/allowed-tasks", async (req, res) => {
  allowedTasks = req.body;
  res.send(allowedTasks);
});

module.exports = router;
