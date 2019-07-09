import { connect } from 'react-redux';
import {
  fetchPatronPendingLoans,
  patronLoansChangeSortBy,
  patronLoansChangeSortOrder,
} from '../../../../../common/state/PatronPendingLoans/actions';
import PatronPendingLoansComponent from './PatronPendingLoans';

const mapStateToProps = state => ({
  ...state.patronPendingLoans,
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

export const PatronPendingLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPendingLoansComponent);
