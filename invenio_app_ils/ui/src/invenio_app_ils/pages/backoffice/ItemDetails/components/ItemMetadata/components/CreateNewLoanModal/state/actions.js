import { IS_LOADING, SUCCESS, HAS_ERROR, RESET_STATE } from './types';
import { loan as loanApi } from '../../../../../../../../common/api/loans/loan';
import { ApiURLS } from '../../../../../../../../common/api/urls';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../../../../../common/components/Notifications';
import { sessionManager } from '../../../../../../../../authentication/services';

export const createNewLoanForItem = (itemPid, loan) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    await loanApi
      .postAction(
        ApiURLS.loans.create,
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
        dispatch(
          sendSuccessNotification(
            'Success!',
            `The loan has been assigned. You can now view the loan details.`
          )
        );
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
