import { IS_LOADING, SUCCESS, HAS_ERROR, RESET_STATE } from './types';
import { loan as loanApi } from '../../../../../../../../common/api/loans/loan';
import { ApiURLS } from '../../../../../../../../common/api/urls';
import { sendErrorNotification } from '../../../../../../../../common/components/Notifications';

export const createNewLoanForItem = (itemPid, loan) => {
  return async (dispatch, getState) => {
    dispatch({
      type: IS_LOADING,
    });
    const stateUserSession = getState().userSession;
    await loanApi
      .postAction(
        `${ApiURLS.loans.list}create`,
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
        dispatch(sendErrorNotification(error));
      });
  };
};

export const resetNewLoanState = () => ({ type: RESET_STATE });
