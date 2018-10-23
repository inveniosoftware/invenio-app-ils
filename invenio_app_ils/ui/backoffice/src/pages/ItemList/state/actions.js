import { ITEM_LIST, ITEM_LIST_LOADING, ITEM_LIST_ERROR } from './types';
import { fetchList } from '../../../common/api';

export const fetchItemList = () => {
  return async dispatch => {
    dispatch({
      type: ITEM_LIST_LOADING,
      payload: {},
    });

    let itemList = await fetchList('/items/').catch(reason => {
      dispatch({
        type: ITEM_LIST_ERROR,
        payload: reason,
      });
    });
    console.log(itemList);
    if (itemList) {
      dispatch({
        type: ITEM_LIST,
        payload: itemList.data,
      });
    }
  };
};
