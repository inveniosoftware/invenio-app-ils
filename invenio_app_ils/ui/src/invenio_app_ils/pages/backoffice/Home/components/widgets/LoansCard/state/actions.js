import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '../../../../../../../common/config';
import { loan as loanApi } from '../../../../../../../common/api';
import { sendErrorNotification } from '../../../../../../../common/components/Notifications';

export const fetchPendingLoans = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .count(
        loanApi
          .query()
          .withState(invenioConfig.circulation.loanRequestStates)
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
