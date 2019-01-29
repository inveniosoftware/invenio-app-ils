import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { location } from '../../../../common/api';

export const fetchLocations = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await location
      .get()
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
