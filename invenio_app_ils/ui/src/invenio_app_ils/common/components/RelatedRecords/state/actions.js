import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { related as relatedApi } from '../../../api';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../Notifications';

export const fetchRelatedRecords = (pid, pidType, size) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await relatedApi
      .get(pid, pidType, size)
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

export const updateRelatedRecords = (pid, pidType, data, size) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await relatedApi
      .post(pid, pidType, data, size)
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
        dispatch(
          sendSuccessNotification(
            'Success!',
            'Related records successfully updated.'
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
