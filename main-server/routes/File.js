const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");
const Worker = require("../schemas/worker");
const { existsSync } = require("fs");
const readdirp = require("readdirp");
const path = require("path");
const Axios = require("axios");
const exploreDirectories = require("../utils/collaborativeSearch");

const UPLOAD_ROOT = path.resolve("V:\\JP01\\DataLake\\Common_Write");

router.get("/is-directory-exist/:dir(*)", async (req, res) => {
  const { dir } = req.params;
  const cleanedDir = path.resolve(dir);
  res.send(existsSync(cleanedDir));
});

router.get("/read-dir/:dir(*)", async (req, res) => {
  const { dir } = req.params;
  const cleanedDir = path.resolve(dir);
  let filesCount = 0;
  let totalSize = 0;
  let files = new Set();

  if (
    cleanedDir === path.resolve(UPLOAD_ROOT) ||
    !cleanedDir.includes(path.resolve(UPLOAD_ROOT))
  ) {
    return res.send({ files: [], totalSize });
  }
  readdirp(cleanedDir, { alwaysStat: true, type: "files" })
    .on("data", ({ basename, fullPath, stats: { size } }) => {
      filesCount++;
      totalSize += parseInt(size);
      const splits = basename.split(".");
      files.add({
        name: basename,
        fullPath,
        size: parseInt(size),
        type: splits[splits.length - 1],
        progress: 0,
        comments: []
      });
    })
    .on("warn", error => res.send({ error, files: [...files] }))
    .on("error", error => res.send({ error, files: [...files] }))
    .on("end", () => res.send({ files: [...files] }));
});

router.get("/map-dir/:project/:dir(*)", async (req, res) => {
  const root = path.resolve(req.params.dir);
  const project = req.params.project;
  let filesCount = 0;
  let elapsedTime = new Date().getTime();
  await SearchFolder.findOneAndUpdate(
    { folder: root },
    { project, root, folder: root },
    { upsert: true, new: true }
  );

  exploreDirectories();

  elapsedTime = new Date().getTime() - elapsedTime;
  res.send({ filesCount, elapsedTime });
});

router.get("/:project/unmapped-dirs", async (req, res) => {
  const { project } = req.params;
  SearchFolder.aggregate([
    { $match: { project } },
    {
      $group: {
        _id: "$root",
        count: { $sum: 1 }
      }
    }
  ]).then(results => {
    if (results.length) {
      let directories = results.map(res => ({
        root: res._id,
        unmappedSubDirs: res.count,
        foundFiles: 0
      }));
      Promise.all(
        directories.map(({ root }) => Scene.countDocuments({ project, root }))
      ).then(values => {
        values.forEach((val, index) => {
          directories[index].foundFiles = val;
          res.send(directories);
        });
      });
    } else {
      res.send([]);
    }
  });
});

router.delete("/del-dir/:project/:dir(*)", async (req, res) => {
  const { dir, project } = req.params;
  const results = await Scene.deleteMany({ project, root: path.resolve(dir) });
  res.send(results);
});

module.exports = router;
