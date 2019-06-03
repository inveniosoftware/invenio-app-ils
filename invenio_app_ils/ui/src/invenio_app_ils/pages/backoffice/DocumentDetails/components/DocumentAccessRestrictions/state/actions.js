import {
  SET_RESTRICTIONS_IS_LOADING,
  SET_RESTRICTIONS_SUCCESS,
  SET_RESTRICTIONS_HAS_ERROR,
} from './types';
import { document as documentApi } from '../../../../../../common/api';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../../../common/components/Notifications';
import { fetchDocumentDetails } from '../../../state/actions';
import { ES_DELAY } from '../../../../../../common/config';
import isEmpty from 'lodash/isEmpty';

export const setRestrictionsOnDocument = (pid, accessList) => {
  const operation = isEmpty(accessList) ? 'remove' : 'add';
  const ops = [{ op: operation, path: '/_access/read', value: accessList }];

  return async dispatch => {
    dispatch({
      type: SET_RESTRICTIONS_IS_LOADING,
    });
    try {
      const response = await documentApi.patch(pid, ops);
      dispatch({
        type: SET_RESTRICTIONS_SUCCESS,
        payload: response.data,
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The access restrictions have been set.`
        )
      );
      setTimeout(() => {
        dispatch(fetchDocumentDetails(pid));
      }, ES_DELAY);
    } catch (error) {
      dispatch({
        type: SET_RESTRICTIONS_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
