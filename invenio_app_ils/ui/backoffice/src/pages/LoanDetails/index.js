import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLoanDetails, postLoanAction } from './state/actions';
import LoanDetailsComponent from './LoanDetails';

const mapStateToProps = state => ({
  isLoading: state.loanDetails.isLoading,
  actionLoading: state.loanDetails.actionLoading,
  data: state.loanDetails.data,
  loanActionError: state.loanDetails.loanActionError,
  error: state.loanDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchLoanDetails: loanId => dispatch(fetchLoanDetails(loanId)),
  postLoanAction: (url, data) => dispatch(postLoanAction(url, data)),
});

export const LoanDetails = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LoanDetailsComponent);
