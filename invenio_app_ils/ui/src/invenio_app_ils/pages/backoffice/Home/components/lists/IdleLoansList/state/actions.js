import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '../../../../../../../common/api';
import { DateTime } from 'luxon';
import { toShortDate } from '../../../../../../../common/api/date';
import { sendErrorNotification } from '../../../../../../../common/components/Notifications';

export const fetchIdlePendingLoans = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .list(
        loanApi
          .query()
          .withState('PENDING')
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
