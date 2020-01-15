import { connect } from 'react-redux';
import { fetchUserProfile } from '@authentication/state/actions';
import {
  addNotification,
  clearNotifications,
} from '@components/Notifications/state/actions';
import LoginComponent from './Login';

const mapStateToProps = state => ({
  user: state.authenticationManagement.data,
  isAnonymous: state.authenticationManagement.isAnonymous,
  isLoading: state.authenticationManagement.isLoading,
});

const mapDispatchToProps = dispatch => ({
  sendErrorNotification: (title, content) =>
    dispatch(addNotification(title, content, 'error')),
  clearNotifications: () => dispatch(clearNotifications()),
  fetchUserProfile: () => dispatch(fetchUserProfile()),
});

export const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
