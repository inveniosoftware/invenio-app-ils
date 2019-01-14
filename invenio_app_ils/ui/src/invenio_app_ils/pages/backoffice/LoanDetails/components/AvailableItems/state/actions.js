import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { item as itemApi } from '../../../../../../common/api';
import { config } from '../config';

export const fetchAvailableItems = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await itemApi
      .fetchItemsByDocPid(documentPid, config)
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
