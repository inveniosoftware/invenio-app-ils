import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLoanDetails, postLoanAction } from './state/actions';
import LoanDetailsContainerComponent from './LoanDetailsContainer';

const mapStateToProps = state => ({
  data: state.loanDetails.data,
  error: state.loanDetails.error,
  isLoading: state.loanDetails.isLoading,
  actionLoading: state.loanDetails.actionLoading,
  loanActionError: state.loanDetails.loanActionError,
});

const mapDispatchToProps = dispatch => ({
  fetchLoanDetails: loanId => dispatch(fetchLoanDetails(loanId)),
  postLoanAction: (url, data) => dispatch(postLoanAction(url, data)),
});

export const LoanDetailsContainer = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LoanDetailsContainerComponent);
