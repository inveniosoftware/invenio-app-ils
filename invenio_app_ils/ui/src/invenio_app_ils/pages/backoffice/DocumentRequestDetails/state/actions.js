import {
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
} from './types';
import { documentRequest as documentRequestApi } from '../../../../common/api';
import {
  sendSuccessNotification,
  sendErrorNotification,
} from '../../../../common/components/Notifications';
import { goTo } from '../../../../history';
import { BackOfficeRoutes } from '../../../../routes/urls';
import { ES_DELAY } from '../../../../common/config';

export const fetchDocumentRequestDetails = documentRequestPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await documentRequestApi
      .get(documentRequestPid)
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

export const deleteRequest = requestPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await documentRequestApi.delete(requestPid);
      dispatch({
        type: DELETE_SUCCESS,
        payload: { requestPid: requestPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `Document request ${requestPid} has been deleted.`
        )
      );
      setTimeout(() => {
        goTo(BackOfficeRoutes.documentRequestsList);
      }, ES_DELAY);
    } catch (error) {
      dispatch({
        type: DELETE_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const performCancelAction = (pid, cancelReason) => {
  const ops = [
    {
      op: 'replace',
      path: '/state',
      value: 'CANCELLED',
    },
    {
      op: 'add',
      path: '/cancel_reason',
      value: cancelReason,
    },
  ];
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await documentRequestApi
      .patch(pid, ops)
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
        dispatch(
          sendSuccessNotification(
            'Successfully cancelled!',
            `The document request was successful cancelled for document request with PID ${pid}.`
          )
        );
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

export const performFulfillAction = (pid, documentPid) => {
  return async dispatch => {
    throw new Error('Not yet implemented!');
  };
};
