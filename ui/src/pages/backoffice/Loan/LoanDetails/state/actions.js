import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '@api';
import {
  sendSuccessNotification,
  sendErrorNotification,
} from '@components/Notifications';

export const fetchLoanDetails = loanPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await loanApi.get(loanPid);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
    }
  };
};

export const performLoanAction = (
  actionURL,
  documentPid,
  patronPid,
  { itemPid = null, cancelReason = null } = {}
) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await loanApi.doAction(
        actionURL,
        documentPid,
        patronPid,
        {
          itemPid: itemPid,
          cancelReason: cancelReason,
        }
      );
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
      const loanPid = response.data.pid;
      dispatch(
        sendSuccessNotification(
          'Successful loan action!',
          `The loan action was successful for loan PID ${loanPid}.`
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
