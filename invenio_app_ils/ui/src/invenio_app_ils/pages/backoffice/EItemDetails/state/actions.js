import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { eitem as eitemApi } from '../../../../common/api';
import { sendErrorNotification } from '../../../../common/components/Notifications';

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
