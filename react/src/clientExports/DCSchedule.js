import React from "react";
import Workbook from "react-excel-workbook";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import BallotIcon from "@material-ui/icons/Ballot";
import { getHeaders } from "../components/TestCatalog";

export default params => {
  const { selected } = params;
  const headers = [
    "Scenario Picture",
    "#",
    "Priority",
    "Status",
    "Scenario",
    ...getHeaders(selected)
      .map(h => h.id)
      .filter(h => !["Serie", "Pattern"].includes(h)),
    "Tg Type",
    "Note",
    "Data Volume",
    "DOORS",
    "JIRA",
    "PTC"
  ];
  console.log(headers);
  return (
    <Workbook
      filename="example.xlsx"
      element={
        <Tooltip title="Create Data Collection Planner">
          <IconButton aria-label="Delete">
            <BallotIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <Workbook.Sheet data={selected} name="Sheet A">
        {headers.map(header => (
          <Workbook.Column
            key={`key-${header}`}
            label={header}
            value={header}
          />
        ))}
      </Workbook.Sheet>
    </Workbook>
  );
};
