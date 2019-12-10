import {
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
} from './types';
import { ES_DELAY } from '@config';
import { goTo } from '@history';
import { library as librayApi } from '@api';
import { BackOfficeRoutes } from '@routes/urls';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';

export const fetchLibraryDetails = libraryPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await librayApi
      .get(libraryPid)
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: HAS_ERROR,
          payload: error,
        });
        dispatch(sendErrorNotification(error));
      });
  };
};

export const deleteLibrary = libraryPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await librayApi.delete(libraryPid);
      dispatch({
        type: DELETE_SUCCESS,
        payload: { libraryPid: libraryPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The ill${libraryPid} has been deleted.`
        )
      );
      setTimeout(() => {
        goTo(BackOfficeRoutes.illList);
      }, ES_DELAY);
    } catch (error) {
      dispatch({
        type: DELETE_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
