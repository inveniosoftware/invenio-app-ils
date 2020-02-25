import { connect } from 'react-redux';

import { deleteItem } from '../../state/actions';
import ItemActionMenuComponent from './ItemActionMenu';

const mapStateToProps = state => ({
  isLoading: state.itemDetails.isLoading,
  error: state.itemDetails.error,
  item: state.itemDetails.data,
});

const mapDispatchToProps = dispatch => ({
  deleteItem: itemPid => dispatch(deleteItem(itemPid)),
});

export const ItemActionMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemActionMenuComponent);
