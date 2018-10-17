import {
  SET_LOAN_FETCH_LOADING,
  LOAN_FETCH_DETAILS_SUCCESS,
  SET_LOAN_ACTION_LOADING,
  LOAN_ACTION_SUCCESS,
  SET_LOAN_ACTION_ERROR,
} from './types';
import { fetchLoan, postLoan } from './api';
import { serializeLoanDetails } from './selectors';

export const fetchLoanDetails = loanid => {
  return dispatch => {
    dispatch({
      type: SET_LOAN_FETCH_LOADING,
    });

    return fetchLoan(loanid)
      .then(details =>
        dispatch({
          type: LOAN_FETCH_DETAILS_SUCCESS,
          payload: serializeLoanDetails(details.data),
        })
      )
      .catch(reason => {
        dispatch({
          type: SET_LOAN_ACTION_ERROR,
          payload: loanid,
        });
      });
  };
};

export const postLoanAction = (url, data) => {
  return async dispatch => {
    dispatch({
      type: SET_LOAN_ACTION_LOADING,
    });

    return postLoan(url, data)
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
