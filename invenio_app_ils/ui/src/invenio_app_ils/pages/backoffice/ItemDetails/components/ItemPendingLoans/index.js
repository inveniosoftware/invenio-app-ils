import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchPendingLoans,
  pendingLoansChangeSortBy,
  pendingLoansChangeSortOrder,
} from './state/actions';
import ItemPendingLoansComponent from './ItemPendingLoans';

const mapStateToProps = state => ({
  data: state.itemPendingLoans.data,
  isLoading: state.itemPendingLoans.isLoading,
  hasError: state.itemPendingLoans.hasError,
  currentSortBy: state.itemPendingLoans.sortBy,
  currentSortOrder: state.itemPendingLoans.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  fetchPendingLoans: (documentPid, itemPid) =>
    dispatch(fetchPendingLoans(documentPid, itemPid)),
  pendingLoansChangeSortBy: (documentPid, itemPid) =>
    dispatch(pendingLoansChangeSortBy(documentPid, itemPid)),
  pendingLoansChangeSortOrder: (documentPid, itemPid) =>
    dispatch(pendingLoansChangeSortOrder(documentPid, itemPid)),
});

export const ItemPendingLoans = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemPendingLoansComponent);
