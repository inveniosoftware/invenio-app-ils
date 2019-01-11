import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  CHANGE_SORT_BY,
  CHANGE_SORT_ORDER,
} from './types';
import { item as itemApi } from '../../../../../../common/api';

export const fetchDocumentItems = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await itemApi
      .fetchItemsByDocPid(documentPid)
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data.hits.hits,
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

export const documentItemsChangeSortBy = documentPid => {
  return async (dispatch, getState) => {
    const newSortBy =
      getState().documentItems.sortBy === 'transaction_date'
        ? 'start_date'
        : 'transaction_date';

    dispatch({
      type: CHANGE_SORT_BY,
      payload: newSortBy,
    });

    await dispatch(fetchDocumentItems(documentPid));
  };
};

export const documentItemsChangeSortOrder = documentPid => {
  return async (dispatch, getState) => {
    const newSortOrder =
      getState().documentItems.sortOrder === 'asc' ? 'desc' : 'asc';

    dispatch({
      type: CHANGE_SORT_ORDER,
      payload: newSortOrder,
    });

    await dispatch(fetchDocumentItems(documentPid));
  };
};
