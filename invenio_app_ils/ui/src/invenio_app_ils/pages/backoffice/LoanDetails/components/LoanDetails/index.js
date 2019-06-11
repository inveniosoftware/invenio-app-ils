import { connect } from 'react-redux';

import LoanDetailsComponent from './LoanDetails';

const mapStateToProps = state => ({
  isLoading: state.loanDetails.isLoading,
  data: state.loanDetails.data,
  error: state.loanDetails.error,
  hasError: state.loanDetails.hasError,
});

export const LoanDetails = connect(mapStateToProps)(LoanDetailsComponent);
