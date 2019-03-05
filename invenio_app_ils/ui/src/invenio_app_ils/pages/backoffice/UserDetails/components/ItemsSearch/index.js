import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ItemsSearchComponent from './ItemsSearch';
import { clearResults, fetchItems, updateQueryString } from './state/actions';
import { checkoutItem } from '../ItemsCheckout/state/actions';
import { fetchPatronCurrentLoans } from '../PatronCurrentLoans/state/actions';

const mapDispatchToProps = dispatch => ({
  fetchItems: barcode => dispatch(fetchItems(barcode)),
  updateQueryString: qs => dispatch(updateQueryString(qs)),
  clearResults: () => dispatch(clearResults()),
  checkoutItem: (item, patron_pid) => dispatch(checkoutItem(item, patron_pid)),
  fetchPatronCurrentLoans: patronPid =>
    dispatch(fetchPatronCurrentLoans(patronPid)),
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
