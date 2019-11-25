import {
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  UPLOAD_IS_LOADING,
  ADD_FILE,
  DELETE_FILE,
} from './types';
import { eitem as eitemApi, file as fileApi } from '@api';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { BackOfficeRoutes } from '@routes/urls';
import { ES_DELAY } from '@config';
import { goTo } from '@history';

export const deleteEItem = eitemPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await eitemApi.delete(eitemPid);
      dispatch({
        type: DELETE_SUCCESS,
        payload: { eitemPid: eitemPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The EItem ${eitemPid} has been deleted.`
        )
      );
      setTimeout(() => {
        goTo(BackOfficeRoutes.eitemsList);
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

export const fetchEItemDetails = eitemPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await eitemApi.get(eitemPid);
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

export const uploadFile = (eitemPid, bucket, file) => {
  return async dispatch => {
    dispatch({
      type: UPLOAD_IS_LOADING,
    });

    try {
      if (!bucket) {
        const bucketResponse = await eitemApi.bucket(eitemPid);
        bucket = bucketResponse.data.metadata.bucket_id;
      }
      const response = await fileApi.upload(bucket, file);
      dispatch({
        type: ADD_FILE,
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

export const deleteFile = (bucket, filename) => {
  return async dispatch => {
    dispatch({
      type: UPLOAD_IS_LOADING,
    });

    try {
      await fileApi.delete(bucket, filename);
      dispatch({
        type: DELETE_FILE,
        payload: filename,
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
