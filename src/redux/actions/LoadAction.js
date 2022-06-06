import * as ActionType from '../actionType';

const setTableData = (data) => {
  return {
    type: 'SET_TABLE_DATA',
    payload: data,
  };
};

const setAddNewLoad = (data) => {
  return {
    type: 'SET_ADD_NEW_LOAD',
    payload: data,
  };
};

const setEditLoad = (data) => {
  return {
    type: 'SET_EDIT_LOAD',
    payload: data,
  };
};

const setLoadStatus = (data) => {
  console.log('LoaadAction', data);
  return {
    type: ActionType.SET_LOAD_STATUS,
    payload: data,
  };
};
const setPreview = (data) => {
  console.log(data);
  return {
    type: 'SET_LOAD_PREVIEW',
    payload: data,
  };
};
const setLoadNum = (data) => {
  return {
    type: 'SET_LOAD_NUM',

    payload: data,
  };
};

const exportDefault = {
  setTableData,
  setPreview,
  setLoadNum,
  setAddNewLoad,
  setEditLoad,
  setLoadStatus,
};

export default exportDefault;
