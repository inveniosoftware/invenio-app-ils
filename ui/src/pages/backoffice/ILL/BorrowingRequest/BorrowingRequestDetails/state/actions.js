import { illBorrowingRequest as borrowingRequestApi } from '@api';
import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';

export const fetchBorrowingRequestDetails = borrowingRequestPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await borrowingRequestApi.get(borrowingRequestPid);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
    }
  };
};
