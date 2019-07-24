let mongoose = require("mongoose");

let schema = mongoose.Schema(
  {
    Serie: String,
    Pattern: String,
    "Record ID": String,
    project: String
  },
  { strict: false }
);

module.exports = mongoose.model("TestCatalog", schema);
