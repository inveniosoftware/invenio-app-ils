import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LoanDetailsComponent from './LoanDetails';

const mapStateToProps = state => ({
  isLoading: state.loanDetails.isLoading,
  data: state.loanDetails.data,
  error: state.loanDetails.error,
  hasError: state.loanDetails.hasError,
});

export const LoanDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(LoanDetailsComponent);
