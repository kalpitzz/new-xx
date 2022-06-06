import * as ActionType from '../actionType';
const LoadReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_TABLE_DATA':
      return {
        ...state,
        tableData: action.payload,
      };

    case 'SET_ADD_NEW_LOAD':
      return {
        ...state,
        tableData: [...state.tableData, action.payload],
      };

    case 'SET_EDIT_LOAD':
      return {
        ...state,
        tableData: state.tableData.map((item) => {
          return item.id === action.payload.id ? action.payload : item;
        }),
      };
    case 'SET_LOAD_PREVIEW':
      return {
        ...state,
        loadPreviewData: action.payload,
      };
    case 'SET_LOAD_NUM':
      return {
        ...state,
        loadNum: action.payload,
      };

    case ActionType.SET_LOAD_STATUS:
      return {
        ...state,
        tableData: state.tableData.map((item) => {
          return item.id === action.payload.id
            ? { ...item, status: action.payload.status }
            : item;
        }),
      };

    default:
      return state;
  }
};

export default LoadReducer;
