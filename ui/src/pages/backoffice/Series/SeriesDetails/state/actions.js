import { series as seriesApi } from '@api';
import { delay } from '@api/utils';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
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

export const deleteSeries = seriesPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await seriesApi.delete(seriesPid);
      await delay();
      dispatch({
        type: DELETE_SUCCESS,
        payload: { seriesPid: seriesPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The series ${seriesPid} has been deleted.`
        )
      );
      goTo(BackOfficeRoutes.seriesList);
    } catch (error) {
      dispatch({
        type: DELETE_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const fetchSeriesDetails = seriesPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await seriesApi
      .get(seriesPid)
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
