import * as ActionType from "../actionType";
const setTruckData = (data) => {
  return {
    type: ActionType.SET_TRUCK_DATA,
    payload: data,
  };
};

const setTrailerData = (data) => {
  return {
    type: ActionType.SET_TRAILER_DATA,
    payload: data,
  };
};

const setPreviewData = (data) => {
  return {
    type: ActionType.SET_PREVIEW_DATA,
    payload: data,
  };
};

const setType = (data) => {
  return {
    type: ActionType.SET_TYPE,
    payload: data,
  };
};

const deleteAction = (data) => {
  return {
    type: ActionType.DELETE,
    payload: data,
  };
};

const previewAction = (data) => {
  return {
    type: ActionType.EDIT_EQ,
    payload: data,
  };
};

const resetForm = () => {
  return {
    type: ActionType.RESET_EQ_FORM,
  };
};

const postTruck = (data) => {
  return {
    type: ActionType.POST_TRUCK,
    payload: data,
  };
};

const postTrailer = (data) => {
  return {
    type: ActionType.POST_TRAILER,
    payload: data,
  };
};

const editTruck = (data) => {
  return {
    type: ActionType.EDIT_TRUCK,
    payload: data,
  };
};

const editTrailer = (data) => {
  return {
    type: ActionType.EDIT_TRAILER,
    payload: data,
  };
};

const isPopUp = (data) => {
  return {
    type: ActionType.IS_POPUP,
    payload: data,
  };
};

const exportDefault = {
  setTruckData,
  setTrailerData,
  setPreviewData,
  setType,
  deleteAction,
  previewAction,
  resetForm,
  postTruck,
  postTrailer,
  editTruck,
  editTrailer,
  isPopUp,
};

export default exportDefault;
