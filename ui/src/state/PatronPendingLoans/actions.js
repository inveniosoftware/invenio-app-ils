import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '@config';
import { loan as loanApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';

const selectQuery = (patronPid, page = 1, size) => {
  return loanApi
    .query()
    .withPatronPid(patronPid)
    .withState(invenioConfig.circulation.loanRequestStates)
    .withSize(size)
    .withPage(page)
    .qs();
};

export const fetchPatronPendingLoans = (
  patronPid,
  page,
  size = invenioConfig.defaultResultsSize
) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .list(selectQuery(patronPid, page, size))
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
