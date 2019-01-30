import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi, serializeLoan } from '../../../../../../common/api';

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
          payload: response.data.hits.hits.map(hit => serializeLoan(hit)),
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
