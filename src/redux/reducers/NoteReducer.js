const NoteReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_NOTE_DATA':
      console.log(action.payload);
      return {
        ...state,
        noteData: action.payload,
      };

    case 'SET_POST_NOTE_DATA':
      console.log(action.payload);

      return {
        ...state,
        noteData: [...state.noteData, action.payload],
      };

    case 'SET_EDIT_DATA':
      return {
        ...state,
        noteData: state.noteData.map((item) => {
          return item.id.toString() === action.payload.id.toString()
            ? action.payload
            : item;
        }),
      };

    case 'SET_DELETE_DATA':
      console.log(action.payload);
      return {
        ...state,
        noteData: state.noteData.filter((item) => {
          console.log(item);
          return item.id.toString() !== action.payload.toString();
        }),
      };

    default:
      return state;
  }
};

export default NoteReducer;
