import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { documentRequest as documentRequestApi } from '../../../../../common/api';
import { sendErrorNotification } from '../../../../../common/components/Notifications';
import { ES_DELAY } from '../../../../../common/config';

const selectQuery = (patronPid, page = 1) => {
  return documentRequestApi
    .query()
    .withPatronPid(patronPid)
    .withPage(page)
    .sortByNewest()
    .withState(['ACCEPTED', 'REJECTED'])
    .qs();
};

export const fetchPatronPastDocumentRequests = (patronPid, page, delayed=false) => {
  const query = selectQuery(patronPid, page);
  const fetchRequests = async (patronPid, dispatch) => {
    try {
      const response = await documentRequestApi.list(query);
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
    if(delayed) {
      await delayedFetch(patronPid, dispatch);
    }else{
      await fetchRequests(patronPid, dispatch);
    }
  };
};
