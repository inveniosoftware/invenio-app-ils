import {
  SET_LOAN_FETCH_LOADING,
  LOAN_FETCH_DETAILS_SUCCESS,
  SET_LOAN_ACTION_LOADING,
  LOAN_ACTION_SUCCESS,
  SET_LOAN_ACTION_ERROR,
} from './types';
import { loan } from 'common/api';
import { serializeLoanDetails } from './selectors';

export const fetchLoanDetails = loanId => {
  return dispatch => {
    dispatch({
      type: SET_LOAN_FETCH_LOADING,
    });

    return loan
      .getRecord(loanId)
      .then(details =>
        dispatch({
          type: LOAN_FETCH_DETAILS_SUCCESS,
          payload: serializeLoanDetails(details.data),
        })
      )
      .catch(reason => {
        dispatch({
          type: SET_LOAN_ACTION_ERROR,
          payload: loanId,
        });
      });
  };
};

export const postLoanAction = (loanId, data) => {
  return async dispatch => {
    dispatch({
      type: SET_LOAN_ACTION_LOADING,
    });

    return loan
      .postAction(loanId, data)
      .then(details =>
        dispatch({
          type: LOAN_ACTION_SUCCESS,
          payload: serializeLoanDetails(details.data),
        })
      )
      .catch(reason => {
        dispatch({
          type: SET_LOAN_ACTION_ERROR,
          payload: reason,
        });
      });
  };
};
