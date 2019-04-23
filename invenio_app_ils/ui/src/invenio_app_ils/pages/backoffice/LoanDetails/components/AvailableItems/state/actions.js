import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  CHECKOUT_IS_LOADING,
  CHECKOUT_HAS_ERROR,
} from './types';
import {
  SUCCESS as FETCH_LOAN_SUCCESS,
  IS_LOADING as FETCH_LOAN_IS_LOADING,
} from '../../../state/types';
import { item as itemApi, loan as loanApi } from '../../../../../../common/api';
import { invenioConfig } from '../../../../../../common/config';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../../../common/components/Notifications';
import { sessionManager } from '../../../../../../authentication/services';

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
          .availableForCheckout()
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
      type: FETCH_LOAN_IS_LOADING,
    });
    await loanApi
      .assignItemToLoan(itemId, loanId)
      .then(response => {
        dispatch({
          type: FETCH_LOAN_SUCCESS,
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

export const assignItemAndCheckout = (loanPid, loan, url, itemPid) => {
  return async dispatch => {
    dispatch({
      type: CHECKOUT_IS_LOADING,
    });
    const currentUser = sessionManager.user;
    loan['metadata']['item_pid'] = itemPid;
    await loanApi
      .postAction(url, loanPid, loan, currentUser.id, currentUser.locationPid)
      .then(details => {
        dispatch({
          type: FETCH_LOAN_SUCCESS,
          payload: details.data,
        });
        dispatch(
          sendSuccessNotification(
            'Successful loan action!',
            `The loan action was successful for loan PID ${loanPid}.`
          )
        );
      })
      .catch(error => {
        dispatch({
          type: CHECKOUT_HAS_ERROR,
          payload: error,
        });
        dispatch(sendErrorNotification(error));
      });
  };
};
