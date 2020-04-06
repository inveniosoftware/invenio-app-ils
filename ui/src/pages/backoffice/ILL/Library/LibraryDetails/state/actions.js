import { illLibrary as libraryApi } from '@api';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { ES_DELAY } from '@config';
import { goTo } from '@history';
import { ILLRoutes } from '@routes/urls';
import {
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
} from './types';

export const fetchLibraryDetails = pid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await libraryApi.get(pid);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const deleteLibrary = pid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    await libraryApi
      .delete(pid)
      .then(response => {
        dispatch({
          type: DELETE_SUCCESS,
          payload: { pid: pid },
        });
        dispatch(
          sendSuccessNotification(
            'Success!',
            `The library ${pid} has been deleted.`
          )
        );
        setTimeout(() => {
          goTo(ILLRoutes.libraryList);
        }, ES_DELAY);
      })
      .catch(error => {
        dispatch({
          type: DELETE_HAS_ERROR,
          payload: error,
        });
        dispatch(sendErrorNotification(error));
      });
  };
};
