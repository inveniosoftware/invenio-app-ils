import {
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
} from './types';
import { documentRequest as documentRequestApi } from '@api';
import {
  sendSuccessNotification,
  sendErrorNotification,
} from '@components/Notifications';
import { goTo } from '@history';
import { BackOfficeRoutes } from '@routes/urls';
import { ES_DELAY } from '@config';

export const fetchDocumentRequestDetails = documentRequestPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await documentRequestApi.get(documentRequestPid);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
    }
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

export const acceptRequest = pid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const resp = await documentRequestApi.accept(pid);
      dispatch({
        type: SUCCESS,
        payload: resp.data,
      });
      dispatch(
        sendSuccessNotification('Success!', `Request ${pid} has been accepted.`)
      );
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const rejectRequest = (pid, data) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const resp = await documentRequestApi.reject(pid, data);
      dispatch({
        type: SUCCESS,
        payload: resp.data,
      });
      dispatch(
        sendSuccessNotification('Success!', `Request ${pid} has been rejected.`)
      );
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
