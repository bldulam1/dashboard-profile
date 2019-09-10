/**
 * Pseudo code
 *
 * 1.0 Fetch Available workers
 * 2.0 Iterate each worker
 * 2.1 Determine worker's allowed tasks, distribution of tasks for the worker's group/server type
 * 2.2 Calculate Distribution Error, highest error = highest priority
 * 2.3 Get a task based from highest priority operation type
 * 3 If task is available,
 * 3.1 update task and worker
 * 3.2 Send task to worker
 * 4.0 recurse until workers/tasks are empty
 */

const Worker = require("../schemas/worker");
const ServerType = require("../schemas/serverType");
const Axios = require("axios");
const Task = require("../schemas/task");

// +++++++++++++++++++++++++ Helper Functions

async function getWorkers() {
  return Worker.find(
    { taskID: null, active: true },
    { url: 1, type: 1, serverName: 1 }
  );
}

async function getAllowedTasks(type) {
  const serverType = await ServerType.findOne({ name: type });
  let allowedTasks = serverType.tasks;
  return allowedTasks
    .sort((a, b) => b.priority - a.priority)
    .filter(at => at.priority > 0);
}

async function getTaskDistribution(type) {
  return await Promise.all([
    getAllowedTasks(type),
    Worker.countDocuments({ type }),
    Worker.aggregate([
      { $match: { activeTask: { $ne: null } } },
      { $group: { _id: "$activeTask", count: { $sum: 1 } } }
    ])
  ]);
}

async function getTaskDistributionError(
  allowedTasks,
  workerTypeCount,
  taskTypeCount
) {
  return allowedTasks
    .map(({ task, priority }) => {
      let distribution = taskTypeCount.filter(tc => tc._id === task);
      distribution = distribution.length
        ? (100 * distribution[0].count) / workerTypeCount
        : 0;
      return { task, error: priority - distribution };
    })
    .sort((a, b) => b.error - a.error);
}

async function getTask(distributionError) {
  for (let opIndex = 0; opIndex < distributionError.length; opIndex++) {
    const operation = distributionError[opIndex].task;
    task = await Task.findOne(
      {
        assignedWorker: null,
        operation
      },
      { script: 1, operation: 1, outputLocation: 1 },
      { sort: { priority: -1, requestDate: 1, size: 1 } }
    );

    if (task) return task;
  }
  return null;
}

async function updateTask_Worker(taskID, operation, workerID, assignedWorker) {
  return Promise.all([
    Worker.findByIdAndUpdate(workerID, { taskID, activeTask: operation }),
    Task.findByIdAndUpdate(taskID, { assignedWorker })
  ]);
}
// ---------------------- Helper Functions

// ++++++++++++++++++++++ Main Function
let block = false;
async function executeTasks() {
  if (block) return console.log("blocked");
  block = true;

  const workers = await getWorkers();

  for (let index = 0; index < workers.length; index++) {
    const worker = workers[index];

    // Get current task Distribution
    const [
      allowedTasks,
      workerTypeCount,
      taskTypeCount
    ] = await getTaskDistribution(worker.type);

    // Get task distribution Error
    const distributionError = await getTaskDistributionError(
      allowedTasks,
      workerTypeCount,
      taskTypeCount
    );

    // Find Task from highest priority
    const task = await getTask(distributionError);

    if (worker && task) {
      await updateTask_Worker(
        task._id,
        task.operation,
        worker._id,
        worker.serverName
      );

      Axios.post(`${worker.url}/tasks/execute`, { task }).then(() => {
        Worker.findByIdAndUpdate(worker._id, {
          taskID: null
        }).then(executeTasks);
      });
    }
  }
  block = false;
}
// ----------------------- Main Function

module.exports = {
  executeTasks
};
