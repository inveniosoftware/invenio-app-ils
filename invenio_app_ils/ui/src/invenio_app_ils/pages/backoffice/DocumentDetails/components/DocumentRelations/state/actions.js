import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { document as documentApi } from '../../../../../../common/api';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../../../common/components/Notifications';

export const createRelations = (pid, relations) => {
  return async dispatch => {
    if (relations.length) {
      dispatch({
        type: IS_LOADING,
      });

      await documentApi
        .createRelation(pid, relations)
        .then(response => {
          dispatch({
            type: SUCCESS,
            payload: response.data.metadata.relations,
          });
          dispatch(
            sendSuccessNotification(
              'Success!',
              'Relations were successfully created.'
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
    }
  };
};

export const deleteRelations = (pid, relations) => {
  return async dispatch => {
    if (relations.length) {
      dispatch({
        type: IS_LOADING,
      });

      await documentApi
        .deleteRelation(pid, relations)
        .then(response => {
          dispatch({
            type: SUCCESS,
            payload: response.data.metadata.relations,
          });
          dispatch(
            sendSuccessNotification(
              'Success!',
              'Relations were successfully deleted.'
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
    }
  };
};
