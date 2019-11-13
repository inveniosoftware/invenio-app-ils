import { connect } from 'react-redux';
import { performLoanAction } from '../../state/actions';
import LoanActionsComponent from './LoanActions';

const mapStateToProps = state => ({
  error: state.loanDetails.error,
  loanDetails: state.loanDetails.data,
});

const mapDispatchToProps = dispatch => ({
  performLoanAction: (actionURL, documentPid, patronPid, optionalParams = {}) =>
    dispatch(
      performLoanAction(actionURL, documentPid, patronPid, optionalParams)
    ),
});

export const LoanActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanActionsComponent);
