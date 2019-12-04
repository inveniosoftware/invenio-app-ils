import { connect } from 'react-redux';
import DocumentRequestFormComponent from './DocumentRequestForm';
import { sendSuccessNotification } from '@components/Notifications';

const mapStateToProps = state => ({
  user: state.authenticationManagement.data,
});

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const DocumentRequestForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentRequestFormComponent);
