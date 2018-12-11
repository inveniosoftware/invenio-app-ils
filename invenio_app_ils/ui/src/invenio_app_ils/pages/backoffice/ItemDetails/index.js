import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchItemDetails } from './state/actions';
import ItemDetailsContainerComponent from './ItemDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemPid => dispatch(fetchItemDetails(itemPid)),
});

export const ItemDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(ItemDetailsContainerComponent);
