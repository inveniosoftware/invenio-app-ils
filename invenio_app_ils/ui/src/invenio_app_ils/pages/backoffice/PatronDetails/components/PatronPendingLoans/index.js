import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchPatronPendingLoans,
  patronLoansChangeSortBy,
  patronLoansChangeSortOrder,
} from './state/actions';
import PatronPendingLoansComponent from './PatronPendingLoans';

const mapStateToProps = state => ({
  data: state.patronPendingLoans.data,
  error: state.patronPendingLoans.error,
  isLoading: state.patronPendingLoans.isLoading,
  hasError: state.patronPendingLoans.hasError,
  currentSortBy: state.patronPendingLoans.sortBy,
  currentSortOrder: state.patronPendingLoans.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPendingLoans: patronPid =>
    dispatch(fetchPatronPendingLoans(patronPid)),
  patronLoansChangeSortBy: (documentPid, itemPid, loanState, patronPid) =>
    dispatch(
      patronLoansChangeSortBy(documentPid, itemPid, loanState, patronPid)
    ),
  patronLoansChangeSortOrder: (documentPid, itemPid, loanState, patronPid) =>
    dispatch(
      patronLoansChangeSortOrder(documentPid, itemPid, loanState, patronPid)
    ),
});

export const PatronPendingLoans = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PatronPendingLoansComponent);
