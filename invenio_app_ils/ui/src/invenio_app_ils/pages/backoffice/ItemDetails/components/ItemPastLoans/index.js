import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPastLoans } from './state/actions';
import ItemPastLoansComponent from './ItemPastLoans';

const mapStateToProps = state => ({
  data: state.itemPastLoans.data,
  isLoading: state.itemPastLoans.isLoading,
  hasError: state.itemPastLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPastLoans: (documentPid, itemPid) =>
    dispatch(fetchPastLoans(documentPid, itemPid)),
});

export const ItemPastLoans = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemPastLoansComponent);
