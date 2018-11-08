import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchItemDetails } from './state/actions';
import ItemDetailsContainerComponent from './ItemDetailsContainer';

const mapStateToProps = state => ({
  isLoading: state.itemDetails.isLoading,
  data: state.itemDetails.data,
  error: state.itemDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemId => dispatch(fetchItemDetails(itemId)),
});

export const ItemDetailsContainer = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemDetailsContainerComponent);
