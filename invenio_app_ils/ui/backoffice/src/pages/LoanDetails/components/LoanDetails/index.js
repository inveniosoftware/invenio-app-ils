import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LoanDetailsComponent from './LoanDetails';

const mapStateToProps = state => ({
  isLoading: state.loanDetails.isLoading,
  isActionLoading: state.loanDetails.isActionLoading,
  data: state.loanDetails.data,
  hasError: state.loanDetails.hasError,
  actionHasError: state.loanDetails.actionHasError,
});

export const LoanDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(LoanDetailsComponent);
