const express = require("express");
const cors = require("cors");
const app = express();
// const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const axios = require("axios");
const props = require("./config/processArgs");

app.use(bodyParser.urlencoded({ extended: false, limit: "1000mb" }));
app.use(bodyParser.json({ limit: "1000mb" }));
// app.use(logger("dev"));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"]
  })
);
app.set("view options", { pretty: true });
app.use("/api/overpass", require("./routes/Overpass"));
app.use("/tasks", require("./routes/tasks"));
app.use("/fileSearch", require("./routes/fileSearch"));
app.use("/", require("./routes/statistics"));

app.listen(props.port, async () => {
  const { mainHostURL } = props;
  const mainURL = `${mainHostURL}/service-workers/new`;
  const { hostname, port, serverName, url } = props;

  axios
    .post(mainURL, {
      hostname,
      port,
      serverName,
      url,
      taskID: null,
      searchID: null
    })
    .then(() => console.log("success"))
    .catch(() => console.log("failed", mainURL));

  console.log(`Service worker is listening on port ${port}!`);
});
