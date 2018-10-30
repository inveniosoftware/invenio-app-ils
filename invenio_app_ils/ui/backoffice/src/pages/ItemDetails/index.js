import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchItemDetails } from './state/actions';
import ItemDetailsComponent from './ItemDetails';

const mapStateToProps = state => ({
  fetchLoading: state.itemDetails.fetchLoading,
  data: state.itemDetails.data,
  error: state.itemDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemId => dispatch(fetchItemDetails(itemId)),
});

export const ItemDetails = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemDetailsComponent);
