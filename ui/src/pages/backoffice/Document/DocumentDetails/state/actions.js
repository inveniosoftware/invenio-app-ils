import { document as documentApi, loan as loanApi } from '@api';
import { toShortDate } from '@api/date';
import { delay } from '@api/utils';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { goTo } from '@history';
import { BackOfficeRoutes } from '@routes/urls';
import { DateTime } from 'luxon';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
} from './types';

export const fetchDocumentDetails = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await documentApi.get(documentPid);
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

export const deleteDocument = documentPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await documentApi.delete(documentPid);
      await delay();
      dispatch({
        type: DELETE_SUCCESS,
        payload: { documentPid: documentPid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The document ${documentPid} has been deleted.`
        )
      );
      goTo(BackOfficeRoutes.documentsList);
    } catch (error) {
      dispatch({
        type: DELETE_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const updateDocument = (documentPid, path, value) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await documentApi
      .patch(documentPid, [
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
            `The document ${documentPid} has been updated.`
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

export const requestLoanForPatron = (
  documentPid,
  patronPid,
  { requestEndDate = null, deliveryMethod = null } = {}
) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const today = toShortDate(DateTime.local());
    try {
      const response = await loanApi.doRequest(documentPid, patronPid, {
        requestExpireDate: requestEndDate,
        requestStartDate: today,
        deliveryMethod: deliveryMethod,
      });
      await delay();
      const loanPid = response.data.pid;
      const linkToLoan = (
        <p>
          The loan {loanPid} has been requested.{' '}
          <Link to={BackOfficeRoutes.loanDetailsFor(loanPid)}>
            You can now view the loan details.
          </Link>
        </p>
      );
      dispatch(sendSuccessNotification('Success!', linkToLoan));
      dispatch(fetchDocumentDetails(documentPid));
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
