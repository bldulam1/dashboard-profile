let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

let taskSchema = mongoose.Schema({
  priority: Number,
  operation: String,
  project: String,
  requestedBy: String,
  inputFile: String,
  inputLocation: String,
  size: Number,
  script: String,
  expiryDate: Date,
  requestDate: Date,

  assignedWorker: String,
  processID: Number,
  outputFiles: [String],
  outputLocation: String,
  startTime: Date,
  endTime: Date,
  logs: [{ time: Date, logData: String }],
  progress_log: {
    time: Date,
    step: String,
    status: String,
    percentage: Number
  },
  status: {
    value: Number,
    text: String
  },

  otherParameters: {}
});

taskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Task", taskSchema);
