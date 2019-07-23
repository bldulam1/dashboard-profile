const router = require("express").Router();
const json2csv = require("json2csv").parse;
const Task = require("../schemas/task");
router.get(
  "/status/multiquery/:project/:executed_by/:operation",
  async (req, res) => {
    const { project, executed_by, operation } = req.params;
    let tasks, returnValue;
    if (project === "Subaru 77GHz") {
      tasks = await Task.find(
        { project, executed_by, operation },
        { requestDate: 1, output_location: 1, input_file: 1, "status.text": 1 }
      );


      // var fields = ["input_file", "output_location", "status", "dat", "idw4"];
      // var fieldNames = [
      //   "Input File",
      //   "Output Location",
      //   "Status",
      //   "DAT File",
      //   "IDW4 File"
      // ];
      res.send(tasks)

      // res.attachment("filename.csv");
    } else {
      res.send("undefined");
    }
  }
);

module.exports = router;

// requestDate
// output_location
// input_file
// dat
// idw4
// status
