import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '../../../../../../../../common/api/loans/loan';
import { sessionManager } from '../../../../../../../../authentication/services';
import {
  sendSuccessNotification,
  sendErrorNotification,
} from '../../../../../../../../common/components/Notifications';

export const requestNewLoanForBook = (docPid, loan) => {
  return async (dispatch, getState) => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    await loanApi
      .postAction(
        `${loanApi.url}request`,
        docPid,
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
            'Loan Requested',
            `The loan request was successful for document PID '${docPid}'.`
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
