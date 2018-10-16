import { ITEM_LOADING, ITEM_DETAILS, ITEM_ERROR } from './types';
import { fetchItem } from './api';

export const fetchItemDetails = itemid => {
  return async dispatch => {
    dispatch({
      type: ITEM_LOADING,
      payload: {},
    });

    let details = await fetchItem(itemid).catch(reason => {
      dispatch({
        type: ITEM_ERROR,
        payload: reason,
      });
    });
    if (details) {
      dispatch({
        type: ITEM_DETAILS,
        payload: details.data,
      });
    }
  };
};
