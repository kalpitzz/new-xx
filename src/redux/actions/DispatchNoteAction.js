const setDispatchNoteData = (data) => {
  return {
    type: "SET_DISPATCH_NOTE_DATA",
    payload: data,
  };
};

const setDispatchNotePost = (data) => {
  console.log(data);
  return {
    type: "SET_DISPATCH_NOTE_POST",
    payload: data,
  };
};
const setDispatchNoteEdit = (data) => {
  return {
    type: "SET_DISPATCH_NOTE_EDIT",
    payload: data,
  };
};

const setDispatchNoteDelete = (data) => {
  return {
    type: "SET_DISPATCH_NOTE_DELETE",
    payload: data,
  };
};

const exportDefault = {
  setDispatchNoteData,
  setDispatchNotePost,
  setDispatchNoteEdit,
  setDispatchNoteDelete,
};

export default exportDefault;
