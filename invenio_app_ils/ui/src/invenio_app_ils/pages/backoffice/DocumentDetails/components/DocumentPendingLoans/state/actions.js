import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '../../../../../../common/api';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';

export const fetchPendingLoans = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await loanApi
      .list(
        loanApi
          .query()
          .withDocPid(documentPid)
          .withState('PENDING')
          .qs()
      )
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
