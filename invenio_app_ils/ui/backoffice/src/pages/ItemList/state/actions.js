import { ITEM_LIST, IS_LOADING, HAS_ERROR } from './types';
import { item } from 'common/api';

export const fetchItemList = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
      payload: {},
    });

    let response = await item.getList().catch(reason => {
      dispatch({
        type: HAS_ERROR,
        payload: reason,
      });
    });

    if (response) {
      dispatch({
        type: ITEM_LIST,
        payload: response.data,
      });
    }
  };
};
