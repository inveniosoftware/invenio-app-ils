import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchPatronLoans,
  patronLoansChangeSortBy,
  patronLoansChangeSortOrder,
} from './state/actions';
import PatronLoansTableComponent from './PatronLoansTable';

const mapStateToProps = state => ({
  data: state.patronLoansTable.data,
  isLoading: state.patronLoansTable.isLoading,
  hasError: state.patronLoansTable.hasError,
  currentSortBy: state.patronLoansTable.sortBy,
  currentSortOrder: state.patronLoansTable.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronLoans: (documentPid, itemPid, loanState, patronPid) =>
    dispatch(fetchPatronLoans(documentPid, itemPid, loanState, patronPid)),
  patronLoansChangeSortBy: (documentPid, itemPid, loanState, patronPid) =>
    dispatch(
      patronLoansChangeSortBy(documentPid, itemPid, loanState, patronPid)
    ),
  patronLoansChangeSortOrder: (documentPid, itemPid, loanState, patronPid) =>
    dispatch(
      patronLoansChangeSortOrder(documentPid, itemPid, loanState, patronPid)
    ),
});

export const PatronLoansTable = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PatronLoansTableComponent);
