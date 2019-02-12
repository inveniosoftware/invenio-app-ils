import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '../../../../../../../common/api';
import { DateTime } from 'luxon';
import { toShortDate } from '../../../../../../../common/api/date';

export const fetchIdlePendingLoans = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    console.log('-------');
    console.log(
      loanApi
        .query()
        .withState('PENDING')
        .withUpdated({ to: toShortDate(DateTime.local().minus({ days: 10 })) })
        .qs()
    );
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
      });
  };
};
