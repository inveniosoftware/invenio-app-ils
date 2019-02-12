import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { document as documentApi } from '../../../../../../../common/api';

export const fetchRequestedWithAvailableItems = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await documentApi
      .count(
        documentApi
          .query()
          .withAvailableItems()
          .withPendingLoans()
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
      });
  };
};
