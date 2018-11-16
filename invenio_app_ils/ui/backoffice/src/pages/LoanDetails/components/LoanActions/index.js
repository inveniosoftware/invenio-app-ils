import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { performLoanAction } from '../../state/actions';
import LoanActionsComponent from './LoanActions';

const mapStateToProps = state => ({
  loanDetails: state.loanDetails.data,
});

const mapDispatchToProps = dispatch => ({
  performLoanAction: (pid, loan, url) =>
    dispatch(performLoanAction(pid, loan, url)),
});

export const LoanActions = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LoanActionsComponent);
