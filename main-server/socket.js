const fs = require("fs");
const https = require("https");
const express = require("express");
const app = express();
const options = {
  key: fs.readFileSync("./certificates/ca-signed.key"),
  cert: fs.readFileSync("./certificates/ca-signed.cer")
};

const socketIOServer = https.createServer(options, app);
const io = require("socket.io")(socketIOServer, {
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

const Client = require("./schemas/user");

io.on("connection", socket => {
  socket.on("online", async ({ _id }) => {
    const client = await Client.findByIdAndUpdate(_id, {
      online: true,
      socketID: socket.id
    });
    console.log(`CONNECTED: ${client ? client.name : ""} ${socket.id}`);
  });
  socket.on("disconnect", async () => {
    const client = await Client.findOneAndUpdate(
      { socketID: socket.id },
      { online: false }
    );
    console.log(`DISCONNECTED: ${client ? client.name : ""}`);
  });
});

module.exports = { socketIOServer, io };
