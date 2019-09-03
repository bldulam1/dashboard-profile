let mongoose = require("mongoose");

let workerSchema = mongoose.Schema({
  hostname: String,
  port: Number,
  serverName: String,
  url: String,
  allowedTasks: [String],
  active: Boolean,
  searching: Boolean,
  tasks: [],
  type: String,
  taskID: String,
  activeTask: String,
  cpu: [],
  mem: [],
  network: []
});

module.exports = mongoose.model("Worker", workerSchema);
