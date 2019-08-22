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
  let block = false;
  const pickFolder = async serverName => {
    if (block) return { block, folder: null };
    block = true;
    const folder = await SearchFolder.findOneAndUpdate(
      { assignedServer: null },
      { assignedServer: serverName }
    );
    // console.log("pick folder", folder);

    block = false;
    return { block, folder };
  };

  const removeFolder = async _id => {
    await SearchFolder.findByIdAndDelete(_id);
  };

  const unPickFolder = async _id => {
    await SearchFolder.findByIdAndUpdate(_id, { assignedServer: null });
  };

  const isFinished = array => {
    for (let index = 0; index < array.length; index++) {
      const workerFlag = array[index];
      if (!workerFlag) return false;
    }
    return true;
  };

  const workers = await Worker.find({ active: true });

  let workersFlags = workers.map(() => false);
  let isLastChild = false;
  console.log(workersFlags);

  do {
    for (let index = 0; index < workers.length; index++) {
      const { serverName, url } = workers[index];
      const pick = await pickFolder(serverName);
      if (pick.folder && pick.folder.folder) {
        const { folder, _id } = pick.folder;
        Axios.get(`${url}/fileSearch/${project}/dir/${folder}`)
          .then(async results => {
            await removeFolder(_id);
            const { files, directories } = getFilesAndDirectories(results.data);
            if (files.length) {
              filesCount += files.length;
              console.log(filesCount, serverName);
            }
            if (directories.length) {
              workersFlags = workers.map(() => false);
              await Promise.all(
                directories.map(directory => new SearchFolder(directory).save())
              );
            } else {
              isLastChild = null === (await SearchFolder.findOne());
            }
          })
          .catch(async () => {
            await unPickFolder(_id);
            workersFlags = workersFlags.map(() => false);
          });
      } else if (isLastChild && !pick.block && !pick.folder) {
        workersFlags[index] = true;
      }
    }
  } while (!isFinished(workersFlags));
  console.log(workersFlags);
  elapsedTime = new Date().getTime() - elapsedTime;
  res.send({ filesCount, elapsedTime });

  // workers.forEach(({ serverName, url }, index) =>
  //   setTimeout(async () => {
  //     console.log('start', serverName)
  //     let pick = { block, folder: {} };
  //     do {
  //       pick = await pickFolder(serverName);
  //       console.log(pick)
  //       if (pick.folder && pick.folder.folder) {
  //         const { folder, _id } = pick.folder;
  //         const results = await Axios.get(
  //           `${url}/fileSearch/${project}/dir/${folder}`
  //         ).catch(() => unPickFolder(_id));

  //         if (results.data) await removeFolder(_id);
  //         const { files, directories } = getFilesAndDirectories(results.data);
  //         if (directories.length) {
  //           filesCount += files.length;
  //           // console.log(filesCount, serverName);
  //           await Promise.all(
  //             directories.map(directory => new SearchFolder(directory).save())
  //           );
  //         }
  //       } else if (!pick.block && !pick.folder) {
  //         console.log(finished, serverName);
  //         finished = true;
  //         elapsedTime = new Date().getTime() - elapsedTime;
  //         res.send({ filesCount, elapsedTime });
  //       }
  //     } while (pick.block || !finished);
  //     console.log("exit", serverName);
  //   }, index * 5)
  // );

  // while (true) {
  //   let [searchFolders, workers] = await Promise.all([
  //     SearchFolder.find({ assignedServer: null }),
  //     Worker.find({ active: true })
  //   ]);

  //   const minimumLength =
  //     searchFolders.length < workers.length
  //       ? searchFolders.length
  //       : workers.length;

  //   if (!minimumLength) break;

  //   searchFolders = searchFolders.slice(0, minimumLength);
  //   workers = workers.slice(0, minimumLength);

  //   let values = await Promise.all([
  //     ...searchFolders.map(({ folder, project }, index) =>
  //       Axios.get(`${workers[index].url}/fileSearch/${project}/dir/${folder}`)
  //     ),
  //     ...searchFolders.map(({ _id }, index) =>
  //       SearchFolder.findByIdAndUpdate(_id, {
  //         assignedServer: workers[index].serverName
  //       })
  //     )
  //   ]);
  //   values = values.slice(0, values.length / 2);

  //   let results = getFilesAndDirectories(values.map(v => v.data));
  //   filesCount += results.files.length;

  //   await Promise.all([
  //     ...searchFolders.map(sf => sf.remove()),
  //     ...results.directories.map(directory =>
  //       new SearchFolder(directory).save()
  //     )
  //   ]);
  // }
});

module.exports = router;
function getFilesAndDirectories({ files, directories, project, root }) {
  return {
    files,
    directories: directories.map(folder => ({ project, root, folder }))
  };
}
