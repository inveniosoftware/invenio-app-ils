import {
  IS_ACTION_LOADING,
  IS_LOAN_LOADING,
  LOAN_ACTION_SUCCESS,
  LOAN_DETAILS_SUCCESS,
  HAS_ERROR,
} from './types';
import { loan } from 'common/api';
import { serializeLoanDetails } from './selectors';

export const fetchLoanDetails = loanId => {
  return async dispatch => {
    dispatch({
      type: IS_LOAN_LOADING,
    });

    await loan
      .getRecord(loanId)
      .then(response => {
        dispatch({
          type: LOAN_DETAILS_SUCCESS,
          payload: serializeLoanDetails(response.data),
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

export const postLoanAction = (url, data) => {
  return async dispatch => {
    dispatch({
      type: IS_ACTION_LOADING,
    });

    await loan
      .postAction(url, data)
      .then(details => {
        dispatch({
          type: LOAN_ACTION_SUCCESS,
          payload: serializeLoanDetails(details.data),
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
