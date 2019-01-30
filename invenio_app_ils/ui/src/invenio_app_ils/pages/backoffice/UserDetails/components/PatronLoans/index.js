import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchPatronLoans,
  patronLoansChangeSortBy,
  patronLoansChangeSortOrder,
} from './state/actions';
import PatronLoansComponent from './PatronLoans';

const mapStateToProps = state => ({
  data: state.patronLoans.data,
  isLoading: state.patronLoans.isLoading,
  hasError: state.patronLoans.hasError,
  currentSortBy: state.patronLoans.sortBy,
  currentSortOrder: state.patronLoans.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronLoans: patronPid => dispatch(fetchPatronLoans(patronPid)),
  patronLoansChangeSortBy: (documentPid, itemPid, loanState, patronPid) =>
    dispatch(
      patronLoansChangeSortBy(documentPid, itemPid, loanState, patronPid)
    ),
  patronLoansChangeSortOrder: (documentPid, itemPid, loanState, patronPid) =>
    dispatch(
      patronLoansChangeSortOrder(documentPid, itemPid, loanState, patronPid)
    ),
});

export const PatronLoans = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PatronLoansComponent);
