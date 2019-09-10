const router = require("express").Router();
const mkdirp = require("mkdirp");
const { spawn } = require("child_process");
const props = require("../config/processArgs");
const Axios = require("axios");
const { serverName, mainHostURL } = props;
const PENDING = "Pending",
  INPROGRESS = "In Progress",
  COMPLETED = "Completed",
  ABORTED = "Aborted";
var tasks = new Map();
var allowedTasksLen = 1;
var allowedTasks = [];

const isServerAvailable = () => {
  let nonCompletedTasks = 0;
  tasks.forEach(task => {
    if (!task.status || !task.status.value || task.status.value < 2) {
      nonCompletedTasks++;
    }
  });
  return nonCompletedTasks < allowedTasksLen;
};
const BlockingMiddleware = (req, res, next) => {
  if (!isServerAvailable()) return res.sendStatus(503); // 'Service Unavailable'
  next();
};

router.get("/", async (req, res) => {
  res.send(Array.from(tasks));
});

router.get("/is-available", async (req, res) => {
  res.send(isServerAvailable());
});

router.post("/max", async (req, res) => {
  allowedTasksLen = req.body.max;
  res.send({ allowedTasksLen });
});

router.post("/execute", BlockingMiddleware, async (req, res) => {
  const { task } = req.body;
  startTask(task).then(child => {
    console.log("start", task._id);
    child.stdout.on("data", buff => handleNewLog(buff, task._id));
    child.stderr.on("data", buff => handleNewLog(buff, task._id));
    child.on("exit", (code, signal) => {
      handleTaskFinish(code, signal, task._id);
      console.log("end", task._id);
      res.send(tasks.get(task._id));
    });
    createNewTask(task, child.pid);
  });
});

router.get("/allowed-tasks", async (req, res) => {
  res.send(allowedTasks);
});

router.post("/update/allowed-tasks", async (req, res) => {
  allowedTasks = req.body;
  res.send(allowedTasks);
});

module.exports = router;

function startTask(task) {
  const { script, outputLocation, operation } = task;
  return new Promise((resolve, reject) => {
    if (["SIMS", "CVW Conversion"].includes(operation)) {
      mkdirp(outputLocation, err => {
        err ? reject(err) : resolve(spawn("powershell.exe", [script]));
      });
    } else {
      resolve(spawn("powershell.exe", [script]));
    }
  });
}

function createNewTask(task, pid) {
  const taskDetails = {
    process_id: pid,
    start_time: new Date(),
    assigned_worker: serverName,
    status: {
      text: INPROGRESS,
      value: 1
    }
  };
  const updates = { ...task, ...taskDetails };

  tasks.set(task._id, updates);
  updateTask(task._id, taskDetails);
}

function updateTask(taskID, updateData) {
  const taskDetails = tasks.get(taskID);
  tasks.set(taskID, { ...taskDetails, ...updateData });

  // Update the main server

  const newTaskURL = `${mainHostURL}/tasks/update/${taskID}`;
  Axios.put(newTaskURL, tasks.get(taskID))
    .then(results => {
      console.log("task updated successfully", results.data);
    })
    .catch(err => console.error(err));
}

function handleNewLog(buff, taskID) {
  const logData = String(buff).trim();
  if (logData.length) {
    const oldLogs = Boolean(tasks.get(taskID) && tasks.get(taskID).logs)
      ? tasks.get(taskID).logs
      : [];
    const logs = [...oldLogs, { time: new Date(), logData }];
    updateTask(taskID, { logs });
  }
}

function handleTaskFinish(code, signal, taskID) {
  const end_time = new Date();
  const status = createStatus(COMPLETED);
  updateTask(taskID, { code, signal, end_time, status });
}

function createStatus(text) {
  const values = [PENDING, INPROGRESS, COMPLETED, ABORTED];
  const value = values.findIndex(v => v === text);
  return { text, value };
}
