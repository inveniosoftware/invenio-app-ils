import { connect } from 'react-redux';
import {
  addNotification,
  clearNotifications,
} from '@components/Notifications/state/actions';
import LoginWithOauthProvidersComponent from './LoginWithOauthProviders';

const mapDispatchToProps = dispatch => ({
  sendErrorNotification: (title, content) =>
    dispatch(addNotification(title, content, 'error')),
  clearNotifications: () => dispatch(clearNotifications()),
});

export const LoginWithOauthProviders = connect(
  null,
  mapDispatchToProps
)(LoginWithOauthProvidersComponent);
