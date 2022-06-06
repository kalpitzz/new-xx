import * as ActionType from '../actionType';
const FormReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PREVIEW':
      return {
        ...state,
        previewData: action.payload,
      };

    case 'SET_FORM_TYPE':
      return {
        ...state,
        formType: action.payload,
      };
    case 'SET_PREVIEW_ID':
      return {
        ...state,
        previewId: action.payload,
      };
    case 'SET_ADDRESSBOOK':
      return {
        ...state,
        addressBookData: action.payload,
      };
    case 'ADD_DATA':
      if (state.addressBookData) {
        return {
          ...state,
          addressBookData: [...state.addressBookData, action.payload],
        };
      }

    case 'DELETE':
      return {
        ...state,
        addressBookData: [
          ...state.addressBookData.filter((item) =>
            item.id.toString() === action.payload.id.toString() &&
            item.role === action.payload.role
              ? false
              : true
          ),
        ],
      };
    case 'EDIT_DATA':
      console.log(action.payload);
      return {
        ...state,
        addressBookData: state.addressBookData.map((item) =>
          item.id.toString() === action.payload.id.toString() &&
          item.role === action.payload.role
            ? action.payload
            : item
        ),
      };

    case 'ADD_ROLE':
      return {
        ...state,
        role: action.payload,
      };
    case ActionType.SET_INVITATION:
      return {
        ...state,
        invitation: action.payload,
      };
    case ActionType.ADD_INVITE:
      return {
        ...state,
        invitation: [...state.invitation, action.payload],
      };
    default:
      return state;
  }
};

export default FormReducer;
