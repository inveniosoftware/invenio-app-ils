import { location as locationApi } from '@api';
import { ES_DELAY } from '@config';
import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
} from './types';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';

export const fetchAllLocations = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await locationApi
      .list()
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

export const deleteLocation = locationPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    await locationApi
      .delete(locationPid)
      .then(response => {
        dispatch({
          type: DELETE_SUCCESS,
          payload: { locationPid: locationPid },
        });
        dispatch(
          sendSuccessNotification(
            'Success!',
            `The location ${locationPid} has been deleted.`
          )
        );
        setTimeout(() => {
          dispatch(fetchAllLocations());
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
