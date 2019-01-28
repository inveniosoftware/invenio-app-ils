import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  CHANGE_SORT_BY,
  CHANGE_SORT_ORDER,
} from './types';
import { loan as loanApi } from '../../../../../../common/api';
import { serializeLoan } from '../../../../../../common/api';

export const fetchPatronLoans = (
  documentPid,
  itemPid,
  loanState,
  patronPid
) => {
  return async (dispatch, getState) => {
    dispatch({
      type: IS_LOADING,
    });

    const sortBy = getState().patronLoans.sortBy;
    const sortOrder = getState().patronLoans.sortOrder;

    await loanApi
      .fetchLoans(
        documentPid,
        itemPid,
        sortBy,
        sortOrder,
        patronPid,
        `state:${loanState}`,
        null
      )
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data.hits.hits.map(hit => serializeLoan(hit)),
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

export const patronLoansChangeSortBy = (
  documentPid,
  itemPid,
  loanState,
  patronPid
) => {
  return async (dispatch, getState) => {
    const newSortBy =
      getState().patronLoans.sortBy === 'transaction_date'
        ? 'start_date'
        : 'transaction_date';

    dispatch({
      type: CHANGE_SORT_BY,
      payload: newSortBy,
    });

    await dispatch(
      fetchPatronLoans(documentPid, itemPid, loanState, patronPid)
    );
  };
};

export const patronLoansChangeSortOrder = (
  documentPid,
  itemPid,
  loanState,
  patronPid
) => {
  return async (dispatch, getState) => {
    const newSortOrder =
      getState().patronLoans.sortOrder === 'asc' ? 'desc' : 'asc';

    dispatch({
      type: CHANGE_SORT_ORDER,
      payload: newSortOrder,
    });

    await dispatch(
      fetchPatronLoans(documentPid, itemPid, loanState, patronPid)
    );
  };
};
