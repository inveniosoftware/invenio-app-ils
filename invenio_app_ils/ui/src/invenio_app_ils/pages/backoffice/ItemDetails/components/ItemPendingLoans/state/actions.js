import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  CHANGE_SORT_BY,
  CHANGE_SORT_ORDER,
} from './types';
import { loan as loanApi } from '../../../../../../common/api';
import { serializePendingLoan } from './selectors';

export const fetchPendingLoans = (documentPid, itemPid) => {
  return async (dispatch, getState) => {
    dispatch({
      type: IS_LOADING,
    });

    const sortBy = getState().itemPendingLoans.sortBy;
    const sortOrder = getState().itemPendingLoans.sortOrder;

    await loanApi
      .fetchLoans(documentPid, itemPid, sortBy, sortOrder, null, 'PENDING')
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data.hits.hits.map(hit =>
            serializePendingLoan(hit)
          ),
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

export const pendingLoansChangeSortBy = (documentPid, itemPid) => {
  return async (dispatch, getState) => {
    const newSortBy =
      getState().itemPendingLoans.sortBy === 'transaction_date'
        ? 'start_date'
        : 'transaction_date';

    dispatch({
      type: CHANGE_SORT_BY,
      payload: newSortBy,
    });

    await dispatch(fetchPendingLoans(documentPid, itemPid));
  };
};

export const pendingLoansChangeSortOrder = (documentPid, itemPid) => {
  return async (dispatch, getState) => {
    const newSortOrder =
      getState().itemPendingLoans.sortOrder === 'asc' ? 'desc' : 'asc';

    dispatch({
      type: CHANGE_SORT_ORDER,
      payload: newSortOrder,
    });

    await dispatch(fetchPendingLoans(documentPid, itemPid));
  };
};
