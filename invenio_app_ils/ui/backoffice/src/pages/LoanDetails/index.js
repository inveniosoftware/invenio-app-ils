import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLoanDetails, postLoanAction } from './state/actions';
import LoanDetailsComponent from './LoanDetails';

const mapDispatchToProps = dispatch => ({
  fetchLoanDetails: loanId => dispatch(fetchLoanDetails(loanId)),
  postLoanAction: (loanId, data) => dispatch(postLoanAction(loanId, data)),
});

export const LoanDetails = connect(
  state => ({
    fetchLoading: state.loanDetails.fetchLoading,
    actionLoading: state.loanDetails.actionLoading,
    data: state.loanDetails.data,
    loanActionError: state.loanDetails.loanActionError,
    error: state.loanDetails.error,
  }),
  mapDispatchToProps
)(withRouter(LoanDetailsComponent));
