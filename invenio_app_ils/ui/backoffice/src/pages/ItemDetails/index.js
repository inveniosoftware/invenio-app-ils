import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchItemDetails } from './state/actions';
import ItemDetailsComponent from './ItemDetails';

const mapStateToProps = state => ({
  isLoading: state.itemDetails.isLoading,
  data: state.itemDetails.data,
  error: state.itemDetails.error,
});

const mapActions = dispatch => ({
  fetchItemDetails: itemId => dispatch(fetchItemDetails(itemId)),
});

export const ItemDetails = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapActions
  )
)(ItemDetailsComponent);
