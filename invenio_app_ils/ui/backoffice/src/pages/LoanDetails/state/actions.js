import {
  SET_LOAN_FETCH_LOADING,
  SET_LOAN_FETCH_DETAILS,
  SET_LOAN_ACTION_LOADING,
  SET_LOAN_ACTION,
  SET_LOAN_ACTION_ERROR,
} from './types';
import { fetchLoan, postLoan } from './api';
import { serializeLoanDetails } from './selectors';

export const fetchLoanDetails = loanid => {
  return async dispatch => {
    dispatch({
      type: SET_LOAN_FETCH_LOADING,
      payload: {},
    });

    let details = await fetchLoan(loanid).catch(reason => {
      dispatch({
        type: SET_LOAN_ACTION_ERROR,
        payload: loanid,
      });
    });
    if (details) {
      dispatch({
        type: SET_LOAN_FETCH_DETAILS,
        payload: serializeLoanDetails(details.data),
      });
    }
  };
};

export const postLoanAction = (url, data) => {
  return async dispatch => {
    dispatch({
      type: SET_LOAN_ACTION_LOADING,
      payload: {},
    });

    let details = await postLoan(url, data).catch(reason => {
      dispatch({
        type: SET_LOAN_ACTION_ERROR,
        payload: reason,
      });
    });
    if (details) {
      dispatch({
        type: SET_LOAN_ACTION,
        payload: serializeLoanDetails(details.data),
      });
    }
  };
};
