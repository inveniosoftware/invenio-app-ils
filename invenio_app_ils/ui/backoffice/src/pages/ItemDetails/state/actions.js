import { IS_LOADING, ITEM_DETAILS, ITEM_DETAILS_HAS_ERROR } from './types';
import { item } from 'common/api';

export const fetchItemDetails = itemId => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
      payload: {},
    });

    await item
      .getRecord(itemId)
      .then(response => {
        dispatch({
          type: ITEM_DETAILS,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: ITEM_DETAILS_HAS_ERROR,
          payload: error,
        });
      });
  };
};
