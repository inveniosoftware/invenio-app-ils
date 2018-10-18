import {
  SET_LOAN_FETCH_LOADING,
  LOAN_FETCH_DETAILS_SUCCESS,
  SET_LOAN_ACTION_LOADING,
  LOAN_ACTION_SUCCESS,
  SET_LOAN_ACTION_ERROR,
} from './types';
import { fetchRecord, postRecord } from '../../../common/api';
import { serializeLoanDetails } from './selectors';

export const fetchLoanDetails = loanid => {
  return dispatch => {
    dispatch({
      type: SET_LOAN_FETCH_LOADING,
    });

    return fetchRecord('/circulation/loans', loanid)
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

    return postRecord(url, data)
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
