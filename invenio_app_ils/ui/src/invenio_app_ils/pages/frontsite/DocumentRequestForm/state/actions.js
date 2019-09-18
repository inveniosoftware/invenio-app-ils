import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';
import { documentRequest as documentRequestApi } from '../../../../common/api';
import { sendSuccessNotification } from '../../../../common/components/Notifications';
import { goTo } from '../../../../history';
import { FrontSiteRoutes } from '../../../../routes/urls';
import { ES_DELAY } from '../../../../common/config';

export const createDocumentRequest = (data, actions) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await documentRequestApi.create(data);

      actions.setSubmitting(false);
      dispatch({
        type: IS_LOADING,
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `Your book request has been sent to the library.`
        )
      );
      setTimeout(() => {
        goTo(FrontSiteRoutes.patronProfile);
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      }, ES_DELAY);
    } catch (error) {
      const errorData = error.response.data;
      const payload = {};
      for (const fieldError of errorData.errors) {
        payload[fieldError.field] = fieldError.message;
      }
      actions.setSubmitting(false);
      dispatch({
        type: HAS_ERROR,
        payload: payload,
      });
    }
  };
};
