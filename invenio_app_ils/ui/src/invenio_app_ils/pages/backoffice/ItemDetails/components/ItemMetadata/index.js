import { connect } from 'react-redux';

import ItemMetadataComponent from './ItemMetadata';
import {
  deleteItem,
  fetchItemDetails,
  createNewLoanForItem,
  updateItem,
} from '../../state/actions';

const mapStateToProps = state => ({
  error: state.itemDetails.error,
  itemDetails: state.itemDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemPid => dispatch(fetchItemDetails(itemPid)),
  deleteItem: itemPid => dispatch(deleteItem(itemPid)),
  createNewLoanForItem: (loanData, url) =>
    dispatch(createNewLoanForItem(loanData, url)),
  updateItem: (itemPid, path, value) =>
    dispatch(updateItem(itemPid, path, value)),
});

export const ItemMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemMetadataComponent);
