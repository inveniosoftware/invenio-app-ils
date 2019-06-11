import { connect } from 'react-redux';

import { fetchLoanDetails } from './state/actions';
import LoanDetailsContainerComponent from './LoanDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchLoanDetails: loanPid => dispatch(fetchLoanDetails(loanPid)),
});

export const LoanDetailsContainer = connect(
  null,
  mapDispatchToProps
)(LoanDetailsContainerComponent);
