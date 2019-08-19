let mongoose = require("mongoose");

let workerSchema = mongoose.Schema({
  hostname: String,
  port: Number,
  serverName: String,
  url: String,
  allowedTasks: [String],
  active: Boolean,
  tasks: [],
  cpu: [],
  mem: [],
  network: []
});

module.exports = mongoose.model("Worker", workerSchema);
