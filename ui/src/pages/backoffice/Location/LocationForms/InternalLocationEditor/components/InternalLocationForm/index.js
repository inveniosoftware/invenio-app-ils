import { connect } from 'react-redux';
import { sendSuccessNotification } from '@components/Notifications/state/actions';
import { InternalLocationForm as InternalLocationFormComponent } from './InternalLocationForm';

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const InternalLocationForm = connect(
  null,
  mapDispatchToProps
)(InternalLocationFormComponent);
