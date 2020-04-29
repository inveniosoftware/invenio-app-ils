import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '@api';
import { invenioConfig } from '@config';
import { sendErrorNotification } from '@components/Notifications';

export const fetchPastLoans = itemPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const loanStates = invenioConfig.circulation.loanCompletedStates;
    await loanApi
      .list(
        loanApi
          .query()
          .withItemPid(itemPid)
          .withState(loanStates)
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
