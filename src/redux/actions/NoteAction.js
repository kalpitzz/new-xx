const setNoteData = (data) => {
  console.log(data);
  return {
    type: "SET_NOTE_DATA",
    payload: data,
  };
};

const setPostNoteData = (data) => {
  // console.log(data);
  return {
    type: "SET_POST_NOTE_DATA",
    payload: data,
  };
};

const setEditData = (data) => {
  return {
    type: "SET_EDIT_DATA",
    payload: data,
  };
};

const setDeleteData = (data) => {
  return {
    type: "SET_DELETE_DATA",
    payload: data,
  };
};
const exportDefault = {
  setNoteData,
  setPostNoteData,
  setEditData,
  setDeleteData,
};

export default exportDefault;
