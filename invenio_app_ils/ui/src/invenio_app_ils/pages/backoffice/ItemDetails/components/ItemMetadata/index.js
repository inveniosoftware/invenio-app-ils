import { connect } from 'react-redux';

import ItemMetadataComponent from './ItemMetadata';
import {
  deleteItem,
  fetchItemDetails,
  createNewLoanForItem,
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
});

export const ItemMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemMetadataComponent);
