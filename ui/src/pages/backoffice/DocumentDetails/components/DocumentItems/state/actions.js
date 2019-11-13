import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { item as itemApi } from '../../../../../../common/api';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';

export const fetchDocumentItems = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await itemApi
      .list(
        itemApi
          .query()
          .withDocPid(documentPid)
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
};
