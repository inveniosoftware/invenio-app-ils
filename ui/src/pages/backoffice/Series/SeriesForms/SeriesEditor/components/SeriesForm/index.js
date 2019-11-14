import { connect } from 'react-redux';
import { sendSuccessNotification } from '@components/Notifications/state/actions';
import { SeriesForm as SeriesFormComponent } from './SeriesForm';

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const SeriesForm = connect(
  null,
  mapDispatchToProps
)(SeriesFormComponent);
