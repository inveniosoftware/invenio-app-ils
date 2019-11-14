import { ADD, REMOVE, CLEAR_ALL } from './types';

export const initialState = {
  nextNotificationId: 1,
  notifications: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      const notification = action.payload;
      notification['id'] = state.nextNotificationId;
      return {
        ...state,
        nextNotificationId: state.nextNotificationId + 1,
        notifications: [...state.notifications, notification],
      };
    case REMOVE:
      const notificationId = action.payload;
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== notificationId),
      };
    case CLEAR_ALL:
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};
