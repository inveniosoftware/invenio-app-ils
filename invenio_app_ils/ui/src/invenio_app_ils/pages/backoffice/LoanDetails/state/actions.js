import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  ACTION_IS_LOADING,
  ACTION_SUCCESS,
  ACTION_HAS_ERROR,
} from './types';
import { loan as loanApi } from '../../../../common/api';

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

export const assignItemToLoan = (itemId, loanId) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .assignItemToLoan(itemId, loanId)
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
  return async (dispatch, getState) => {
    dispatch({
      type: ACTION_IS_LOADING,
    });
    const stateUserSession = getState().userSession;
    await loanApi
      .postAction(
        url,
        pid,
        loan,
        stateUserSession.userPid,
        stateUserSession.locationPid
      )
      .then(details => {
        dispatch({
          type: ACTION_SUCCESS,
          payload: details.data,
        });
      })
      .catch(error => {
        dispatch({
          type: ACTION_HAS_ERROR,
          payload: error,
        });
      });
  };
};
