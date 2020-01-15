import { connect } from 'react-redux';
import ILSMenuComponent from './ILSMenu';
import { addNotification } from '@components/Notifications/state/actions';
import { logout } from '@authentication/state/actions';

const mapStateToProps = state => ({
  user: state.authenticationManagement.data,
  isAnonymous: state.authenticationManagement.isAnonymous,
});

const mapDispatchToProps = dispatch => ({
  sendErrorNotification: (title, content) =>
    dispatch(addNotification(title, content, 'error')),
  logout: () => dispatch(logout()),
});

export const ILSMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(ILSMenuComponent);
