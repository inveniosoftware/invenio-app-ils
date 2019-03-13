import { ADD } from './types';
import { shouldShowErrorPage } from '../../Error/Error';

export const sendErrorNotification = error => {
  return dispatch => {
    if (!shouldShowErrorPage(error)) {
      const errorData = error.response.data;
      const { status, error_class, error_module, message } = errorData;
      const title = `${error_module}: ${error_class} (${status})`;

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
