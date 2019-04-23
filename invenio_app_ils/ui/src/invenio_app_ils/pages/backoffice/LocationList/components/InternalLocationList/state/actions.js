import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
} from './types';
import { internalLocation as internalLocationApi } from '../../../../../../common/api';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../../../common/components/Notifications';

export const fetchInternalLocations = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await internalLocationApi
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

export const deleteInternalLocation = url => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    await internalLocationApi
      .del(url)
      .then(response => {
        dispatch({
          type: DELETE_SUCCESS,
          payload: response.data,
        });
        dispatch(
          sendSuccessNotification('Success!', `The location has been deleted.`)
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
