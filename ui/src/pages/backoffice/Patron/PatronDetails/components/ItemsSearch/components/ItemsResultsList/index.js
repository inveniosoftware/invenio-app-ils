import { checkoutItem } from '@pages/backoffice/Patron/PatronDetails/components/ItemsCheckout/state/actions';
import { connect } from 'react-redux';
import ItemsResultsListComponent from './ItemsResultsList';

const mapStateToProps = state => ({
  checkoutData: state.patronItemsCheckout.data,
  checkoutIsLoading: state.patronItemsCheckout.isLoading,
  checkoutHasError: state.patronItemsCheckout.hasError,
  results: state.itemsSearchInput.data,
});

const mapDispatchToProps = dispatch => ({
  checkoutItem: (documentPid, itemPid, patronPid, force = false) =>
    dispatch(checkoutItem(documentPid, itemPid, patronPid, force)),
});

export const ItemsResultsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemsResultsListComponent);
