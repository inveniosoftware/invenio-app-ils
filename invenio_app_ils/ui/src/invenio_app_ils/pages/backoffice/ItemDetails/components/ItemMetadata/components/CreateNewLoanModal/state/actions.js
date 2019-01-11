import { IS_LOADING, SUCCESS, HAS_ERROR, RESET_STATE } from './types';
import { loan as loanApi } from '../../../../../../../../common/api/loan';

export const createNewLoanForItem = (itemPid, loan) => {
  return async (dispatch, getState) => {
    dispatch({
      type: IS_LOADING,
    });
    const stateUserSession = getState().userSession;
    await loanApi
      .postAction(
        `${loanApi.url}create`,
        itemPid,
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

export const resetNewLoanState = () => ({ type: RESET_STATE });
