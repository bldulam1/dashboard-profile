let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
  operation: String,
  executed_by: String,
  input_file: String,
  size: Number,
  input_location: String,
  script: String,
  expiryDate: Date,
  requestDate: Date,
  priority: Number,
  assigned_worker: String,
  process_id: Number,
  output_files: [String],
  output_location: String,
  start_time: Date,
  elapsed_time: Number,
  project: String,
  logs: [{ time: Date, logData: String }],
  progress_log: { time: Date, step: String, status: String, percentage: Number },
  status: {
    value: Number,
    text: String
  }
});

module.exports = mongoose.model('Task', taskSchema);
