let mongoose = require("mongoose");

let workerSchema = mongoose.Schema({
  hostname: String,
  port: Number,
  serverName: String,
  url: String,
  active: Boolean,
  searching: Boolean,
  tasks: [],
  type: String,
  taskID: String,
  activeTask: String,
  cores: Number,
  cpu: [],
  mem: [],
  network: []
});

module.exports = mongoose.model("Worker", workerSchema);
