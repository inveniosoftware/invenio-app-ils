import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '@config';
import { loan as loanApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';

export const fetchPendingLoans = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await loanApi.list(
        loanApi
          .query()
          .withDocPid(documentPid)
          .withState(invenioConfig.circulation.loanRequestStates)
          .qs()
      );

      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
