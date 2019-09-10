function editWorksheet(worksheet, row, col, type, content) {
  if (type === "string") worksheet.cell(row, col).string(content);
  else if (type === "formula") worksheet.cell(row, col).formula(content);
  else if (type === "number") worksheet.cell(row, col).number(content);
}

// Require library
var excel = require("excel4node");

// Create a new instance of a Workbook class
var workbook = new excel.Workbook();

// Add Worksheets to the workbook
var worksheet = workbook.addWorksheet("Sheet 1");
// var worksheet2 = workbook.addWorksheet('Sheet 2');

// Create a reusable style
var style = workbook.createStyle({
  font: {
    color: "#dd0800",
    size: 20
  },
  numberFormat: "$#,##0.00; ($#,##0.00); -"
});

const startRow = 6;
const endRow = 111;
function entireColumn(colLetter, rowStart, rowEnd) {
  return `${colLetter}${rowStart}:${colLetter}${rowEnd}`;
}

editWorksheet( worksheet, 1, 1, "string", "Renault Nissan  77GHz Gen1.3 AD2 BCR / Test Time Schedule");
editWorksheet(worksheet, 2, 1, "string", "Software R02.01 Test  [Day-1]");
editWorksheet(worksheet, 2, 7, "string", "Scenario");
editWorksheet(worksheet, 2, 8, "formula", `COUNT(${entireColumn("B", startRow, endRow)},)`);
editWorksheet(worksheet, 2, 9, "string", "Variants");
editWorksheet(worksheet, 2, 10, "string", "Number of Trials");
editWorksheet(worksheet, 2, 11, "number", 150);
editWorksheet(worksheet, 2, 12, "string", "Trials");
editWorksheet(worksheet, 2, 13, "string", "Completed");
editWorksheet(worksheet, 2, 14, "formula", `COUNTIFS(${entireColumn("D", startRow, endRow)}, "DONE")`);
editWorksheet(worksheet, 2, 15, "string", "Scenarios");
editWorksheet(worksheet, 2, 16, "string", "Data Volume Estimated");
editWorksheet(worksheet, 2, 18, "string", "GB");

editWorksheet(worksheet, 3, 1, "string", "JARI STC Genaral Test Course");
editWorksheet(worksheet, 3, 5, "string", "Duration");
editWorksheet(worksheet, 3, 6, "string", "08:00~20:00");
editWorksheet(worksheet, 3, 7, "string", "Valid Time");
editWorksheet(worksheet, 3, 8, "number", 12);
editWorksheet(worksheet, 3, 9, "string", "Hour");
editWorksheet(worksheet, 3, 10, "string", "Total Test Time");
editWorksheet(worksheet, 3, 11, "formula", `SUM(${entireColumn("O", startRow, endRow)})`);
editWorksheet(worksheet, 3, 12, "string", "Hour");
editWorksheet(worksheet, 3, 13, "string", "Over");
editWorksheet(worksheet, 3, 14, "formula", "SUM(K3-H3)");
editWorksheet(worksheet, 3, 15, "string", "Hour");
editWorksheet(worksheet, 3, 18, "string", "TB");

editWorksheet(worksheet, 5, 1, "string", "Scenario Picture");
editWorksheet(worksheet, 5, 1, "string", "#");

// worksheet.cell(1,1).number(400).style(style);
// worksheet.cell(1,2).number(200).style(style);
// worksheet.cell(1,3).formula('A1 + B1').style(style);
// worksheet.cell(2,1).string('string').style(style);
// worksheet.cell(3,1).bool(true).style(style).style({font: {size: 14}});

workbook.write("Excel.xlsx");
