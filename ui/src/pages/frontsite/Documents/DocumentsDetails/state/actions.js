import { IS_LOADING, SUCCESS, HAS_ERROR, SHOW_TAB } from './types';
import { document as documentApi } from '@api';

export const fetchDocumentsDetails = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await documentApi
      .get(documentPid)
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
      });
  };
};

export const showTab = activeIndex => {
  return async dispatch => {
    dispatch({
      type: SHOW_TAB,
      payload: activeIndex,
    });
  };
};
