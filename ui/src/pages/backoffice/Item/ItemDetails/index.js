import { connect } from 'react-redux';

import { deleteItem, fetchItemDetails } from './state/actions';
import ItemDetailsComponent from './ItemDetails';

const mapStateToProps = state => ({
  isLoading: state.itemDetails.isLoading,
  error: state.itemDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemPid => dispatch(fetchItemDetails(itemPid)),
  deleteItem: itemPid => dispatch(deleteItem(itemPid)),
});

export const ItemDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemDetailsComponent);
