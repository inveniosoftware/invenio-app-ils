import {
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
} from './types';
import { illBorrowingRequest as borrowingRequestApi } from '@api';
import {
  sendSuccessNotification,
  sendErrorNotification,
} from '@components/Notifications';
import { goTo } from '@history';
import { ILLRoutes } from '@routes/urls';
import { ES_DELAY } from '@config';

export const fetchBorrowingRequestDetails = borrowingRequestPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await borrowingRequestApi.get(borrowingRequestPid);
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
      await borrowingRequestApi.delete(requestPid);
      dispatch({
        type: DELETE_SUCCESS,
        payload: { requestPid: requestPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `Borrowing request ${requestPid} has been deleted.`
        )
      );
      setTimeout(() => {
        goTo(ILLRoutes.borrowingRequestList);
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

export const acceptRequest = (pid, data) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const resp = await borrowingRequestApi.accept(pid, data);
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
      const resp = await borrowingRequestApi.reject(pid, data);
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
