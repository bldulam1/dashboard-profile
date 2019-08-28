let mongoose = require('mongoose');


let taskSchema = mongoose.Schema({
  operation: String,
  project: String,
  requestedBy: String,
  inputFile: String,
  inputLocation: String,
  size: Number,
  script: String,
  expiryDate: Date,
  requestDate: Date,
  priority: Number,
  assignedWorker: String,
  processID: Number,
  outputFiles: [String],
  outputLocation: String,
  startTime: Date,
  endTime: Date,
  logs: [{ time: Date, logData: String }],
  progress_log: { time: Date, step: String, status: String, percentage: Number },
  status: {
    value: Number,
    text: String
  }
});

module.exports = mongoose.model('Task', taskSchema);
