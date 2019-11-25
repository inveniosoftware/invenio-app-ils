import { connect } from 'react-redux';

import { fetchLoanDetails } from './state/actions';
import LoanDetailsComponent from './LoanDetails';

const mapStateToProps = state => ({
  isLoading: state.loanDetails.isLoading,
  error: state.loanDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchLoanDetails: loanPid => dispatch(fetchLoanDetails(loanPid)),
});

export const LoanDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanDetailsComponent);
