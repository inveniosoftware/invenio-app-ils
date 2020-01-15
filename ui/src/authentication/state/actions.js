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
import { FrontSiteRoutes } from '@routes/urls';
import { goTo } from '@history';

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

export const logout = () => {
  return async dispatch => {
    await authenticationService.logout();
    sessionManager.setAnonymous();
    dispatch({
      type: IS_ANONYMOUS,
    });
    goTo(FrontSiteRoutes.home);
  };
};

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
