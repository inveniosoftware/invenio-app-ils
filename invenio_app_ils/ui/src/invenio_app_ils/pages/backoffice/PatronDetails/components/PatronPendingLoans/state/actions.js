import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  CHANGE_SORT_BY,
  CHANGE_SORT_ORDER,
} from './types';
import { loan as loanApi } from '../../../../../../common/api';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';

export const fetchPatronPendingLoans = patronPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .list(
        loanApi
          .query()
          .withPatronPid(patronPid)
          .withState('PENDING')
          .qs()
      )
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
        dispatch(sendErrorNotification(error));
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
      getState().patronPendingLoans.sortBy === 'transaction_date'
        ? 'start_date'
        : 'transaction_date';

    dispatch({
      type: CHANGE_SORT_BY,
      payload: newSortBy,
    });

    await dispatch(
      fetchPatronPendingLoans(documentPid, itemPid, loanState, patronPid)
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
      getState().patronPendingLoans.sortOrder === 'asc' ? 'desc' : 'asc';

    dispatch({
      type: CHANGE_SORT_ORDER,
      payload: newSortOrder,
    });

    await dispatch(
      fetchPatronPendingLoans(documentPid, itemPid, loanState, patronPid)
    );
  };
};
