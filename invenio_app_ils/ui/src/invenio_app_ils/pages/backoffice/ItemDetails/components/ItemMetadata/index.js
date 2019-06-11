import { connect } from 'react-redux';

import ItemMetadataComponent from './ItemMetadata';
import { deleteItem, fetchItemDetails } from '../../state/actions';

const mapStateToProps = state => ({
  error: state.itemDetails.error,
  itemDetails: state.itemDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemPid => dispatch(fetchItemDetails(itemPid)),
  deleteItem: itemPid => dispatch(deleteItem(itemPid)),
});

export const ItemMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemMetadataComponent);
