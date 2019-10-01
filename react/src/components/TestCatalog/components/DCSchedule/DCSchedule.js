import React, { useContext, useState, useEffect } from "react";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
// import { makeStyles } from "@material-ui/styles";
import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import { ProjectContext } from "../../../../context/Project.Context";
import fileDownload from "js-file-download";
import uuid from "uuid/v4";

export default () => {
  const { activeProject } = useContext(ProjectContext);
  const { tcProps } = useContext(TestCatalogContext);
  const { selected, cols } = tcProps;
  const { visibleColumns } = React.useContext(TestCatalogContext).tcProps;

  const [state, setState] = useState({ showColumns: [] });

  useEffect(() => {
    setState({
      showColumns: cols
        .map(col => col.id)
        .filter(ch => !["Record ID"].includes(ch))
    });
  }, [cols]);

  const headers = [
    "Sequence",
    "Priority",
    "Status",
    "Scenario",
    "Catalog Label",
    ...visibleColumns.filter(ch => !["Record ID"].includes(ch)),
    "Trials",
    "Total Time",
    "Target Type",
    "Data Volume"
  ];

  // let items = selected.map((s, i) => ({ id: i, ...s }));

  // const handleRLDDChange = newItems => tcDispatch({ selected: newItems });
  const handleExportClick = () => {
    Axios(
      {
        url: `${api_server}/tc/${activeProject}/create-schedule`,
        method: "POST",
        responseType: "blob",
        data: {
          selected: selected.map(s => {
            let retVal = { "Catalog Label": s["Record ID"] };
            state.showColumns.forEach(keyName => {
              retVal[keyName] = s[keyName];
            });
            return retVal;
          })
        }
      },
      { selected }
    ).then(results => {
      fileDownload(results.data, "schedule.xlsx");
    });
  };

  const totalTime = selected.reduce((sum, s) => sum + (s.Time || 0) * 3, 0);

  return (
    <div>
      <div>
        <Button onClick={handleExportClick}>Export</Button>
      </div>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map(header => (
                <TableCell key={uuid()}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {selected.map((s, index) => (
              <TableRow key={uuid()}>
                {headers.map(header => (
                  <TableCell key={uuid()}>
                    {header === "Sequence"
                      ? index
                      : header === "Priority"
                      ? ""
                      : header === "Status"
                      ? "Pending"
                      : header === "Catalog Label"
                      ? s["Record ID"]
                      : header === "Trials"
                      ? 3
                      : header === "Total Time"
                      ? s.Time && s.Time * 3
                      : header === "Data Volume"
                      ? `${s.Time * 60} GB`
                      : "" || s[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              {headers.map(header => (
                <TableCell key={uuid()}>
                  {header === "Sequence"
                    ? "Total"
                    : header === "Total Time"
                    ? totalTime
                    : header === "Data Volume"
                    ? `${totalTime * 20} GB`
                    : ""}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
