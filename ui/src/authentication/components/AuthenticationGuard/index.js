import { connect } from 'react-redux';
import { addNotification } from '@components/Notifications/state/actions';
import AuthenticationGuardComponent from './AuthenticationGuard';

const mapStateToProps = state => ({
  user: state.authenticationManagement.data,
  isAnonymous: state.authenticationManagement.isAnonymous,
  isLoading: state.authenticationManagement.isLoading,
});

const mapDispatchToProps = dispatch => ({
  sendErrorNotification: (title, content) =>
    dispatch(addNotification(title, content, 'error')),
});

export const AuthenticationGuard = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationGuardComponent);
