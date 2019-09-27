import { connect } from 'react-redux';
import { sendSuccessNotification } from '../../../../../../../common/components/Notifications/state/actions';
import { LocationForm as LocationFormComponent } from './LocationForm';

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const LocationForm = connect(
  null,
  mapDispatchToProps
)(LocationFormComponent);
