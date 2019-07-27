import React from "react";
import Workbook from "react-excel-workbook";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import BallotIcon from "@material-ui/icons/Ballot";

const data1 = [
  {
    foo: "123",
    bar: "456",
    baz: "789"
  },
  {
    foo: "abc",
    bar: "dfg",
    baz: "hij"
  },
  {
    foo: "aaa",
    bar: "bbb",
    baz: "ccc"
  }
];

export default params => {
  const { selected } = params;
  
  console.log(selected)
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
      <Workbook.Sheet data={data1} name="Sheet A">
        <Workbook.Column label="Foo" value="foo" />
        <Workbook.Column label="Bar" value="bar" />
      </Workbook.Sheet>
    </Workbook>
  );
};
