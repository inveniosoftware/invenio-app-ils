import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchItemDetails } from './state/actions';
import ItemDetailsComponent from './ItemDetails';

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemId => dispatch(fetchItemDetails(itemId)),
});

export const ItemDetails = connect(
  state => ({
    fetchLoading: state.itemDetails.fetchLoading,
    data: state.itemDetails.data,
    error: state.itemDetails.error,
  }),
  mapDispatchToProps
)(withRouter(ItemDetailsComponent));
