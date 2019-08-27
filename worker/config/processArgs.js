const args = process.argv;
const os = require("os");

let port = 8001;
// let hostname = os.hostname().toLowerCase();
let hostname = "localhost";
let serverName = hostname;
let mainPort = 8000;
let mainHost = "jp01-clarity01";

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
  }
});

let url = `http://${hostname}:${port}`;
let mainHostURL = `http://${mainHost}:${mainPort}`;

module.exports = {
  url,
  port,
  hostname,
  serverName,
  mainPort,
  mainHost,
  mainHostURL
};
