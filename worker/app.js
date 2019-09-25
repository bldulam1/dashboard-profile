const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const axios = require("axios");
const props = require("./config/processArgs");

app.use(bodyParser.urlencoded({ extended: false, limit: "1000mb" }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(logger("dev"));
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://jp01-clarity01",
      "http://jp01-clarity01",
      "https://jp01-clarity01:4444",
      "http://jp01-clarity01:8080"
    ]
  })
);
app.set("view options", { pretty: true });
app.use("/api/overpass", require("./routes/Overpass"));
app.use("/api/maps", require("./routes/maps"));
app.use("/tasks", require("./routes/tasks"));
app.use("/fileSearch", require("./routes/fileSearch"));
app.use("/", require("./routes/statistics"));

app.listen(props.port, async () => {
  const { mainHostURL } = props;
  const mainURL = `${mainHostURL}/service-workers/new`;
  const { hostname, port, serverName, url, cores } = props;

  axios
    .post(mainURL, {
      hostname,
      port,
      serverName,
      url,
      taskID: null,
      searchID: null,
      activeTask: null,
      cores
    })
    .then(() => console.log("success"))
    .catch(() => console.log("failed", mainURL));

  console.log(`Service worker is listening on port ${port}!`);
});
