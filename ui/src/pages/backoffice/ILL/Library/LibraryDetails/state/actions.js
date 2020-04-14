import { illLibrary as libraryApi } from '@api';
import { delay } from '@api/utils';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
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

    try {
      await libraryApi.delete(pid);
      await delay();
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
      goTo(ILLRoutes.libraryList);
    } catch (error) {
      dispatch({
        type: DELETE_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
