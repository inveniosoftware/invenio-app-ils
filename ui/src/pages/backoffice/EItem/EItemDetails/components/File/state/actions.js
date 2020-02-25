import { eitem as eitemApi, file as fileApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';
import {
  DELETE_FILE,
  UPLOAD_IS_LOADING,
} from '@pages/backoffice/EItem/EItemDetails/state/types';
import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';

export const uploadFile = (eitemPid, bucket, file) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      if (!bucket) {
        const bucketResponse = await eitemApi.bucket(eitemPid);
        bucket = bucketResponse.data.metadata.bucket_id;
      }
      const response = await fileApi.upload(bucket, file);
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
