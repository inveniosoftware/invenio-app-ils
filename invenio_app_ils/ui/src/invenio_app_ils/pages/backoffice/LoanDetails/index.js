import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLoanDetails } from './state/actions';
import LoanDetailsContainerComponent from './LoanDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchLoanDetails: loanPid => dispatch(fetchLoanDetails(loanPid)),
});

export const LoanDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(LoanDetailsContainerComponent);
