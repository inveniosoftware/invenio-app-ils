import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { item as itemApi, loan as loanApi } from '../../../../../../common/api';
import { invenioConfig } from '../../../../../../common/config';
import { sendErrorNotification } from '../../../../../../common/components/Notifications';

export const fetchAvailableItems = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await itemApi
      .list(
        itemApi
          .query()
          .withDocPid(documentPid)
          .withStatus(invenioConfig.items.available.status)
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

export const assignItemToLoan = (itemId, loanId) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .assignItemToLoan(itemId, loanId)
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
