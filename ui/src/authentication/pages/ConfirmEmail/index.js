import { connect } from 'react-redux';
import { confirmUser } from '@authentication/state/actions';
import {
  addNotification,
  clearNotifications,
} from '@components/Notifications/state/actions';
import ConfirmEmailComponent from './ConfirmEmail';

const mapStateToProps = state => ({
  user: state.authenticationManagement.data,
  isConfirmed: state.authenticationManagement.isConfirmed,
  isConfirmedLoading: state.authenticationManagement.isConfirmedLoading,
});

const mapDispatchToProps = dispatch => ({
  sendErrorNotification: (title, content) =>
    dispatch(addNotification(title, content, 'error')),
  clearNotifications: () => dispatch(clearNotifications()),
  confirmUser: token => dispatch(confirmUser(token)),
});

export const ConfirmEmail = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmEmailComponent);
