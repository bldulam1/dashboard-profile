import React from "react";
import Dropzone from "react-dropzone-uploader";
import { getDroppedOrSelectedFiles } from "html5-file-selector";

const Input = ({ accept, onFiles, files, getFilesFromEvent }) => {
  const text = files.length > 0 ? "Add more files" : "Choose files";

  return (
    <label
      style={{
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
        padding: 15,
        borderRadius: 3
      }}
    >
      {text}
      <input
        style={{ display: "none" }}
        type="file"
        accept={accept}
        multiple
        onChange={e => {
          getFilesFromEvent(e).then(chosenFiles => {
            onFiles(chosenFiles);
          });
        }}
      />
    </label>
  );
};

export default params => {
  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta));
    allFiles.forEach(f => f.remove());
  };

  const getFilesFromEvent = e => {
    return new Promise(resolve => {
      getDroppedOrSelectedFiles(e).then(chosenFiles => {
        resolve(chosenFiles.map(f => f.fileObject));
      });
    });
  };

  return (
    <Dropzone
      // accept="image/*,audio/*,video/*,.pdf"
      getUploadParams={() => ({ url: "http://localhost:8000/upload/multiple/Nissan" })}
      onSubmit={handleSubmit}
      InputComponent={Input}
      getFilesFromEvent={getFilesFromEvent}
    />
  );
};
