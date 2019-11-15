import { connect } from 'react-redux';

import { fetchLoanDetails } from './state/actions';
import LoanDetailsComponent from './LoanDetails';

const mapDispatchToProps = dispatch => ({
  fetchLoanDetails: loanPid => dispatch(fetchLoanDetails(loanPid)),
});

export const LoanDetails = connect(
  null,
  mapDispatchToProps
)(LoanDetailsComponent);
