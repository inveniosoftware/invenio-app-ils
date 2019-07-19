import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { invenioConfig } from '../../config';
import { loan as loanApi } from '../../api';
import { sendErrorNotification } from '../../components/Notifications';
import { ES_DELAY } from '../../config';

const selectQuery = (patronPid, page = 1) => {
  return loanApi
    .query()
    .withPatronPid(patronPid)
    .withState(invenioConfig.circulation.loanActiveStates)
    .withPage(page)
    .sortByNewest()
    .qs();
};

export const fetchPatronCurrentLoans = (patronPid, page) => {
  const fetchLoans = (patronPid, dispatch) => {
    loanApi
      .list(selectQuery(patronPid, page))
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
      }, ES_DELAY);
    });
  }

  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await delayedFetch(patronPid, dispatch);
  };
};
