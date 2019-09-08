let mongoose = require("mongoose");

let schema = mongoose.Schema({
  name: String,
  operations: [String],
});

module.exports = mongoose.model("Project", schema);
