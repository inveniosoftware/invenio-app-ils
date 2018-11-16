import { NEW_USER_SESSION, USER_SESSION_CLEANED } from './types';

const initialState = {
  userPid: '3', // TODO: replace this with the logged in user PID
  locationPid: '1', // TODO: replace this with the current location PID
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NEW_USER_SESSION:
      return {
        userPid: action.payload.userPid,
        locationPid: action.payload.locationPid,
      };
    case USER_SESSION_CLEANED:
      return { ...initialState };
    default:
      return state;
  }
};
