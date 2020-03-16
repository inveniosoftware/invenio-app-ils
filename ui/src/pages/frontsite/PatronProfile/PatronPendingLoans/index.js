import { connect } from 'react-redux';
import { fetchPatronPendingLoans } from '@state/PatronPendingLoans/actions';
import { performLoanAction } from '@pages/backoffice/Loan/LoanDetails/state/actions';
import PatronPendingLoansComponent from './PatronPendingLoans';

const mapStateToProps = state => ({
  ...state.patronPendingLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPendingLoans: (patronPid, page, size) =>
    dispatch(fetchPatronPendingLoans(patronPid, page, size)),
  performLoanAction: (actionURL, documentPid, patronPid, optionalParams = {}) =>
    dispatch(
      performLoanAction(actionURL, documentPid, patronPid, optionalParams)
    ),
});

export const PatronPendingLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPendingLoansComponent);
