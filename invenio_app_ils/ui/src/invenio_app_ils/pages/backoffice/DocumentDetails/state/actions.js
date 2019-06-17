import React from 'react';
import { Link } from 'react-router-dom';
import {
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
} from './types';
import { ES_DELAY } from '../../../../common/config';
import { goTo } from '../../../../history';
import {
  document as documentApi,
  loan as loanApi,
} from '../../../../common/api';
import { BackOfficeRoutes } from '../../../../routes/urls';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../common/components/Notifications';
import { sessionManager } from '../../../../authentication/services';
import { ApiURLS } from '../../../../common/api/urls';
import isEmpty from 'lodash/isEmpty';

export const setRestrictionsOnDocument = (pid, accessList) => {
  const operation = isEmpty(accessList) ? 'remove' : 'add';
  const ops = [{ op: operation, path: '/_access/read', value: accessList }];

  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await documentApi.patch(pid, ops);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The access restrictions have been set.`
        )
      );
      dispatch(fetchDocumentDetails(pid));
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const fetchDocumentDetails = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await documentApi
      .get(documentPid)
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

export const deleteDocument = documentPid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await documentApi.delete(documentPid);
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
      setTimeout(() => {
        goTo(BackOfficeRoutes.documentsList);
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

export const requestLoanForDocument = (docPid, patronPid) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    try {
      const response = await loanApi.requestLoanOnDocument(
        ApiURLS.loans.request,
        docPid,
        patronPid,
        currentUser.id,
        currentUser.locationPid
      );
      const loanPid = response.data.loan_pid;
      const linkToLoan = (
        <p>
          The loan {loanPid} has been requested.
          <Link to={BackOfficeRoutes.loanDetailsFor(loanPid)}>
            You can now view the loan details.
          </Link>
        </p>
      );
      dispatch(sendSuccessNotification('Success!', linkToLoan));
      setTimeout(() => {
        dispatch(fetchDocumentDetails(docPid));
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
