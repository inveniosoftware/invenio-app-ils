import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '@api';
import { invenioConfig } from '@config';
import { sendErrorNotification } from '@components/Notifications';

export const fetchDocumentStats = ({ documentPid, fromDate, toDate }) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .list(
        loanApi
          .query()
          .withDocPid(documentPid)
          .withState(invenioConfig.circulation.loanCompletedStates)
          .withStartDate({
            fromDate: fromDate,
            toDate: toDate,
          })
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
