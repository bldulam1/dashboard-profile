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
  const { keyOptions, tags, setTags } = React.useContext(UploadContext);

  const handleAddTag = () => setTags([...tags, { key: "", value: "" }]);
  const handleUpdateTag = (index, newTag) => {
    const newTags = tags;
    newTags[index] = newTag;
    setTags(newTags);
  };
  const handleRemoveTag = index => {
    const newTags = tags.filter((tag, ind) => ind !== index);
    setTags(newTags);
  };
  // const canAddNewTag = () => {
  //   return tags.length === 1 || tags[tags.length - 2].value !== "";
  // };

  return (
    <React.Fragment>
      {tags.map((tag, index) => (
        <TagComponent
          key={uuid()}
          _tag={tag}
          handleUpdateTag={handleUpdateTag}
          handleRemoveTag={handleRemoveTag}
          index={index}
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

      <div>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={handleAddTag}
          // disabled={!canAddNewTag()}
        >
          <AddCircleIcon color="primary" />
        </IconButton>
      </div>
    </React.Fragment>
  );
};

function TagComponent(props) {
  const {
    disabled,
    _tag,
    handleUpdateTag,
    handleRemoveTag,
    index,
    keys
  } = props;
  const [tag, setTag] = React.useState(_tag);

  const onTagChange = (event, name) => {
    const newTag = { ...tag, [name]: event.target.value };
    setTag(newTag);
    handleUpdateTag(index, newTag);
  };

  return (
    <form
      style={{ display: "flex", flexWrap: "wrap", width: "100%" }}
      noValidate
      autoComplete="off"
    >
      <FormControl style={{ width: "25%" }}>
        <InputLabel htmlFor="age-simple">Key</InputLabel>
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
    </form>
  );
}
