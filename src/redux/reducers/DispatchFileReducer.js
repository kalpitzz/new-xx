import * as ActionType from '../actionType';
const FileReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_DISPATCH_FILE_DATA':
      return {
        ...state,
        fileData: action.payload,
      };
    case 'SET_DISPATCH_FILE_POST':
      console.log(action.payload);
      return {
        ...state,
        fileData: [...state.fileData, action.payload],
      };
    case 'SET_DISPATCH_FILE_DELETE':
      return {
        ...state,
        fileData: state.fileData.filter((item) => {
          return item.id !== action.payload;
        }),
      };

    default:
      return state;
  }
};

export default FileReducer;
