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

let projectSchema = mongoose.Schema({
  name: String,
  namingConventions: [
    { name: { type: String, index: { unique: true } }, id: String }
  ],
  operations: [String],
  assigned_servers: [String]
});

module.exports = {
  Project: mongoose.model("Project", projectSchema),
  NamingConvention: mongoose.model("NamingConvention", namingConventionSchema)
};
