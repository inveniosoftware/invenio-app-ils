import { connect } from 'react-redux';
import { performLoanAction } from '../../state/actions';
import LoanActionsComponent from './LoanActions';

const mapStateToProps = state => ({
  error: state.loanDetails.error,
  loanDetails: state.loanDetails.data,
});

const mapDispatchToProps = dispatch => ({
  performLoanAction: (pid, loan, url) =>
    dispatch(performLoanAction(pid, loan, url)),
});

export const LoanActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanActionsComponent);
