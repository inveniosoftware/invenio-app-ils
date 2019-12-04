import {
  IS_LOADING,
  SUCCESS,
  IS_ANONYMOUS,
  IS_CONFIRMED,
  IS_CONFIRMED_LOADING,
} from './types';
import {
  authenticationService,
  sessionManager,
} from '@authentication/services';

export const fetchUserProfile = () => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await authenticationService.fetchProfile();
      sessionManager.setUser(response.data);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      sessionManager.setAnonymous();
      dispatch({
        type: IS_ANONYMOUS,
      });
    }
  };
};

export const setAnonymous = () => ({
  type: IS_ANONYMOUS,
});

export const confirmUser = token => {
  return async dispatch => {
    dispatch({
      type: IS_CONFIRMED_LOADING,
    });
    try {
      await authenticationService.confirmUser(token);
      sessionManager.setUserConfirmed(true);
      dispatch({
        type: IS_CONFIRMED,
        payload: {
          isConfirmed: true,
        },
      });
    } catch (error) {
      sessionManager.setUserConfirmed(false);
      dispatch({
        type: IS_CONFIRMED,
        payload: {
          isConfirmed: false,
        },
      });
    }
  };
};
