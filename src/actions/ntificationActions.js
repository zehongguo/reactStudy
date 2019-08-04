import actionTypes from './actionTypes';
import {
  getNotificationsList,
} from '../server';

export const getContificationList = (id) => (
  dispatch => {
    dispatch(startLoading());
    getNotificationsList(id)
      .then((data) => {
        dispatch({
          type: actionTypes.GET_CONTIFICATION_LIST,
          payload: {
            data
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

export const markReadById = (id) => (
  dispatch => {
    dispatch(startLoading());
    setTimeout(() => {
      dispatch({
        type: actionTypes.MARK_READ_BY_ID,
        payload: {
          id
        }
      });
    }, 1000);
  }
);
const startLoading = () => {
  return {
    type: actionTypes.START_LOADING
  };
};


export const markAllRead = () => (
  dispatch => {
    dispatch(startLoading());
    setTimeout(() => {
      dispatch({
        type: actionTypes.MARK_ALL_READ,
      });
    }, 1000);

  }
);