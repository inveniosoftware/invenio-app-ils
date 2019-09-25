import { HAS_ERROR, IS_LOADING } from '../state/types';
import { sessionManager } from '../../../../../../authentication/services';
import { DateTime } from 'luxon';
import { toShortDate } from '../../../../../../common/api/date';
import { loan as loanApi } from '../../../../../../common/api';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../../../common/components/Notifications';

export const requestLoanForDocument = (
  documentPid,
  { requestEndDate = null, deliveryMethod = null } = {}
) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const today = toShortDate(DateTime.local());
    try {
      await loanApi.doRequest(documentPid, sessionManager.user.id, {
        requestExpireDate: requestEndDate,
        requestStartDate: today,
        deliveryMethod: deliveryMethod,
      });
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
