var excel = require("excel4node");
const Path = require("path");

function editWorksheet(worksheet, row, col, type, content) {
  if (type === "string") worksheet.cell(row, col).string(content);
  else if (type === "formula") worksheet.cell(row, col).formula(content);
  else if (type === "number") worksheet.cell(row, col).number(content);
}

function entireColumn(colLetter, rowStart, rowEnd) {
  return `${colLetter}${rowStart}:${colLetter}${rowEnd}`;
}

async function createSchedule(data, project) {
  const startRow = 6;
  const endRow = data.selected.length + startRow - 1;
  var workbook = new excel.Workbook();
  var worksheet = workbook.addWorksheet("Day 1");
  const line1 = Object.keys(data.selected[0]);
  const lineL = Object.keys(data.selected[data.selected.length - 1]);
  const headers = line1.length > lineL.length ? line1 : lineL;

  // Headers
  const cols = [
    "Scenario Picture",
    "#",
    "Priority",
    "Status",
    "Scenario",
    ...headers,
    "Trials",
    "Total Time",
    "Target Type",
    "Data Volume",
    "DOORS",
    "JIRA",
    "PTC"
  ];

  const getCol = (cols, colName) =>
    String.fromCharCode(65 + cols.findIndex(col => col === colName));

  const totalTimeCol = getCol(cols, "Total Time");
  const dataVolCol = getCol(cols, "Data Volume");
  const trialsCol = getCol(cols, "Trials");

  // var style = workbook.createStyle({
  //   font: {
  //     color: "#dd0800",
  //     size: 20
  //   },
  //   numberFormat: "$#,##0.00; ($#,##0.00); -"
  // });
  // worksheet.cell(1,1).number(400).style(style);
  // worksheet.cell(1,2).number(200).style(style);
  // worksheet.cell(1,3).formula('A1 + B1').style(style);
  // worksheet.cell(2,1).string('string').style(style);
  // worksheet.cell(3,1).bool(true).style(style).style({font: {size: 14}});

  editWorksheet(
    worksheet,
    1,
    1,
    "string",
    "Renault Nissan  77GHz Gen1.3 AD2 BCR / Test Time Schedule"
  );
  editWorksheet(worksheet, 2, 1, "string", "Software R02.01 Test  [Day-1]");
  editWorksheet(worksheet, 2, 7, "string", "Scenario");
  editWorksheet(
    worksheet,
    2,
    8,
    "formula",
    `COUNT(${entireColumn("B", startRow, endRow)})`
  );
  editWorksheet(worksheet, 2, 9, "string", "Variants");
  editWorksheet(worksheet, 2, 10, "string", "Number of Trials");
  editWorksheet(
    worksheet,
    2,
    11,
    "formula",
    `SUM(${entireColumn(trialsCol, startRow, endRow)})`
  );
  editWorksheet(worksheet, 2, 12, "string", "Trials");
  editWorksheet(worksheet, 2, 13, "string", "Completed");
  editWorksheet(
    worksheet,
    2,
    14,
    "formula",
    `COUNTIFS(${entireColumn("D", startRow, endRow)}, "DONE")`
  );
  editWorksheet(worksheet, 2, 15, "string", "Scenarios");
  editWorksheet(worksheet, 2, 16, "string", "Data Volume Estimated");
  editWorksheet(
    worksheet,
    2,
    17,
    "formula",
    `SUM(${entireColumn(dataVolCol, startRow, endRow)})`
  );
  editWorksheet(worksheet, 2, 18, "string", "GB");

  editWorksheet(worksheet, 3, 1, "string", "JARI STC Genaral Test Course");
  editWorksheet(worksheet, 3, 5, "string", "Duration");
  editWorksheet(worksheet, 3, 6, "string", "08:00~20:00");
  editWorksheet(worksheet, 3, 7, "string", "Valid Time");
  editWorksheet(worksheet, 3, 8, "number", 12);
  editWorksheet(worksheet, 3, 9, "string", "Hour");
  editWorksheet(worksheet, 3, 10, "string", "Total Test Time");

  editWorksheet(
    worksheet,
    3,
    11,
    "formula",
    `SUM(${entireColumn(totalTimeCol, startRow, endRow)})/60`
  );
  editWorksheet(worksheet, 3, 12, "string", "Hour");
  editWorksheet(worksheet, 3, 13, "string", "Over");
  editWorksheet(worksheet, 3, 14, "formula", "SUM(K3-H3)");
  editWorksheet(worksheet, 3, 15, "string", "Hour");
  editWorksheet(worksheet, 3, 18, "string", "TB");

  cols.forEach((text, index) => {
    editWorksheet(worksheet, 5, 1 + index, "string", text);
  });

  data.selected.forEach((row, rowIndex) => {
    const _rowIndex = 6 + rowIndex;
    let timeColIndex = "A";
    let trialsColIndex = "A";
    cols.forEach((col, colIndex) => {
      const _colIndex = 1 + colIndex;
      let cellValue;
      let type = null;
      if (col === "#") {
        cellValue = rowIndex + 1;
      } else if (col === "Trials") {
        trialsColIndex = String.fromCharCode(65 + colIndex);
        cellValue = 3;
      } else if (col === "Time") {
        cellValue = row[col];
        timeColIndex = String.fromCharCode(65 + colIndex);
      } else if (col === "Total Time") {
        type = "formula";
        cellValue = `${timeColIndex}${_rowIndex} * ${trialsColIndex}${_rowIndex}`;
      } else if (col === "Data Volume") {
        type = "formula";
        cellValue = `${timeColIndex}${_rowIndex} * ${trialsColIndex}${_rowIndex} * 20`;
      } else if (row[col] === null || row[col] === undefined) {
        cellValue = "";
      } else {
        cellValue = row[col];
      }

      if (!type) {
        type = typeof cellValue;
      }

      if (cellValue !== "") {
        editWorksheet(worksheet, _rowIndex, _colIndex, type, cellValue);
      }
    });
  });

  const fileName = `./tmp/DCS_${project}.xlsx`;
  await workbook.write(fileName);
  return Path.resolve(fileName);
}

module.exports = {
  createSchedule
};
