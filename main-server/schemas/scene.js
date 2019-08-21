const mongoose = require("mongoose");

const sceneSchema = mongoose.Schema({
  project: String,
  path: String,
  root: String,
  fileName: String,
  extension: String,
  size: Number,
  date: {
    modified: Date,
    birth: Date,
    mapped: Date
  },
  tags: []
});

const sfSchema = mongoose.Schema({
  project: String,
  root: String,
  folder: String,
  assignedServer: String
});

module.exports = {
  Scene: mongoose.model("Scene", sceneSchema),
  SearchFolder: mongoose.model("SearchFolder", sfSchema)
};
