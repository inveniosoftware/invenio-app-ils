import { LOAN_LIST, IS_LOADING, LOAN_LIST_HAS_ERROR } from './types';
import { loan } from 'common/api';

export const fetchLoanList = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
      payload: {},
    });

    await loan
      .getList()
      .then(response => {
        dispatch({
          type: LOAN_LIST,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: LOAN_LIST_HAS_ERROR,
          payload: error,
        });
      });
  };
};
