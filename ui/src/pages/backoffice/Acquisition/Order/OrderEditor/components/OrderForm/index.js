import { connect } from 'react-redux';
import { sendSuccessNotification } from '@components/Notifications/state/actions';
import { OrderForm as OrderFormComponent } from './OrderForm';

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const OrderForm = connect(
  null,
  mapDispatchToProps
)(OrderFormComponent);
