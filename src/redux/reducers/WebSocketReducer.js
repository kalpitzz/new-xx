import * as ActionType from '../actionType';
const WebSocketReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionType.SET_DRIVER_LOCATION:
      return {
        ...state,
        current_driver_location: action.payload,
      };
    case ActionType.CHANGE_SOS_STATUS:
      return {
        ...state,
        sos_status_data: action.payload,
      };
      case ActionType.SOS_RESOLVE:
        return {
          ...state,
          resolve_message: action.payload,
        };
    default:
      return state;
  }
};
export default WebSocketReducer;
