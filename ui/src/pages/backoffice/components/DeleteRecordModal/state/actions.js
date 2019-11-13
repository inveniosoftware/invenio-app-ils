import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { sendErrorNotification } from '../../../../../common/components/Notifications';

export const fetchReferences = promiseArray => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const responses = await Promise.all(promiseArray);
      dispatch({
        type: SUCCESS,
        payload: responses.map(resp => resp.data),
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
