import { illBorrowingRequest as borrowingRequestApi } from '@api';
import { delay } from '@api/utils';
import { sendSuccessNotification } from '@components/Notifications';
import { SUCCESS as FETCH_SUCCESS } from '../../../state/types';
import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';

export const borrowingRequestPatronLoanCreate = (
  borrowingRequestPid,
  loanStartDate,
  loanEndDate
) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await borrowingRequestApi.patronLoanCreate(
        borrowingRequestPid,
        loanStartDate,
        loanEndDate
      );
      await delay();
      dispatch({
        type: SUCCESS,
      });
      // the response contains the updated borrowing request,
      // push it to the fetch redux action to re-render the component
      dispatch({
        type: FETCH_SUCCESS,
        payload: response.data,
      });
      dispatch(
        sendSuccessNotification('Success!', 'The new loan has been created.')
      );
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
    }
  };
};
