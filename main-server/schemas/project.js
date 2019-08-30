let mongoose = require("mongoose");

let schema = mongoose.Schema({
  name: String,
  namingConventions: [
    { name: { type: String, index: { unique: true } }, id: String }
  ],
  operations: [String]
});

module.exports = mongoose.model("Project", schema);
