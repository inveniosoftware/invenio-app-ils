import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { series as seriesApi } from '@api';

export const fetchSeriesDetails = pid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await seriesApi.get(pid);
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
