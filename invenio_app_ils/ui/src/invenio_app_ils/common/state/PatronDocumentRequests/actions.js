import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { documentRequest as documentRequestApi } from '../../api';
import { sendErrorNotification } from '../../components/Notifications';
import { ES_DELAY } from '../../config';

const selectQuery = (patronPid, page = 1) => {
  return documentRequestApi
    .query()
    .withPatronPid(patronPid)
    .withPage(page)
    .sortByNewest()
    .qs();
};

export const fetchPatronDocumentRequests = (patronPid, page) => {
  const fetchRequests = (patronPid, dispatch) => {
    documentRequestApi
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
        resolve(fetchRequests(patronPid, dispatch));
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
