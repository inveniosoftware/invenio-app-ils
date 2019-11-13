import { ADD } from './types';
import { shouldShowErrorPage } from '../../Error/Error';

export const sendErrorNotification = error => {
  return dispatch => {
    if (!shouldShowErrorPage(error)) {
      const errorData = error.response.data;
      const {
        error_class: errorClass,
        error_module: errorModule,
        message,
      } = errorData;

      const title =
        errorClass && errorModule
          ? `${errorModule}: ${errorClass}`
          : 'Something went wrong';

      dispatch(addNotification(title, message, 'error'));
    }
  };
};

export const sendSuccessNotification = (title, content) => {
  return addNotification(title, content, 'success');
};

export const sendWarningNotification = (title, content) => {
  return addNotification(title, content, 'warning');
};

export const addNotification = (title, content, type) => {
  return {
    type: ADD,
    payload: {
      type: type,
      title: title,
      content: content,
    },
  };
};
