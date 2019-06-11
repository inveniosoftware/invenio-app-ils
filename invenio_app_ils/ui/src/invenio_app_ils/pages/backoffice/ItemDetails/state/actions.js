import { ES_DELAY } from '../../../../common/config';
import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
} from './types';
import { item as itemApi } from '../../../../common/api';
import { BackOfficeRoutes } from '../../../../routes/urls';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../common/components/Notifications';
import { goTo } from '../../../../history';

export const fetchItemDetails = itemPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await itemApi.get(itemPid);
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

export const deleteItem = itemPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await itemApi.delete(itemPid);
      dispatch({
        type: DELETE_SUCCESS,
        payload: { itemPid: itemPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The item ${itemPid} has been deleted.`
        )
      );
      setTimeout(() => {
        goTo(BackOfficeRoutes.itemsList);
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
