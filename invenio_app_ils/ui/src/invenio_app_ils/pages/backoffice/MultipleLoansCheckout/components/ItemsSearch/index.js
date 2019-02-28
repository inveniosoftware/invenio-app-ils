import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ItemsSearchComponent from './ItemsSearch';
import { clearResults, fetchItems, updateQueryString } from './state/actions';
import { addItemToBasket } from '../ItemsBasket/state/actions';

const mapDispatchToProps = dispatch => ({
  fetchItems: barcode => dispatch(fetchItems(barcode)),
  updateQueryString: qs => dispatch(updateQueryString(qs)),
  addItemToBasket: item => dispatch(addItemToBasket(item)),
  clearResults: () => dispatch(clearResults()),
});

const mapStateToProps = state => ({
  isLoading: state.selectedUser.isLoading,
  items: state.itemsSearchInput.data,
  hasError: state.itemsSearchInput.hasError,
  queryString: state.itemsSearchInput.multiCheckoutQueryString,
});

export const ItemsSearch = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemsSearchComponent);
