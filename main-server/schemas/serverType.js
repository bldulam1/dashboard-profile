let mongoose = require("mongoose");

module.exports = mongoose.model(
  "ServerType",
  mongoose.Schema({
    name: String,
    tasks: [{ task: String, priority: Number }]
  })
);
