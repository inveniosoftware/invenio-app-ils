import { connect } from 'react-redux';
import LoanRequestFormComponent from './LoanRequestForm';
import { requestLoanForDocument } from './state/actions';

const mapDispatchToProps = dispatch => ({
  requestLoanForDocument: (docPid, loanRequestData) =>
    dispatch(requestLoanForDocument(docPid, loanRequestData)),
});

export const LoanRequestForm = connect(
  null,
  mapDispatchToProps
)(LoanRequestFormComponent);
