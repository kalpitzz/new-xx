const setFileData = (data) => {
  return {
    type: "SET_FILE_DATA",
    payload: data,
  };
};

const setPostData = (data) => {
  console.log(data);
  return {
    type: "SET_POST_DATA",
    payload: data,
  };
};
const setDeleteData = (data) => {
  return {
    type: "SET_DELETE_DOCUMENT",
    payload: data,
  };
};
const exportDefault = {
  setFileData,
  setPostData,
  setDeleteData,
};

export default exportDefault;
