import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { loan as loanApi } from '../../../../../../common/api';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';

export const fetchPatronCurrentLoans = (patronPid, delay = 0) => {
  const fetchLoans = (patronPid, dispatch) => {
    loanApi
      .list(
        loanApi
          .query()
          .withPatronPid(patronPid)
          .withState('ITEM_ON_LOAN')
          .sortByNewest()
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

  function delayedFetch(patronPid, dispatch) {
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        resolve(fetchLoans(patronPid, dispatch));
      }, delay);
    });
  }

  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await delayedFetch(patronPid, dispatch);
  };
};
