const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");
const fs = require("fs");
const readdirp = require("readdirp");
const path = require("path");

const UPLOAD_ROOT = path.resolve("V:\\JP01\\DataLake\\Common_Write");

router.get("/is-directory-exist/:dir(*)", async (req, res) => {
  const { dir } = req.params;
  const cleanedDir = path.resolve(dir);
  res.send(fs.existsSync(dir));
});

router.get("/read-dir/:dir(*)", async (req, res) => {
  const { dir } = req.params;
  const cleanedDir = path.resolve(dir);
  let filesCount = 0;
  let totalSize = 0;
  let files = new Set();

  if (cleanedDir === path.resolve(UPLOAD_ROOT)) {
    return res.send({ filesCount, totalSize });
  }
  readdirp(cleanedDir, { alwaysStat: true, type: "files" })
    .on("data", ({ basename, fullPath, stats: { size } }) => {
      filesCount++;
      totalSize += size;
      const splits = basename.split(".");
      files.add({
        name: basename,
        fullPath,
        size,
        type: splits[splits.length - 1],
        progress: 0,
        comments: []
      });
    })
    .on("warn", error => res.send({ error, filesCount, totalSize }))
    .on("error", error => res.send({ error, filesCount, totalSize }))
    .on("end", () => res.send({ files: [...files] }));
});

module.exports = router;
