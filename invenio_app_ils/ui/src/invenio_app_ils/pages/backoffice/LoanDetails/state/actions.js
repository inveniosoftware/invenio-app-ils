import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '../../../../common/api';
import { sessionManager } from '../../../../authentication/services';
import {
  sendSuccessNotification,
  sendErrorNotification,
} from '../../../../common/components/Notifications';

export const fetchLoanDetails = loanPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await loanApi
      .get(loanPid)
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

export const performLoanAction = (pid, loan, url) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    await loanApi
      .postAction(url, pid, loan, currentUser.id, currentUser.locationPid)
      .then(details => {
        dispatch({
          type: SUCCESS,
          payload: details.data,
        });
        dispatch(
          sendSuccessNotification(
            'Successful loan action!',
            `The loan action was successful for loan PID ${pid}.`
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
