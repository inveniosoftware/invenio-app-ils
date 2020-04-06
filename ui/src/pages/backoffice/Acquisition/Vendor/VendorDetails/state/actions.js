import {
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
} from './types';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { acqVendor as vendorApi } from '@api';

export const fetchVendorDetails = pid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await vendorApi.get(pid);
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

export const deleteVendor = pid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    await vendorApi
      .delete(pid)
      .then(response => {
        dispatch({
          type: DELETE_SUCCESS,
          payload: { pid: pid },
        });
        dispatch(
          sendSuccessNotification(
            'Success!',
            `The vendor ${pid} has been deleted.`
          )
        );
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
