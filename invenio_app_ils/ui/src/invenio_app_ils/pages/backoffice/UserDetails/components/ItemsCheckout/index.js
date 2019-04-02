import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ItemsCheckoutComponent from './ItemsCheckout';
import { checkoutItem } from './state/actions';

const mapDispatchToProps = dispatch => ({
  checkoutItem: (item, patron_pid) => dispatch(checkoutItem(item, patron_pid)),
});

const mapStateToProps = state => ({
  isLoading: state.patronItemsCheckout.isLoading,
  data: state.patronItemsCheckout.data,
  error: state.patronItemsCheckout.error,
  hasError: state.patronItemsCheckout.hasError,
});

export const ItemsCheckout = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemsCheckoutComponent);
