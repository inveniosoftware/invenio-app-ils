import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi, serializeLoan } from '../../../../../../common/api';

export const fetchPendingLoans = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await loanApi
      .fetchLoans(documentPid, null, null, null, null, 'state:PENDING', null)
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
