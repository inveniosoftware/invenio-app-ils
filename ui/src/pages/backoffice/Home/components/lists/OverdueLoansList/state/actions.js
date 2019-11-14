import { invenioConfig } from '@config';
import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';

export const fetchOverdueLoans = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await loanApi
      .list(
        loanApi
          .query()
          .overdue()
          .withState(invenioConfig.circulation.loanActiveStates)
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
