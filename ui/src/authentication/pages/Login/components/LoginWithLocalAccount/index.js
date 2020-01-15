import { connect } from 'react-redux';
import { fetchUserProfile } from '@authentication/state/actions';
import {
  addNotification,
  clearNotifications,
} from '@components/Notifications/state/actions';
import LoginWithLocalAccountComponent from './LoginWithLocalAccount';

const mapDispatchToProps = dispatch => ({
  sendErrorNotification: (title, content) =>
    dispatch(addNotification(title, content, 'error')),
  clearNotifications: () => dispatch(clearNotifications()),
  fetchUserProfile: () => dispatch(fetchUserProfile()),
});

export const LoginWithLocalAccount = connect(
  null,
  mapDispatchToProps
)(LoginWithLocalAccountComponent);
