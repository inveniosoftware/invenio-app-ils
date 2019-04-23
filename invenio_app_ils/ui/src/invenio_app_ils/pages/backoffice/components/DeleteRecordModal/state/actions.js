import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { sendErrorNotification } from '../../../../../common/components/Notifications';

export const fetchReferences = checkRefs => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await checkRefs()
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
