import { IS_LOADING, ITEM_DETAILS, HAS_ERROR } from './types';
import { item } from 'common/api';

export const fetchItemDetails = itemId => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
      payload: {},
    });

    let response = await item.getRecord(itemId).catch(reason => {
      dispatch({
        type: HAS_ERROR,
        payload: reason,
      });
    });

    if (response) {
      dispatch({
        type: ITEM_DETAILS,
        payload: response.data,
      });
    }
  };
};
