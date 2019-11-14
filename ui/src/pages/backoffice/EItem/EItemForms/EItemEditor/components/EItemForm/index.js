import { connect } from 'react-redux';
import { sendSuccessNotification } from '@components/Notifications/state/actions';
import { EItemForm as EItemFormComponent } from './EItemForm';

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const EItemForm = connect(
  null,
  mapDispatchToProps
)(EItemFormComponent);
