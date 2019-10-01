const fs = require("fs");
const readdirp = require("readdirp");

function mapDir(rootPath) {
  let count = 0;
  return new Promise((resolve, reject) => {
    readdirp(rootPath, {
      fileFilter: "*.cvw",
      directoryFilter: ["!can", "!can2mat"]
    })
      .on("data", ({ fullPath }) => {
        fs.appendFile(
          "files.txt",
          fullPath + "\n",
          err => err && console.error(err)
        );
        count++;
      })
      .on("warn", error => console.error("non-fatal error", error))
      .on("error", error => reject(error))
      .on("end", () => resolve(count));
  });
}

mapDir("V:/JP01/DataLake/Common_Write/Subaru_DC");
