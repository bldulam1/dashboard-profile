let mongoose = require("mongoose");

let schema = mongoose.Schema({
  keyName: String,
  value: String,
  project: String
});

module.exports = mongoose.model("TestCatalogCode", schema);
