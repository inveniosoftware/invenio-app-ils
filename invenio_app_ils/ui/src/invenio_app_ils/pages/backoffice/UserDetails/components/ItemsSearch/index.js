import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ItemsSearchComponent from './ItemsSearch';
import {
  clearResults,
  fetchItems,
  fetchUpdatedCurrentLoans,
  updateQueryString,
} from './state/actions';
import { checkoutItem } from '../ItemsCheckout/state/actions';

const mapDispatchToProps = dispatch => ({
  fetchItems: barcode => dispatch(fetchItems(barcode)),
  updateQueryString: qs => dispatch(updateQueryString(qs)),
  clearResults: () => dispatch(clearResults()),
  checkoutItem: (item, patronPid) => dispatch(checkoutItem(item, patronPid)),
  fetchUpdatedCurrentLoans: patronPid =>
    dispatch(fetchUpdatedCurrentLoans(patronPid)),
});

const mapStateToProps = state => ({
  isLoading: state.userDetails.isLoading,
  items: state.itemsSearchInput.data,
  hasError: state.itemsSearchInput.hasError,
  queryString: state.itemsSearchInput.itemCheckoutQueryString,
});

export const ItemsSearch = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemsSearchComponent);