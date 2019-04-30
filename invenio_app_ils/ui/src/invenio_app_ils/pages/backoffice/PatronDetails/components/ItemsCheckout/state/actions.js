import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';
import { loan as loanApi } from '../../../../../../common/api';
import { ApiURLS } from '../../../../../../common/api/urls';
import { sessionManager } from '../../../../../../authentication/services';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../../../common/components/Notifications';

export const checkoutItem = (item, patronPid, shouldForceCheckout = false) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    const loan = {
      metadata: {
        item_pid: item.item_pid,
        patron_pid: patronPid,
        document_pid: item.metadata.document_pid,
      },
    };
    await loanApi
      .postAction(
        ApiURLS.loans.create,
        item.item_pid,
        loan,
        currentUser.id,
        currentUser.locationPid,
        {
          force_checkout: shouldForceCheckout,
        }
      )
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
        dispatch(
          sendSuccessNotification(
            'Loan Created',
            'The new loan was successfully created.'
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
