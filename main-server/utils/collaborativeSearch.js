const { Scene, SearchFolder } = require("../schemas/scene");
const Axios = require("axios");
const Worker = require("../schemas/worker");
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

async function exploreDirectories() {
  if (block) return console.log("search blocked");
  block = true;

  let workers = await Worker.find(
    { active: true, searchID: null },
    { url: 1, serverName: 1 }
  );
  let folders = await SearchFolder.find({ assignedServer: null }, null, {
    limit: workers.length
  });

  const foldersLen = folders.length;

  if (foldersLen < 1) {
    return console.log("search completed");
  } else if (workers.length < foldersLen) {
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
        assignedServer: [fi].serverName
      })
    )
  ]);

  block = false;

  workers.forEach((worker, index) => {
    const { project, folder, root } = folders[index];
    const folderID = folders[index]._id;
    const fullUrl = `${worker.url}/fileSearch/${project}/dir/${folder}`;

    Axios.post(fullUrl, { root })
      .then(async results => {
        Worker.findByIdAndUpdate(worker._id, { searchID: null }).then(() => {
          exploreDirectories();
          console.log("recurse");
        });

        const { files, directories } = getFilesAndDirectories(results.data);
        if (files.length) {
          Scene.deleteMany({ path: folder }).then(() => {
            Scene.insertMany(files);
          });
          // console.log(`found ${files.length} files from ${folder}`);
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
        Worker.findByIdAndUpdate(worker._id, { searchID: null }).then(
          exploreDirectories
        );
        console.log("error", folder);
      });
  });
}

module.exports = exploreDirectories;
