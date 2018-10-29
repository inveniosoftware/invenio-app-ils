import { LOAN_LIST, IS_LOADING, HAS_ERROR } from './types';
import { loan } from 'common/api';

export const fetchLoanList = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
      payload: {},
    });

    let response = await loan.getList().catch(reason => {
      dispatch({
        type: HAS_ERROR,
        payload: reason,
      });
    });

    if (response) {
      dispatch({
        type: LOAN_LIST,
        payload: response.data,
      });
    }
  };
};
