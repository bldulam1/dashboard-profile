let mongoose = require("mongoose");

let namingConventionSchema = mongoose.Schema(
  {
    name: String,
    project: String,
    extensions: [String],
    separator: String,
    elements: []
  },
  { strict: false }
);

module.exports = mongoose.model("NamingConvention", namingConventionSchema);
