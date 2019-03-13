import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPastLoans } from './state/actions';
import ItemPastLoansComponent from './ItemPastLoans';

const mapStateToProps = state => ({
  data: state.itemPastLoans.data,
  error: state.itemPastLoans.error,
  isLoading: state.itemPastLoans.isLoading,
  hasError: state.itemPastLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPastLoans: itemPid => dispatch(fetchPastLoans(itemPid)),
});

export const ItemPastLoans = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemPastLoansComponent);
