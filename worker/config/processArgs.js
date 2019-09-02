const args = process.argv;
const os = require("os");

let port = 8001;
let hostname = os.hostname().toLowerCase();
// let hostname = "localhost";
let serverName = hostname;
let mainPort = 8000;
let mainHost = "jp01-clarity01";
let allowedTasks = [];

const serverTypes = {
  subaru_svs: ["IDW4 Conversion", "File Splitting"],
  hil: ["HIL", "SIMS", "CVW2MAT"],
  generic: ["SIMS", "CVW2MAT"]
};

args.forEach(arg => {
  if (arg.includes("port:")) {
    port = parseInt(arg.replace("port:", ""));
  } else if (arg.includes("mainPort:")) {
    mainPort = parseInt(arg.replace("mainPort:", ""));
  } else if (arg.includes("mainHost:")) {
    mainHost = arg.replace("mainHost:", "");
  } else if (arg.includes("serverName:")) {
    serverName = arg.replace("serverName:", "");
  } else if (arg.includes("https")) {
    url = url.replace("http:", "https:");
  } else if (arg.includes("allowedTasks:")) {
    allowedTasks = arg.replace("allowedTasks:", "").split(",");
  }
});

let url = `http://${hostname}:${port}`;
let mainHostURL = `https://${mainHost}:${mainPort}`;

module.exports = {
  url,
  allowedTasks,
  port,
  hostname,
  serverName,
  mainPort,
  mainHost,
  mainHostURL
};
