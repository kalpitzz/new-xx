const setDispatchFileData = (data) => {
  return {
    type: "SET_DISPATCH_FILE_DATA",
    payload: data,
  };
};

const setDispatchFilePost = (data) => {
  console.log(data);
  return {
    type: "SET_DISPATCH_FILE_POST",
    payload: data,
  };
};
const setDispatchFileDelete = (data) => {
  return {
    type: "SET_DISPATCH_FILE_DELETE",
    payload: data,
  };
};
const exportDefault = {
  setDispatchFileData,
  setDispatchFilePost,
  setDispatchFileDelete,
};

export default exportDefault;
