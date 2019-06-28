import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import {
  document as documentApi,
  loan as loanApi,
} from '../../../../common/api';
import { sessionManager } from '../../../../authentication/services';
import { ApiURLS } from '../../../../common/api/urls';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '../../../../common/components/Notifications';
import { ES_DELAY } from '../../../../common/config';

export const fetchDocumentsDetails = documentPid => {
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
      });
  };
};

export const requestLoanForDocument = docPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    const currentUser = sessionManager.user;
    try {
      await loanApi.requestLoanOnDocument(
        ApiURLS.loans.request,
        docPid,
        currentUser.id,
        currentUser.id,
        currentUser.locationPid
      );
      dispatch(
        sendSuccessNotification(
          'Success!',
          `Your loan on this book has been requested.`
        )
      );
      setTimeout(() => {
        dispatch(fetchDocumentsDetails(docPid));
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
