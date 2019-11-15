import { connect } from 'react-redux';

import ItemMetadataComponent from './ItemMetadata';
import {
  deleteItem,
  fetchItemDetails,
  checkoutItem,
  updateItem,
} from '../../state/actions';

const mapStateToProps = state => ({
  error: state.itemDetails.error,
  itemDetails: state.itemDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemPid => dispatch(fetchItemDetails(itemPid)),
  deleteItem: itemPid => dispatch(deleteItem(itemPid)),
  checkoutItem: (documentPid, itemPid, patronPid, force = false) =>
    dispatch(checkoutItem(documentPid, itemPid, patronPid, force)),
  updateItem: (itemPid, path, value) =>
    dispatch(updateItem(itemPid, path, value)),
});

export const ItemMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemMetadataComponent);
