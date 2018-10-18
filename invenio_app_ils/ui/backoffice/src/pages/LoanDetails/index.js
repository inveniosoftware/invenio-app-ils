import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLoanDetails, postLoanAction } from './state/actions';
import detailsClass from './LoanDetails';

const mapDispatchToProps = dispatch => ({
  fetchLoanDetails: loanid => dispatch(fetchLoanDetails(loanid)),
  postLoanAction: (url, data) => dispatch(postLoanAction(url, data)),
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
)(withRouter(detailsClass));
