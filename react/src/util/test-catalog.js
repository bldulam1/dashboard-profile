// function createHeader(id, numeric, disablePadding, label) {
//   return { id, numeric, disablePadding, label };
// }

// export function getHeaders(rows) {
//   return rows
//     .map(row =>
//       Object.keys(row).filter(
//         key => !["sheetName", "_id", "__v", "project"].includes(key)
//       )
//     )
//     .reduce((acc, curr) => [...new Set([...acc, ...curr])], [])
//     .map(key => {
//       const index = rows.findIndex(row => row[key]);
//       return createHeader(
//         key,
//         index >= 0 && !isNaN(rows[index][key]),
//         false,
//         key
//       );
//     });
// }

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

