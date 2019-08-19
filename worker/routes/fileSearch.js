const router = require("express").Router();
const { readdirSync, statSync } = require("fs");
const path = require("path");

var block = false;

var BlockingMiddleware = (req, res, next) => {
  if (block === true) return res.send(503); // 'Service Unavailable'
  next();
};

router.get("/dir/:dir(*)", BlockingMiddleware, async (req, res) => {
  block = true;
  const dir = path.resolve(req.params.dir);
  const files = [];
  const directories = [];

  const items = readdirSync(dir);
  items.forEach(item => {
    const file = path.resolve(dir, item);
    try {
      const stat = statSync(file);
      const { size, mtime, birthtime } = stat;
      stat.isDirectory()
        ? directories.push(file)
        : files.push({ file, size, mtime, birthtime });
    } catch (error) {
      // console.error(error);
    }
  });

  block = false;
  res.send({ files, directories });
});

module.exports = router;
