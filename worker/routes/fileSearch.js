const router = require("express").Router();
const { readdirSync, statSync } = require("fs");
const readdirp = require("readdirp");
const path = require("path");

var block = false;

var BlockingMiddleware = (req, res, next) => {
  if (block === true) return res.sendStatus(503); // 'Service Unavailable'
  next();
};

router.post("/:project/dir/:dir(*)", BlockingMiddleware, async (req, res) => {
  block = true;
  const root = path.resolve(req.body.root);
  const dir = path.resolve(req.params.dir);
  const dir_level = dir.split(/\\|\//).length - root.split(/\\|\//).length;
  const project = req.params.project;
  const files = [];
  const directories = [];

  const options =
    dir_level < 10
      ? { alwaysStat: true, depth: 0, type: "files_directories" }
      : { alwaysStat: true };

  readdirp(dir, options)
    .on("data", entry => {
      const { fullPath, stats } = entry;
      const { size, mtime, birthtime } = stats;
      if (stats.isDirectory()) {
        directories.push(fullPath);
      } else {
        const { base, ext, dir } = path.parse(fullPath);
        files.push({
          project,
          fileName: base,
          extension: ext.replace(".", ""),
          root,
          path: dir,
          size: parseInt(size),
          date: {
            modified: mtime,
            birth: birthtime,
            mapped: new Date()
          }
        });
      }
    })
    .on("warn", error => {
      block = false;
      console.error("non-fatal error", error);
    })
    .on("error", error => {
      block = false;
      console.error("fatal error", error);
    })
    .on("end", () => {
      block = false;
      try {
        res.send({ files, directories, project, root: dir });
      } catch (error) {
        res.send({ error });
      }
    });
});

module.exports = router;
