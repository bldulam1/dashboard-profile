import React from 'react';
import Button from "@material-ui/core/Button";

export default (params) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <section style={{ alignSelf: "flex-end" }}>
        <Button color="secondary" variant="contained">
          Cancel
        </Button>
        <Button color="primary" variant="contained">
          Upload
        </Button>
      </section>
    </div>
  );
}
