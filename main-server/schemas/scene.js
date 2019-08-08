const mongoose = require("mongoose");

const sceneSchema = mongoose.Schema({
  project: String,
  path: String,
  parentFolder: String,
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

module.exports = {
  Scene: mongoose.model("Scene", sceneSchema)
};
