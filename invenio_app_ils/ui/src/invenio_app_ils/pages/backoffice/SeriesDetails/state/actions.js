import {
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
} from './types';
import { ES_DELAY } from '../../../../common/config';
import { goTo } from '../../../../history';
import { series as seriesApi } from '../../../../common/api';
import { BackOfficeRoutes } from '../../../../routes/urls';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../common/components/Notifications';

export const deleteSeries = seriesPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await seriesApi.delete(seriesPid);
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
      setTimeout(() => {
        goTo(BackOfficeRoutes.seriesList);
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

export const updateSeries = (seriesPid, path, value) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await seriesApi
      .patch(seriesPid, [
        {
          op: 'replace',
          path: path,
          value: value,
        },
      ])
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
        dispatch(
          sendSuccessNotification(
            'Success!',
            `The series ${seriesPid} has been updated.`
          )
        );
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
