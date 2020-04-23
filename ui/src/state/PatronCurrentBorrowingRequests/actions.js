import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '@config';
import { illBorrowingRequest as BorrowingRequestApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';

const selectQuery = (patronPid, page = 1, size) => {
  const statuses = invenioConfig.illBorrowingRequests.pendingStatuses.concat(
    invenioConfig.illBorrowingRequests.requestedStatuses.concat(
      invenioConfig.illBorrowingRequests.activeStatuses
    )
  );
  return BorrowingRequestApi.query()
    .withPatron(patronPid)
    .withState(statuses)
    .withSize(size)
    .withPage(page)
    .qs();
};

export const fetchPatronCurrentBorrowingRequests = (
  patronPid,
  page,
  size = invenioConfig.defaultResultsSize
) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await BorrowingRequestApi.list(selectQuery(patronPid, page, size))
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
