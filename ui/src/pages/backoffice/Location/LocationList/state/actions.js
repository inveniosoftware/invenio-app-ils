import { location as locationApi } from '@api';
import { delay } from '@api/utils';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import {
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
} from './types';

export const fetchAllLocations = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await locationApi.list();
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

export const deleteLocation = locationPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });
    try {
      await locationApi.delete(locationPid);
      await delay();
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
      dispatch(fetchAllLocations());
    } catch (error) {
      dispatch({
        type: DELETE_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
