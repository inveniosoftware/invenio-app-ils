import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';
import { stats as statsApi } from '../../../../../../common/api';

export const fetchMostLoanedDocuments = (fromDate, toDate) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await statsApi.getMostLoanedDocuments(fromDate, toDate);
      await dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      await dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      await dispatch(sendErrorNotification(error));
    }
  };
};
