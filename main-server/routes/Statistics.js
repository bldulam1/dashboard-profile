const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");
const Task = require("../schemas/task");
const Client = require("../schemas/user");

async function getUserStatus() {
  return Client.aggregate([
    {
      $group: {
        _id: "$online",
        count: { $sum: 1 }
      }
    }
  ]);
}

async function getFileTypes(project) {
  return Scene.aggregate([
    { $match: { project } },
    {
      $group: {
        _id: "$extension",
        count: { $sum: 1 },
        totalSize: { $sum: "$size" }
      }
    },
    { $sort: { totalSize: -1 } }
  ]);
}

async function getFileDates(project) {
  return Scene.aggregate([
    { $match: { project } },
    {
      $group: {
        _id: {
          year: { $year: "$date.modified" },
          month: { $month: "$date.modified" },
          date: { $dayOfMonth: "$date.modified" }
        },
        totalSize: { $sum: "$size" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
}

async function getTasks(project) {
  return Task.aggregate([
    { $match: { project } },
    { $group: { _id: "$status.text", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
}

router.get("/:project/:user", async (req, res) => {
  const { project, user } = req.params;

  let [activeUsers, fileTypes, fileDates, tasks] = await Promise.all([
    getUserStatus(),
    getFileTypes(project),
    getFileDates(project),
    getTasks(project)
  ]);

  fileDates = fileDates
    .map(fd => [
      new Date(fd._id.year, fd._id.month, fd._id.date).getTime(),
      fd.totalSize
    ])
    .sort((a, b) => a[0] - b[0]);

  var new_array = fileDates.concat();
  for (var i = 1; i < fileDates.length; i++) {
    new_array[i][1] = new_array[i - 1][1] + fileDates[i][1];
  }

  res.send({
    tasks: {
      completed: tasks.filter(t => t._id === "Completed").pop().count,
      total: tasks.reduce((sum, task) => sum + task.count)
    },
    fileTypes,
    activeUsers,
    fileDates
  });
});

module.exports = router;
