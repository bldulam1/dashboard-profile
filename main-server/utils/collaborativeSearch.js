const { Scene, SearchFolder } = require("../schemas/scene");
const Axios = require("axios");
const Worker = require("../schemas/worker");
const { io } = require("../socket");

let block = false;

const removeFolder = async _id => {
  await SearchFolder.findByIdAndDelete(_id);
};

const unPickFolder = async _id => {
  await SearchFolder.findByIdAndUpdate(_id, { assignedServer: null });
};

const getFilesAndDirectories = ({ files, directories, project, root }) => ({
  files,
  directories: directories.map(folder => ({ project, root, folder }))
});

async function exploreDirectories(_root, startTime) {
  if (block) return console.log("search blocked");
  block = true;

  let workers = await Worker.find(
    { active: true, searchID: null },
    { url: 1, serverName: 1 }
  );
  let folders = await SearchFolder.find(
    { assignedServer: null, root: _root },
    null,
    { limit: workers.length }
  );

  const foldersLen = folders.length;

  if (foldersLen) {
    if (workers.length > foldersLen) {
      workers = workers.slice(0, foldersLen);
    }

    await Promise.all([
      ...workers.map((worker, wi) =>
        Worker.findByIdAndUpdate(worker._id, {
          searchID: folders[wi]._id
        })
      ),
      ...folders.map((folder, fi) =>
        SearchFolder.findByIdAndUpdate(folder._id, {
          assignedServer: workers[fi].serverName
        })
      )
    ]);

    block = false;

    workers.forEach((worker, index) => {
      const { project, folder, root } = folders[index];
      const folderID = folders[index]._id;
      const fullUrl = `${worker.url}/fileSearch/${project}`;

      Axios.get(fullUrl, { params: { root, dir: folder } })
        .then(async results => {
          Worker.findByIdAndUpdate(worker._id, { searchID: null }).then(() => {
            exploreDirectories(root, startTime);
            console.log("recurse", folder);
          });

          const { files, directories } = getFilesAndDirectories(results.data);
          if (files.length) {
            Scene.deleteMany({ path: folder }).then(() => {
              Scene.insertMany(files);
            });
            console.log(`found ${files.length} files from ${folder}`);
          }
          if (directories.length) {
            Promise.all(
              directories.map(directory => new SearchFolder(directory).save())
            ).then(() => {});
          }
          removeFolder(folderID).then(() => {});
        })
        .catch(async () => {
          await unPickFolder(folderID);
          Worker.findByIdAndUpdate(worker._id, { searchID: null }).then(() =>
            exploreDirectories(root, startTime)
          );
          console.log("error", folder);
        });
    });
  } else {
    block = false;
    io.emit("search completed", {
      root: _root,
      elapsedTime: Date.now() - startTime
    });
    console.log("search completed", _root);
  }
}

module.exports = exploreDirectories;
