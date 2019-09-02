let mongoose = require("mongoose");

module.exports = mongoose.model(
  "Tag",
  mongoose.Schema({
    fileName: String,
    path: String,
    project: String,
    key: String,
    value: {}
  })
);
