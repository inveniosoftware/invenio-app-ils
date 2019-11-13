import { connect } from 'react-redux';
import NotificationsComponent from './Notifications';
import { REMOVE } from './state/types';
export {
  addNotification,
  sendErrorNotification,
  sendSuccessNotification,
} from './state/actions';

const mapStateToProps = state => ({
  notifications: state.notifications.notifications,
});

const mapDispatchToProps = dispatch => ({
  removeNotification: notificationId =>
    dispatch({
      type: REMOVE,
      payload: notificationId,
    }),
});

export const Notifications = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsComponent);
