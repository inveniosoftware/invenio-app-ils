import { connect } from 'react-redux';

import { fetchPastLoans } from './state/actions';
import ItemPastLoansComponent from './ItemPastLoans';

const mapStateToProps = state => ({
  data: state.itemPastLoans.data,
  itemDetails: state.itemDetails.data,
  error: state.itemPastLoans.error,
  isLoading: state.itemPastLoans.isLoading,
  hasError: state.itemPastLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPastLoans: itemPid => dispatch(fetchPastLoans(itemPid)),
});

export const ItemPastLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemPastLoansComponent);
