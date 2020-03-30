import { item as itemApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';
import {
  CLEAR_SEARCH,
  HAS_ERROR,
  IS_LOADING,
  QUERY_STRING_UPDATE,
  SUCCESS,
} from './types';

export const fetchItems = barcode => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await itemApi
      .list(
        itemApi
          .query()
          .withBarcode(barcode)
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

export const updateQueryString = queryString => {
  return dispatch => {
    dispatch({
      type: QUERY_STRING_UPDATE,
      queryString: queryString,
    });
  };
};

export const clearResults = () => {
  return dispatch => {
    dispatch({
      type: CLEAR_SEARCH,
    });
  };
};
