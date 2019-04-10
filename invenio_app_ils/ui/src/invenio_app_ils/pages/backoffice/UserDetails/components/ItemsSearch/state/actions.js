import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  QUERY_STRING_UPDATE,
  CLEAR_SEARCH,
} from './types';
import {
  IS_LOADING as CURRENT_LOANS_LOADING,
  SUCCESS as CURRENT_LOANS_SUCCESS,
} from '../../PatronCurrentLoans/state/types';
import { item as itemApi } from '../../../../../../common/api';
import { fetchPatronCurrentLoans } from '../../PatronCurrentLoans/state/actions';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';
import store from '../../../../../../store';

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

export const fetchUpdatedCurrentLoans = patronPid => {
  return fetchPatronCurrentLoans(patronPid, 3000);
};
