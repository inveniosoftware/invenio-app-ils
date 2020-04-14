import { internalLocation as internalLocationApi } from '@api';
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

export const fetchInternalLocations = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await internalLocationApi.list();
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

export const deleteInternalLocation = ilocPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await internalLocationApi.delete(ilocPid);
      await delay();
      dispatch({
        type: DELETE_SUCCESS,
        payload: { internalLocationPid: ilocPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The internal location ${ilocPid} has been deleted.`
        )
      );
      dispatch(fetchInternalLocations());
    } catch (error) {
      dispatch({
        type: DELETE_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
