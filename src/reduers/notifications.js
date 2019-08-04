import actionTypes from '../actions/actionTypes';
const initState = {
  list: [],
  isLoading: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case actionTypes.GET_CONTIFICATION_LIST:
      return {
        ...state,
        isLoading: false,
          list: action.payload.data.notificationsList
      };
    case actionTypes.MARK_ALL_READ:
      return {
        ...state,
        isLoading: false,
          list: state.list.map(item => {
            item.hasRead = true;
            return item;
          })
      };
    case actionTypes.MARK_READ_BY_ID:

      return {
        ...state,
        isLoading: false,
          list: state.list.map(item => {
            if (item.id === action.payload.id) {
              item.hasRead = true;
            }
            return item;
          })
      };
    case actionTypes.START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    default:
      return state;
  }
};