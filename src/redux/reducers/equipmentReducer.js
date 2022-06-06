import * as ActionType from '../actionType';

const equipmentReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionType.SET_TRUCK_DATA:
      return {
        ...state,
        truckData: action.payload,
      };

    case ActionType.SET_TRAILER_DATA:
      return {
        ...state,
        trailerData: action.payload,
      };

    case ActionType.SET_PREVIEW_DATA:
      return {
        ...state,
        equipmentPreview: action.payload,
      };
    case ActionType.SET_TYPE:
      return {
        ...state,
        type: action.payload,
      };
    case ActionType.DELETE:
      const { type, id } = action.payload;
      return type === 'Truck'
        ? {
            ...state,
            truckData: [
              ...state.truckData.filter((item) =>
                item.id.toString() === id.toString() ? false : true
              ),
            ],
          }
        : {
            ...state,
            trailerData: [
              ...state.trailerData.filter((item) =>
                item.id.toString() === id.toString() ? false : true
              ),
            ],
          };
    case ActionType.EDIT_EQ:
      const { edit_type, edit_id } = action.payload;
      return edit_type === 'Truck'
        ? {
            ...state,
            form_pre_fill: state.truckData.filter((item) =>
              item.id.toString() === edit_id.toString() ? true : false
            ),
          }
        : {
            ...state,
            form_pre_fill: state.trailerData.filter((item) =>
              item.id.toString() === edit_id.toString() ? true : false
            ),
          };
    case ActionType.RESET_EQ_FORM:
      return {
        ...state,
        form_pre_fill: '',
      };

    case ActionType.POST_TRUCK:
      return {
        ...state,
        truckData: [...state.truckData, action.payload],
      };

    case ActionType.POST_TRAILER:
      return {
        ...state,
        trailerData: [...state.trailerData, action.payload],
      };
    case ActionType.EDIT_TRUCK:
      return {
        ...state,
        truckData: [
          ...state.truckData.map((item) =>
            item.id.toString() === action.payload.id.toString()
              ? action.payload
              : item
          ),
        ],
      };

    case ActionType.EDIT_TRAILER:
      return {
        ...state,
        trailerData: [
          ...state.trailerData.map((item) =>
            item.id.toString() === action.payload.id.toString()
              ? action.payload
              : item
          ),
        ],
      };

    case ActionType.IS_POPUP:
      return {
        ...state,
        isPopUp: action.payload,
      };

    default:
      return state;
  }
};

export default equipmentReducer;
