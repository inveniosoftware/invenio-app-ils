import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '../../../../../../../../common/api/loans/loan';

export const requestNewLoanForBook = (docPid, loan) => {
  return async (dispatch, getState) => {
    dispatch({
      type: IS_LOADING,
    });
    const stateUserSession = getState().userSession;
    await loanApi
      .postAction(
        `${loanApi.url}request`,
        docPid,
        loan,
        stateUserSession.userPid,
        stateUserSession.locationPid
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
