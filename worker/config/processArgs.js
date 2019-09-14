const args = process.argv;
const os = require("os");
const cores = os.cpus().length;

let port = 8000;
let hostname = os.hostname().toLowerCase();
let serverName = hostname;
let mainPort = process.env.NODE_ENV === "development" ? 8080 : 80;
let mainHost =
  process.env.NODE_ENV === "development" ? "localhost" : "jp01-clarity01";
let allowedTasks = [];

console.log(process.env.NODE_ENV, mainHost, mainPort);

args.forEach(arg => {
  if (arg.includes("port:")) {
    port = parseInt(arg.replace("port:", ""));
  } else if (arg.includes("mainHost:")) {
    mainHost = arg.replace("mainHost:", "");
  } else if (arg.includes("serverName:")) {
    serverName = arg.replace("serverName:", "");
  }
});

let url = `http://${hostname}:${port}`;
let mainHostURL = `http://${mainHost}:${mainPort}/api`;

module.exports = {
  url,
  allowedTasks,
  port,
  hostname,
  serverName,
  mainPort,
  mainHost,
  mainHostURL,
  cores
};
