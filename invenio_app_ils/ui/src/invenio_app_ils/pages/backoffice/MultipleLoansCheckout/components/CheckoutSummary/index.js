import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CheckoutSummaryComponent from './CheckoutSummary';

const mapStateToProps = state => ({
  isLoading: state.itemsBasket.isLoading,
  data: state.itemsBasket.data,
  hasError: state.itemsBasket.hasError,
});

export const CheckoutSummary = compose(
  withRouter,
  connect(mapStateToProps)
)(CheckoutSummaryComponent);
