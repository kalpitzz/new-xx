const FileReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FILE_DATA':
      return {
        ...state,
        fileData: action.payload,
      };
    case 'SET_POST_DATA':
      console.log(action.payload);
      return {
        ...state,
        fileData: [...state.fileData, action.payload],
      };
    case 'SET_DELETE_DOCUMENT':
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
