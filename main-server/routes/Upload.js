const multer = require("multer");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const { Scene } = require("../schemas/scene");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "tmp");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });
router.post("/v-drive", async (req, res) => {
  const {} = req.body;
});

router.post("/:project", upload.array("file", 1), async (req, res, next) => {
  const destinationFolder =
    "V:/JP01/DataLake/Common_Write/CLARITY_OUTPUT_FILES/Recycle Bin";
  const file = req.files[0];
  const { storageLocation, tags, preUploadOperations } = req.body;

  if (!file) {
    const error = new Error("File Sent with error");
    error.httpStatusCode = 400;
    return next(error);
  } else {
    if (fs.existsSync(file.path)) {
      let newPath = path.join(destinationFolder, req.params.project);
      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath);
      }
      newPath = path.join(newPath, path.basename(file.path));

      // perform checks
      let ampCheckResults;
      if (preUploadOperations.includes("ampCheck")) {
        const filepath = path.resolve(file.path);
        ampCheckResults = await ampCheck(filepath);
      }

      const fileDetails = {
        oldpath: file.path,
        newpath: newPath,
        process: child_process.spawn("powershell.exe", [
          `Copy-Item "${file.path}" "${newPath}"`
        ])
      };

      fileDetails.process.on("close", async () => {
        console.log(`Uploaded Finished: ${fileDetails.oldpath}`);
        fs.unlink(fileDetails.oldpath, () => {
          console.log(`Removed: ${fileDetails.oldpath}`);
        });
        const stat = fs.statSync(fileDetails.newpath);
        const { base, ext } = path.parse(fileDetails.newpath);
        const newScene = new Scene({
          project: req.params.project,
          path: fileDetails.newpath,
          fileName: base,
          extension: ext.replace(".", ""),
          size: stat.size,
          date: {
            modified: stat.mtime,
            birth: stat.birthtime,
            mapped: new Date()
          },
          tags: [
            {
              key: "ampCheck",
              values: [
                { allFrames: ampCheckResults.allFrames },
                { badFrames: ampCheckResults.badFrames },
                { goodFramePercentage: ampCheckResults.goodFramePercentage }
              ]
            }
          ]
        });
        await newScene.save();
        console.log(newScene.fileName, "saved", newScene.tags, tags);
      });
    }
    res.send("Completed");
  }
});

router.get("/", (req, res) => {
  res.send("hello");
});

module.exports = router;

// Set-Location "V:/JP01/DataLake/Common_Write/ClarityResources/Ampcheck/Danview/release"; & ./AmpCheck.exe -i "C:/Users/brendon.dulam/Desktop/Workspace/clarity2.0/main-server/tmp/12345678_123456_4CR_NISSAN_R0200B00_JPR030_JSOXTRAIL01_BLCK_01_123_R_01.cvw" -v CB;
function ampCheck(fullFile) {
  return new Promise((resolve, reject) => {
    const THRESHOLD = 99;
    const MIN_FRAME = 500;
    const AmpCheck_Folder =
      "V:/JP01/DataLake/Common_Write/ClarityResources/Ampcheck/Danview/release";
    const script = `Set-Location "${AmpCheck_Folder}"; & ./AmpCheck.exe -i "${fullFile}" -v CB;`;
    const process = {
      cp: child_process.spawn("powershell.exe", [script]),
      file: fullFile,
      passed: false
    };

    process.cp.stdout.on("data", data => {
      let results = String(data);

      if (!results.includes("Check progress: 100.0%")) {
        return;
      }
      results = results.split("Check progress: 100.0% ");
      results = results[1].split(" ");

      var badFrames = Number(results[1].replace("bad=", ""));
      var allFrames = Number(results[0].replace("all=", ""));

      const goodFramePercentage = (100 * (allFrames - badFrames)) / allFrames;
      const isGoodFramesPass = goodFramePercentage >= THRESHOLD;
      const isAboveMinimumFrame = allFrames >= MIN_FRAME;
      process.passed = isGoodFramesPass && isAboveMinimumFrame;

      resolve({
        allFrames,
        badFrames,
        goodFramePercentage
      });
    });
  });
}
