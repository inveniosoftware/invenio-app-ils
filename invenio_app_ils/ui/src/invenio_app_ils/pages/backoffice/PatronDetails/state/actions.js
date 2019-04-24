import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { patron } from '../../../../common/api';
import { sendErrorNotification } from '../../../../common/components/Notifications';

export const fetchPatronDetails = patronPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await patron
      .get(patronPid)
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
