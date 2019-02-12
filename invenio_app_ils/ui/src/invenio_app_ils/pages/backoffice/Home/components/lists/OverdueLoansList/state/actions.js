import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '../../../../../../../common/api';

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
