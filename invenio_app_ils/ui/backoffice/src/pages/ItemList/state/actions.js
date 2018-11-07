import { ITEM_LIST, IS_LOADING, ITEM_LIST_HAS_ERROR } from './types';
import { item } from 'common/api';

export const fetchItemList = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
      payload: {},
    });

    await item
      .getList()
      .then(response => {
        dispatch({
          type: ITEM_LIST,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: ITEM_LIST_HAS_ERROR,
          payload: error,
        });
      });
  };
};
