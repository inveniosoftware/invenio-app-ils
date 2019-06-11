import { connect } from 'react-redux';
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
  checkoutItem: (item, patronPid, shouldForceCheckout) =>
    dispatch(checkoutItem(item, patronPid, shouldForceCheckout)),
  fetchUpdatedCurrentLoans: patronPid =>
    dispatch(fetchUpdatedCurrentLoans(patronPid)),
});

const mapStateToProps = state => ({
  isLoading: state.patronDetails.isLoading,
  items: state.itemsSearchInput.data,
  error: state.itemsSearchInput.error,
  hasError: state.itemsSearchInput.hasError,
  queryString: state.itemsSearchInput.itemCheckoutQueryString,
});

export const ItemsSearch = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemsSearchComponent);
