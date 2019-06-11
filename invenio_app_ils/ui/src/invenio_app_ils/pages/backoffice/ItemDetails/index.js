import { connect } from 'react-redux';

import { deleteItem, fetchItemDetails } from './state/actions';
import ItemDetailsContainerComponent from './ItemDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemPid => dispatch(fetchItemDetails(itemPid)),
  deleteItem: itemPid => dispatch(deleteItem(itemPid)),
});

export const ItemDetailsContainer = connect(
  null,
  mapDispatchToProps
)(ItemDetailsContainerComponent);
