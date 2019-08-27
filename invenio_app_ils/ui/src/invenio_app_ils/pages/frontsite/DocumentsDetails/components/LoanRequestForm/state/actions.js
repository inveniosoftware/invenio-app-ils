import { HAS_ERROR, IS_LOADING } from '../state/types';
import { sessionManager } from '../../../../../../authentication/services';
import { loan as loanApi } from '../../../../../../common/api';
import { ApiURLS } from '../../../../../../common/api/urls';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../../../common/components/Notifications';

export const requestLoanForDocument = (docPid, loanData) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    try {
      await loanApi.postAction(
        ApiURLS.loans.request,
        docPid,
        loanData,
        currentUser.id,
        currentUser.locationPid,
        {
          start_date: loanData.metadata.start_date,
          end_date: loanData.metadata.end_date,
        }
      );
      dispatch(
        sendSuccessNotification(
          'Success!',
          `You have requested to loan this book.`
        )
      );
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
