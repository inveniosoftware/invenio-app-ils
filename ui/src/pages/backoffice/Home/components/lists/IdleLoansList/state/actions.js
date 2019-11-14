import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '@config';
import { loan as loanApi } from '@api';
import { DateTime } from 'luxon';
import { toShortDate } from '@api/date';
import { sendErrorNotification } from '@components/Notifications';

export const fetchIdlePendingLoans = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .list(
        loanApi
          .query()
          .withState(invenioConfig.circulation.loanRequestStates)
          .withUpdated({
            to: toShortDate(DateTime.local().minus({ days: 10 })),
          })
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
