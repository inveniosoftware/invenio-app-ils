import { NEW_USER_SESSION, USER_SESSION_CLEANED } from './types';

export const createUserSession = (userPid, locationPid) => {
  return async dispatch => {
    const session = { userPid: userPid, locationPid: locationPid };
    dispatch({ type: NEW_USER_SESSION, payload: session });
  };
};

export const cleanUserSession = () => {
  return async dispatch => {
    dispatch({
      type: USER_SESSION_CLEANED,
    });
  };
};
