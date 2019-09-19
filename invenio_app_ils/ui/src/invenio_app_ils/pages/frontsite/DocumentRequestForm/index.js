import { connect } from 'react-redux';
import DocumentRequestFormComponent from './DocumentRequestForm';
import { sendSuccessNotification } from '../../../common/components/Notifications';

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const DocumentRequestForm = connect(
  null,
  mapDispatchToProps
)(DocumentRequestFormComponent);
