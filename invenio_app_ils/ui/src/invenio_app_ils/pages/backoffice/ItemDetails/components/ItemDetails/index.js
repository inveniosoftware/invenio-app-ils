import { connect } from 'react-redux';

import ItemDetailsComponent from './ItemDetails';

const mapStateToProps = state => ({
  isLoading: state.itemDetails.isLoading,
  data: state.itemDetails.data,
  error: state.itemDetails.error,
  hasError: state.itemDetails.hasError,
});

export const ItemDetails = connect(mapStateToProps)(ItemDetailsComponent);
