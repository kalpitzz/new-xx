import * as ActionType from '../actionType';

const setdispatchTableData = (data) => {
  return {
    type: 'SET_DISPATCH_TABLE_DATA',
    payload: data,
  };
};

const addCheckCallDashboard = (data) => {
  console.log(data);
  return {
    type: 'ADD_CHECK_CALL_DASHBOARD',
    payload: data,
  };
};

const editdispatchTableData = (obj) => {
  console.log('obj', obj);
  return {
    type: ActionType.EDIT_DISPATCH_TABLE,
    payload: obj,
  };
};
const changeStatusDispatchTableData = (status) => {
  console.log(status);
  return {
    type: ActionType.STATUS_DISPATCH_TABLE_DATA,
    payload: status,
  };
};

const setPreviewForDispatch = (data) => {
  return {
    type: ActionType.SET_DISPATCH_LOAD_PREV,
    payload: data,
  };
};

const setdispatchSummaryData = (data) => {
  console.log('data', data);
  return {
    type: 'SET_DISPATCH_SUMMARY_DATA',
    payload: data,
  };
};

const setCheckCallData = (data) => {
  return {
    type: 'SET_CHECK_CALL_DATA',
    payload: data,
  };
};
const postCheckCallData = (data) => {
  console.log(data);
  return {
    type: ActionType.ADD_CHECK_CALL_DATA,
    payload: data,
  };
};
const editCheckCallData = (obj) => {
  console.log('editCheck', obj);
  return {
    type: ActionType.EDIT_CHECK_CALL_DATA,
    payload: obj,
  };
};
const setDispatchId = (id) => {
  return {
    type: ActionType.SET_DISPATCH_ID,
    payload: id,
  };
};
const setSocket = (data) => {
  return {
    type: ActionType.SET_SOCKET,
    payload: data,
  };
};
const exportDefault = {
  setdispatchTableData,
  setdispatchSummaryData,
  setCheckCallData,
  setPreviewForDispatch,
  setDispatchId,
  editCheckCallData,
  postCheckCallData,
  changeStatusDispatchTableData,
  editdispatchTableData,
  addCheckCallDashboard,
  setSocket,
};

export default exportDefault;
