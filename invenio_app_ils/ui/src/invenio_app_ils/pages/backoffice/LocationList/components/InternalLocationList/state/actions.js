import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { internalLocation as internalLocationApi } from '../../../../../../common/api';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';

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
