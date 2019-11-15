import { connect } from 'react-redux';

import { deleteItem, fetchItemDetails } from './state/actions';
import ItemDetailsComponent from './ItemDetails';

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemPid => dispatch(fetchItemDetails(itemPid)),
  deleteItem: itemPid => dispatch(deleteItem(itemPid)),
});

export const ItemDetails = connect(
  null,
  mapDispatchToProps
)(ItemDetailsComponent);
