import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ItemDetailsComponent from './ItemDetails';

const mapStateToProps = state => ({
  isLoading: state.itemDetails.isLoading,
  data: state.itemDetails.data,
  error: state.itemDetails.error,
  hasError: state.itemDetails.hasError,
});

export const ItemDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(ItemDetailsComponent);
