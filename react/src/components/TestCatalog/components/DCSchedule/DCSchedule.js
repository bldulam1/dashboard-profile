import React, { useContext } from "react";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import RLDD from "react-list-drag-and-drop/lib/RLDD";
import { Button, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";
import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import { ProjectContext } from "../../../../context/Project.Context";
import fileDownload from "js-file-download";

const useStyles = makeStyles(theme => ({
  itemWrapper: {
    display: "flex",
    flexDirection: "row",
    cursor: "move",
    border: "1px solid black",
    margin: "0.5rem",
    padding: "0 1rem",
    borderRadius: "0.5rem"
  },
  itemPriority: {
    width: "5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  itemContent: {
    width: "85%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  itemAction: {
    width: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  }
}));

export default () => {
  const { itemWrapper, itemPriority, itemContent, itemAction } = useStyles();
  const { activeProject } = useContext(ProjectContext);
  const { tcProps, tcDispatch } = useContext(TestCatalogContext);
  const { selected } = tcProps;
  let items = selected.map((s, i) => ({ id: i, ...s }));

  const handleRLDDChange = newItems => tcDispatch({ selected: newItems });
  const handleExportClick = () => {
    Axios({
      url: `${api_server}/tc/${activeProject}/create-schedule`,
      method: "POST",
      responseType: "blob"
    }).then(results => {
      fileDownload(results.data, "schedule.xlsx");
    });
  };

  return (
    <div>
      <div>
        <Button onClick={handleExportClick}>Export</Button>
      </div>

      <RLDD
        items={items}
        itemRenderer={(item, index) => {
          return (
            <div className={itemWrapper}>
              <div className={itemPriority}>{index}</div>
              <div className={itemContent}>{item["Record ID"]}</div>
              <div className={itemAction}>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          );
        }}
        onChange={handleRLDDChange}
      />
    </div>
  );
};
