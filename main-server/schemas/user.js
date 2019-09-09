let mongoose = require("mongoose");

let schema = mongoose.Schema({
  name: String,
  email: String,
  online: Boolean,
  projects: [{ name: String, role: String, roleLevel: Number }]
});

module.exports = mongoose.model("Client", schema);
