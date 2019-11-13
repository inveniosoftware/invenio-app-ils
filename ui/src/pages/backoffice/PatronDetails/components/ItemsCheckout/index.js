import { connect } from 'react-redux';
import ItemsCheckoutComponent from './ItemsCheckout';
import { checkoutItem } from './state/actions';

const mapDispatchToProps = dispatch => ({
  checkoutItem: (documentPid, itemPid, patronPid, force = false) =>
    dispatch(checkoutItem(documentPid, itemPid, patronPid, force)),
});

const mapStateToProps = state => ({
  isLoading: state.patronItemsCheckout.isLoading,
  data: state.patronItemsCheckout.data,
  error: state.patronItemsCheckout.error,
  hasError: state.patronItemsCheckout.hasError,
});

export const ItemsCheckout = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemsCheckoutComponent);
