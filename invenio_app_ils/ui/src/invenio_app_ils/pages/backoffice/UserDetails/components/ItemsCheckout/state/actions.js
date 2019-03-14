import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';
import { loan as loanApi } from '../../../../../../common/api';
import { ApiURLS } from '../../../../../../common/api/urls';
import { sessionManager } from '../../../../../../authentication/services';

export const checkoutItem = (item, patron_pid) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    await loanApi
      .postAction(
        `${ApiURLS.loans.list}create`,
        item.item_pid,
        { item_pid: item.item_pid, patron_pid: String(patron_pid) },
        currentUser.id,
        currentUser.locationPid
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
      });
  };
};
