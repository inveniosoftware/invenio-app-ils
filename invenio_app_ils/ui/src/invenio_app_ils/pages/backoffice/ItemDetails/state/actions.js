import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { item } from '../../../../common/api';
import { sendErrorNotification } from '../../../../common/components/Notifications';

export const fetchItemDetails = itemPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await item
      .get(itemPid)
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
