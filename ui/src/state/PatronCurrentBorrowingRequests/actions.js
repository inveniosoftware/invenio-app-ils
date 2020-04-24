import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '@config';
import { illBorrowingRequest as BorrowingRequestApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';
import _difference from 'lodash/difference';

const selectQuery = (patronPid, page = 1, size) => {
  const illConfig = invenioConfig.illBorrowingRequests;
  const statuses = _difference(
    illConfig.orderedValidStatuses,
    illConfig.completedStatuses
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
    try {
      const response = await BorrowingRequestApi.list(
        selectQuery(patronPid, page, size)
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
