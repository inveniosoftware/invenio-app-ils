import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { documentRequest as documentRequestApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';

const selectQuery = (patronPid, page = 1) => {
  return documentRequestApi
    .query()
    .withPatronPid(patronPid)
    .withPage(page)
    .sortByNewest()
    .qs();
};

export const fetchPatronDocumentRequests = (patronPid, page) => {
  const query = selectQuery(patronPid, page);
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
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
};
