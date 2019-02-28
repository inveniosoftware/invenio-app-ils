import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { user } from '../../../../../../common/api';

export const fetchUserDetails = userPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await user
      .get(userPid)
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
      });
  };
};
