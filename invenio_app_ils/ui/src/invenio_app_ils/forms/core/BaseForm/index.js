import { connect } from 'react-redux';
import { sendSuccessNotification } from '../../../common/components/Notifications';
import { BaseForm as BaseFormComponent } from './BaseForm';

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const BaseForm = connect(
  null,
  mapDispatchToProps
)(BaseFormComponent);
