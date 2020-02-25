import { eitem as eitemApi } from '@api';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { ES_DELAY } from '@config';
import { goTo } from '@history';
import { BackOfficeRoutes } from '@routes/urls';
import {
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
} from './types';

export const deleteEItem = eitemPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await eitemApi.delete(eitemPid);
      dispatch({
        type: DELETE_SUCCESS,
        payload: { eitemPid: eitemPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The EItem ${eitemPid} has been deleted.`
        )
      );
      setTimeout(() => {
        goTo(BackOfficeRoutes.eitemsList);
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

export const fetchEItemDetails = eitemPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await eitemApi.get(eitemPid);
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
