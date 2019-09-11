import { connect } from 'react-redux';
import { sendSuccessNotification } from '../../../../common/components/Notifications';
import SendMailModalComponent from './SendMailModal';

const mapDispatchToProps = {
  sendSuccessNotification,
};

export const SendMailModal = connect(
  null,
  mapDispatchToProps
)(SendMailModalComponent);
