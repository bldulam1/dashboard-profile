const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { getCPU_MEM, getNetworkStats } = require("./routines/routine.stats");
const { executeTasks } = require("./utils/taskAssignment");
const httpsPort = process.env.NODE_ENV === "development" ? 4444 : 443;
const httpPort = process.env.NODE_ENV === "development" ? 8080 : 80;
const socketIOPort = 8081;
const { socketIOServer, io } = require("./socket");
const Client = require("./schemas/user");

app.use(bodyParser.urlencoded({ extended: false, limit: "1000mb" }));
app.use(bodyParser.json({ limit: "1000mb" }));
// app.use(logger("dev"));
app.use(
  cors({
    credentials: true,
    origin: [
      "https://localhost",
      "https://jp01-clarity01",
      "http://jp01-clarity01",
      "https://jp01-clarity01.corp.int",
      "http://jp01-clarity01.corp.int"
    ]
  })
);
app.set("view options", { pretty: true });

app.use("/api/fs", require("./routes/File"));
app.use("/api/kpi", require("./routes/kpi"));
app.use("/api/maps", require("./routes/Maps"));
app.use("/api/naming-convention", require("./routes/NamingConventions"));
app.use("/api/projects", require("./routes/Project"));
app.use("/api/search", require("./routes/Search"));
app.use("/api/service-workers", require("./routes/ServiceWorkers"));
app.use("/api/server-assignments", require("./routes/ServerAssignment"));
app.use("/api/statistics", require("./routes/Statistics"));
app.use("/api/tasks", require("./routes/Task"));
app.use("/api/tc", require("./routes/TestCatalog"));
app.use("/api/upload", require("./routes/Upload"));
app.use("/api/user", require("./routes/User"));

if (process.env.NODE_ENV === "production") {
  const reactAppDir = path.join(__dirname, "../react/build/");
  app.use(express.static(reactAppDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(reactAppDir, "index.html"));
  });
}

mongoose.connect(`mongodb://localhost:27017/clarity`, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on("error", err => console.log(err));
mongoose.connection.on("open", () => {
  console.log(`${process.pid} database server connected`);

  const key = fs.readFileSync("./certificates/ca-signed.key");
  const cert = fs.readFileSync("./certificates/ca-signed.cer");
  const options = { key, cert };

  const httpsServer = https.createServer(options, app);
  httpsServer.listen(httpsPort, () => {
    console.log(`Clarity HTTPS server is listening on port ${httpsPort}!`);
  });
  app.listen(httpPort, () => {
    console.log(`Clarity HTTP server is listening on port ${httpPort}`);
    // setInterval(getCPU_MEM, 1000);
    // setInterval(getNetworkStats, 5000);
    executeTasks();
  });
  socketIOServer.listen(socketIOPort, listener => {
    console.log(`Clarity WS server is listening on port ${socketIOPort}`);
    Client.updateMany({}, { online: false, socketID: null }).then(() => {
      io.emit("reconnect");
    });
  });
});
