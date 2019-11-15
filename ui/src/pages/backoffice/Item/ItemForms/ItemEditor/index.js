import { connect } from 'react-redux';

import { fetchItemDetails } from '../../ItemDetails/state/actions';
import { ItemEditor as ItemEditorComponent } from './ItemEditor';

const mapStateToProps = state => ({
  isLoading: state.itemDetails.isLoading,
  data: state.itemDetails.data,
  error: state.itemDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemPid => dispatch(fetchItemDetails(itemPid)),
});

export const ItemEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemEditorComponent);
