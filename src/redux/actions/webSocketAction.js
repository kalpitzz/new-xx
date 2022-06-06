import * as ActionType from '../actionType';
const setSocketDriverLocation = (data) => {
  return {
    type: ActionType.SET_DRIVER_LOCATION,
    payload: data,
  };
};

const changeSosStatus = (data) => {
  return {
    type: ActionType.CHANGE_SOS_STATUS,
    payload: data,
  };
};

const resoleSos =(data)=>{
  return {
    type: ActionType.SOS_RESOLVE,
    payload: data
  }
}

const exportDefault = {
  setSocketDriverLocation,
  changeSosStatus,
  resoleSos,
};

export default exportDefault;
