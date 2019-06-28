import React from 'react';
import { Link } from 'react-router-dom';
import { ES_DELAY } from '../../../../common/config';
import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
} from './types';
import { item as itemApi, loan as loanApi } from '../../../../common/api';
import { BackOfficeRoutes } from '../../../../routes/urls';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../common/components/Notifications';
import { goTo } from '../../../../history';
import { sessionManager } from '../../../../authentication/services';
import { ApiURLS } from '../../../../common/api/urls';

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

export const createNewLoanForItem = loanData => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    try {
      const response = await loanApi.postAction(
        ApiURLS.loans.create,
        loanData.metadata.item_pid,
        loanData,
        currentUser.id,
        currentUser.locationPid
      );
      const { loan_pid, item_pid, patron_pid } = response.data.metadata;
      const linkToLoan = (
        <p>
          The loan {loan_pid} has been requested on behalf of patron{' '}
          {patron_pid}.
          <Link to={BackOfficeRoutes.loanDetailsFor(loan_pid)}>
            You can now view the loan details.
          </Link>
        </p>
      );
      dispatch(sendSuccessNotification('Success!', linkToLoan));
      setTimeout(() => {
        dispatch(fetchItemDetails(item_pid));
      }, ES_DELAY);
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const updateItem = (itemPid, path, value) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await itemApi
      .patch(itemPid, [
        {
          op: 'replace',
          path: path,
          value: value,
        },
      ])
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
        dispatch(
          sendSuccessNotification(
            'Success!',
            `The item ${itemPid} has been updated.`
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
