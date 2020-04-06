import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';
import { sendErrorNotification } from '@components/Notifications';
import { acqOrder as orderApi } from '@api';

export const fetchOrderDetails = pid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await orderApi.get(pid);
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
