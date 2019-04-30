import { IS_LOADING, SUCCESS, HAS_ERROR, RESET_STATE } from './types';
import { loan as loanApi } from '../../../../../../../../common/api/loans/loan';
import { ApiURLS } from '../../../../../../../../common/api/urls';
import { sendErrorNotification } from '../../../../../../../../common/components/Notifications';
import { sessionManager } from '../../../../../../../../authentication/services';

export const createNewLoanForItem = (itemPid, loan) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    await loanApi
      .postAction(
        ApiURLS.loans.request,
        itemPid,
        loan,
        currentUser.id,
        currentUser.locationPid
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
