const xlsx = require("xlsx");
const mongoose = require("mongoose");
const testcatalogLocation = "../main-server/tmp";
const fs = require("fs");
const path = require("path");

const testCatalogSchema = mongoose.Schema(
  {
    Serie: String,
    Pattern: String,
    "Record ID": String,
    project: String
  },
  { strict: false }
);
const TestCatalog = mongoose.model("TestCatalog", testCatalogSchema);

// const testCatalogFiles = fs
//   .readdirSync(testcatalogLocation)
//   .map(file => path.join(testcatalogLocation, file));

const testCatalogFiles = [
  // "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[ALGN].xlsb"
  // "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[BLCK].xlsb",
  // "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[FCTA].xlsb",
  // "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[FLCA].xlsb",
  // "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[FLCW].xlsb",
  // "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[RBSW].xlsb",
  "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[RCTA].xlsb",
  "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[RLCA].xlsb",
  "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[RLCW].xlsb",
  "C:\\Users\\brendon.dulam\\Desktop\\Workspace\\clarity2.0\\main-server\\tmp\\RN_77_GEN1.3_TEST_CATALOG_[ROSE].xlsb"
];

async function parseTestCatalog(options, rowCallback) {
  const {
    file,
    headers: { main, sub },
    project
  } = options;
  const workbook = xlsx.readFile(file);
  const sheets = getTestCatalogSheets(file);

  sheets.forEach(async sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    let headers = {};
    let subheaders = {};
    let rowData = {};
    let lastCol = {
      val: 0,
      strVal: "KC"
    };
    let firstRow = {};

    for (cell in worksheet) {
      if (cell[0] === "!") continue;
      //parse out the column, row, and value
      let colIndex = 0;
      for (let i = 0; i < cell.length; i++) {
        if (!isNaN(cell[i])) {
          colIndex = i;
          break;
        }
      }

      let col = cell.substring(0, colIndex);
      let row = 1 * cell.substring(colIndex);
      let value = worksheet[cell].v;
      let parseVal = value * 1;

      if (row < main) {
        continue;
      }
      //store header names
      else if (row === main && value) {
        headers[col] = value;
        continue;
      }
      //store subheader names
      else if (row === sub) {
        subheaders[col] = value.replace(/\r?\n|\r|#/g, "");

        if (!headers[col]) headers[col] = subheaders[col];
        continue;
      }
      //get last column
      else if (row === sub + 1) {
        let colCode = 0;
        for (let i = 0; i < col.length; i++) {
          colCode += col.charCodeAt(i);
        }
        if (colCode > lastCol.val) {
          lastCol.val = colCode;
          lastCol.strVal = col;
        }
        firstRow = {...rowData};
      }

      rowData[headers[col]] =
        ["A", "B"].includes(col) || isNaN(parseVal) ? value : parseVal;

      if (col === lastCol.strVal && row > sub + 1) {
        if (firstRow) {
          rowCallback({ project, sheetName, ...firstRow });
          firstRow = null;
        }
        rowCallback({ project, sheetName, ...rowData });
        rowData = {};
      }
    }
  });
}

function getTestCatalogSheets(excelFileName) {
  const wb = xlsx.readFile(excelFileName);
  const featureIndexStart = excelFileName.indexOf("[") + 1;
  const featureIndexEnd = excelFileName.indexOf("]");
  const feature = excelFileName.slice(featureIndexStart, featureIndexEnd);

  return wb.SheetNames.filter(sn => sn.includes(feature));
}

function getTestCatalogHeaders(excelFileName) {
  const workbook = xlsx.readFile(excelFileName);
  const tc_sheets = getTestCatalogSheets(excelFileName);

  const worksheet = workbook.Sheets[tc_sheets[0]];

  for (cell in worksheet) {
    if (cell[0] === "!") continue;
    console.log(cell);
  }
}

// const options = {
//   file:
//     "C:\\Users\\brendon.dulam\\Downloads\\RN_77_GEN1.3_TEST_CATALOG_[ALGN].xlsb",
//   sheets: ["ALGN_01", "ALGN_SP"],
//   headers: {
//     main: 2,
//     sub: 3
//   }
// };

mongoose.connect(`mongodb://localhost:27017/clarity`, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on("error", err => console.log(err));
mongoose.connection.on("open", () => {
  console.log(`${process.pid} database server connected`);
  testCatalogFiles.forEach(async tcf => {
    let totalCount = 0;
    let currentCount = 0;
    parseTestCatalog(
      { file: tcf, headers: { main: 2, sub: 3 }, project: "Renault Nissan" },
      async rowData => {
        totalCount++
        await TestCatalog.findOneAndUpdate(
          { "Record ID": rowData["Record ID"] },
          rowData,
          { upsert: true }
        );
        currentCount++;
        if(currentCount === totalCount){
          console.log("PARSED", tcf, 'Entries', totalCount);
        }
        // rowData.Pattern.includes('001') && console.log(rowData);
      }
    );
  });
});

// let count = 0
// parseTestCatalog(options, rowData => console.log(++count))

// getTestCatalogHeaders("C:\\Users\\brendon.dulam\\Downloads\\RN_77_GEN1.3_TEST_CATALOG_[ALGN].xlsb")
