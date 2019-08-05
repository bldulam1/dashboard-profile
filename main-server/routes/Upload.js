const multer = require("multer");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "tmp");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });
router.post("/:project", upload.array("file", 1), (req, res, next) => {
  const destinationFolder = "V:/JP01/DataLake/Valpro/Clarity";
  const files = req.files;

  console.log(files)
  res.send('hello')


  // if (!files) {
  //   const error = new Error("Please choose files");
  //   error.httpStatusCode = 400;
  //   return next(error);
  // }

  // try {
  //   // perform checks to the file before moving to the ISILON
  //   files
  //     .map(file => file.path)
  //     .forEach(file => {
  //       try {
  //         if (fs.existsSync(file)) {
  //           let newPath = path.join(destinationFolder, req.params.project);
  //           if (!fs.existsSync(newPath)) {
  //             fs.mkdirSync(newPath);
  //           }
  //           newPath = path.join(newPath, path.basename(file));

  //           // perform checks

  //           const fileDetails = {
  //             oldpath: file,
  //             newpath: newPath,
  //             process: child_process.spawn("powershell.exe", [
  //               `Copy-Item "${file}" "${newPath}"`
  //             ])
  //           };

  //           fileDetails.process.on("close", () => {
  //             console.log(`Uploaded Finished: ${fileDetails.oldpath}`);
  //             fs.unlink(fileDetails.oldpath, () => {
  //               console.log(`Removed: ${fileDetails.oldpath}`);
  //             });
  //           });
  //         }
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     });

  //   res.send(files);
  // } catch (error) {
  //   console.error(error);
  // }
});

router.get("/", (req, res) => {
  res.send("hello");
});

module.exports = router;
