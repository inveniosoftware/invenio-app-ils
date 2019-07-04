import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '../../config';
import { loan as loanApi } from '../../api';
import { sendErrorNotification } from '../../components/Notifications';

const selectQuery = (patronPid, query) => {
  if (query === undefined) {
    query = loanApi
      .query()
      .withPatronPid(patronPid)
      .withState(invenioConfig.circulation.loanCompletedStates)
      .sortByNewest()
      .qs();
  }
  return query;
};

export const fetchPatronPastLoans = (
  patronPid,
  delay = 0,
  query = undefined
) => {
  const fetchLoans = (patronPid, dispatch) => {
    loanApi
      .list(selectQuery(patronPid, query))
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
