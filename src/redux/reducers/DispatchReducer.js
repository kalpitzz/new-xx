import * as ActionType from '../actionType';
const DispatchReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_DISPATCH_TABLE_DATA':
      return {
        ...state,
        dispatchTableData: action.payload,
      };
    case ActionType.EDIT_DISPATCH_TABLE:
      return {
        ...state,
        dispatchTableData: state.dispatchTableData.map((item) =>
          item.id === action.payload.id ? action.payload.data : item
        ),
      };

    case 'ADD_CHECK_CALL_DASHBOARD':
      return {
        ...state,
        dispatchTableData: state.dispatchTableData.map((item) =>
          item.dispatch_id === action.payload.id
            ? {
                ...item,
                check_calls: [...item.check_calls, action.payload.data],
              }
            : item
        ),
      };
    case 'SET_DISPATCH_SUMMARY_DATA':
      return {
        ...state,
        dispatchSummaryData: action.payload,
      };
    case 'SET_CHECK_CALL_DATA':
      return {
        ...state,
        checkCallData: action.payload,
      };
    case ActionType.SET_DISPATCH_LOAD_PREV:
      return {
        ...state,
        dispatchLoadPreview: action.payload,
      };
    case ActionType.SET_DISPATCH_ID:
      return {
        ...state,
        dispatch_id: action.payload,
      };
    case ActionType.STATUS_DISPATCH_TABLE_DATA:
      return {
        ...state,
        dispatchTableData: state.dispatchTableData.map((item) => {
          return item.id === action.payload.id
            ? { ...item, status: action.payload.status }
            : item;
        }),
      };
    case ActionType.ADD_CHECK_CALL_DATA:
      return {
        ...state,
        checkCallData: [...state.checkCallData, { ...action.payload }],
      };
    case ActionType.EDIT_CHECK_CALL_DATA:
      return {
        ...state,
        checkCallData: state.checkCallData.map((item) =>
          item.id === action.payload.id ? action.payload.data : item
        ),
      };
    case ActionType.SET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };

    default:
      return state;
  }
};

export default DispatchReducer;
