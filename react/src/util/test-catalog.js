function createHeader(id, numeric, disablePadding, label) {
  return { id, numeric, disablePadding, label };
}

export function getHeaders(rows) {
  return rows
    .map(row =>
      Object.keys(row).filter(
        key => !["sheetName", "_id", "__v", "project"].includes(key)
      )
    )
    .reduce((acc, curr) => [...new Set([...acc, ...curr])], [])
    .map(key => {
      const index = rows.findIndex(row => row[key]);
      return createHeader(
        key,
        index >= 0 && !isNaN(rows[index][key]),
        false,
        key
      );
    });
}