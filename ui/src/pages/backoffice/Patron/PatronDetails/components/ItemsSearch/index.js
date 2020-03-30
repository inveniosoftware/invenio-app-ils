import { connect } from 'react-redux';
import { checkoutItem } from '../ItemsCheckout/state/actions';
import ItemsSearchComponent from './ItemsSearch';
import { clearResults, fetchItems, updateQueryString } from './state/actions';

const mapDispatchToProps = dispatch => ({
  fetchItems: barcode => dispatch(fetchItems(barcode)),
  updateQueryString: qs => dispatch(updateQueryString(qs)),
  clearResults: () => dispatch(clearResults()),
  checkoutItem: (documentPid, itemPid, patronPid, force = false) =>
    dispatch(checkoutItem(documentPid, itemPid, patronPid, force)),
});

const mapStateToProps = state => ({
  checkoutData: state.patronItemsCheckout.data,
  checkoutHasError: state.patronItemsCheckout.hasError,
  checkoutLoading: state.patronItemsCheckout.isLoading,
  error: state.itemsSearchInput.error,
  hasError: state.itemsSearchInput.hasError,
  isLoading: state.patronDetails.isLoading,
  items: state.itemsSearchInput.data,
  patronDetails: state.patronDetails.data,
  queryString: state.itemsSearchInput.itemCheckoutQueryString,
});

export const ItemsSearch = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemsSearchComponent);
