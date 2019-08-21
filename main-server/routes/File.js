const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");
const Worker = require("../schemas/worker");
const { readdirSync, existsSync, statSync } = require("fs");
const readdirp = require("readdirp");
const path = require("path");
const Axios = require("axios");

const UPLOAD_ROOT = path.resolve("V:\\JP01\\DataLake\\Common_Write");

router.get("/is-directory-exist/:dir(*)", async (req, res) => {
  const { dir } = req.params;
  const cleanedDir = path.resolve(dir);
  res.send(existsSync(dir));
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
  while (true) {
    let [searchFolders, workers] = await Promise.all([
      SearchFolder.find({ assignedServer: null }),
      Worker.find({ active: true })
    ]);

    const minimumLength =
      searchFolders.length < workers.length
        ? searchFolders.length
        : workers.length;

    if (!minimumLength) break;

    searchFolders = searchFolders.slice(0, minimumLength);
    workers = workers.slice(0, minimumLength);

    let values = await Promise.all([
      ...searchFolders.map(({ folder, project }, index) =>
        Axios.get(`${workers[index].url}/fileSearch/${project}/dir/${folder}`)
      ),
      ...searchFolders.map(({ _id }, index) =>
        SearchFolder.findByIdAndUpdate(_id, {
          assignedServer: workers[index].serverName
        })
      )
    ]);
    values = values.slice(0, values.length / 2);

    let results = getFilesAndDirectories(values.map(v => v.data));
    filesCount += results.files.length;

    await Promise.all([
      ...searchFolders.map(sf => sf.remove()),
      ...results.directories.map(directory =>
        new SearchFolder(directory).save()
      )
    ]);
  }

  
  elapsedTime = new Date().getTime() - elapsedTime;

  res.send({ filesCount, elapsedTime });
});

module.exports = router;
function getFilesAndDirectories(queries) {
  return queries.reduce(
    (acc, { files, directories, project, root }) => {
      const mappedDirs = directories.map(folder => ({ project, root, folder }));
      return {
        files: [...acc.files, ...files],
        directories: [...acc.directories, ...mappedDirs]
      };
    },
    {
      files: [],
      directories: []
    }
  );
}

async function saveFilesDirectories(queries) {
  // console.log(queries)
  // directories.forEach(
  //   async ({ project, root, folder }) =>
  //     await SearchFolder.findOneAndUpdate(
  //       { project, root, folder },
  //       {
  //         project,
  //         root,
  //         folder,
  //         date: {
  //           completed: new Date()
  //         }
  //       },
  //       { upsert: true, new: true }
  //     )
  // );
  // files.forEach(({ fileName, extension, path, size, date, project }) =>
  //   Scene.findOneAndUpdate(
  //     { fileName, extension, path, project },
  //     {
  //       fileName,
  //       root,
  //       extension,
  //       path,
  //       size,
  //       date,
  //       project
  //     },
  //     { upsert: true, new: true }
  //   ).then(() => {})
  // );
  // return Promise.all([
  //   Promise.all(
  //     directories.map(({ project, root, folder }) =>
  //       SearchFolder.findOneAndUpdate(
  //         { project, root, folder },
  //         { project, root, folder },
  //         { upsert: true, new: true }
  //       )
  //     )
  //   ),
  //   Promise.all(
  //     files.map(({ fileName, extension, path, size, date, project }) =>
  //       Scene.findOneAndUpdate(
  //         { fileName, extension, path, project },
  //         {
  //           fileName,
  //           root,
  //           extension,
  //           path,
  //           size,
  //           date,
  //           project
  //         },
  //         { upsert: true, new: true }
  //       )
  //     )
  //   )
  // ]);
}
