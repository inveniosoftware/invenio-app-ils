import { connect } from 'react-redux';

import { fetchOrderDetails } from './state/actions';
import OrderDetailsComponent from './OrderDetails';

const mapStateToProps = state => ({
  data: state.orderDetails.data,
  isLoading: state.orderDetails.isLoading,
  error: state.orderDetails.error,
  hasError: state.orderDetails.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchOrderDetails: orderPid => dispatch(fetchOrderDetails(orderPid)),
});

export const OrderDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetailsComponent);
