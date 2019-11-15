import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { document as documentApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';

export const fetchSeriesDocuments = (seriesPid, moi) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await documentApi
      .list(
        documentApi
          .query()
          .withSeriesPid(seriesPid, moi)
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
        dispatch(sendErrorNotification(error));
      });
  };
};
