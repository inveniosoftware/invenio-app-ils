import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  QUERY_STRING_UPDATE,
  CLEAR_SEARCH,
} from './types';
import { item as itemApi } from '../../../../../../common/api';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';

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
