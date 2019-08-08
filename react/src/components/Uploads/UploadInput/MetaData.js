import React from "react";
import uuid from "uuid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { UploadContext } from "../../../context/Upload.Context";

export default params => {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const { keyOptions, tags } = uploadProps;

  const handleAddTag = () =>
    uploadDispatch({
      tags: [...tags, { key: "", value: "" }],
      type: "Tags"
    });
  const handleUpdateTag = (index, newTag) => {
    const newTags = tags;
    newTags[index] = newTag;
    uploadDispatch({
      tags: [...newTags],
      type: "Tags"
    });
  };
  const handleRemoveTag = index => {
    const newTags = tags.filter((tag, ind) => ind !== index);
    uploadDispatch({
      tags: [...newTags],
      type: "Tags"
    });
  };
  return (
    <React.Fragment>
      {tags.map((tag, index) => (
        <TagComponent
          key={uuid()}
          _tag={tag}
          handleAddTag={handleAddTag}
          handleUpdateTag={handleUpdateTag}
          handleRemoveTag={handleRemoveTag}
          index={index}
          isLastIndex={index === tags.length - 1}
          disabled={tags.length < 2}
          keys={keyOptions.filter(
            k =>
              !tags
                .filter((t, i) => i !== index)
                .map(tag => tag.key)
                .includes(k)
          )}
        />
      ))}
    </React.Fragment>
  );
};

function TagComponent(props) {
  const {
    disabled,
    _tag,
    handleUpdateTag,
    handleRemoveTag,
    handleAddTag,
    index,
    keys,
    isLastIndex
  } = props;
  const [tag, setTag] = React.useState(_tag);

  const onTagChange = (event, name) => {
    const newTag = { ...tag, [name]: event.target.value };
    setTag(newTag);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (tag.value.length) {
      handleUpdateTag(index, tag);
      handleAddTag();
    }
  };

  return (
    <form
      style={{ display: "flex", flexWrap: "wrap", width: "100%" }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <FormControl style={{ width: "25%" }}>
        <InputLabel>Key</InputLabel>
        <Select value={tag.key} onChange={event => onTagChange(event, "key")}>
          {keys.map(key => (
            <MenuItem key={uuid()} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        style={{ width: "65%" }}
        label="Value"
        value={tag.value}
        onChange={event => onTagChange(event, "value")}
      />
      <IconButton
        edge="end"
        aria-label="delete"
        disabled={disabled}
        onClick={() => handleRemoveTag(index)}
      >
        <RemoveCircleIcon color={disabled ? "disabled" : "error"} />
      </IconButton>

      {isLastIndex && (
        <div>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleSubmit}
            disabled={!tag.value.length}
          >
            <AddCircleIcon color={tag.value.length ? "primary" : "disabled"} />
          </IconButton>
        </div>
      )}
    </form>
  );
}
