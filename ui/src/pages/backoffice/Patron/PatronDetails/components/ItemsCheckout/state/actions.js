import { loan as loanApi } from '@api';
import { delay } from '@api/utils';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { fetchPatronCurrentLoans } from '@state/PatronCurrentLoans/actions';
import { IS_LOADING as CURRENT_LOANS_IS_LOADING } from '@state/PatronCurrentLoans/types';
import { CLEAR_SEARCH } from '../../ItemsSearch/state/types';
import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';

export const checkoutItem = (
  documentPid,
  itemPid,
  patronPid,
  force = false
) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await loanApi.doCheckout(
        documentPid,
        itemPid,
        patronPid,
        { force: force }
      );
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
      dispatch({
        type: CLEAR_SEARCH,
      });
      // put the current loans into loading state until ES updates
      dispatch({
        type: CURRENT_LOANS_IS_LOADING,
      });
      await delay();
      dispatch(fetchPatronCurrentLoans(patronPid));
      dispatch(
        sendSuccessNotification(
          'Loan Created',
          'The new loan was successfully created.'
        )
      );
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
