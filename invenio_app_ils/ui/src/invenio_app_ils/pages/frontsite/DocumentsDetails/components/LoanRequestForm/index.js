import { connect } from 'react-redux';
import LoanRequestFormComponent from './LoanRequestForm';
import { requestLoanForDocument } from './state/actions';

const mapDispatchToProps = dispatch => ({
  requestLoanForDocument: (documentPid, optionalParams = {}) =>
    dispatch(requestLoanForDocument(documentPid, optionalParams)),
});

export const LoanRequestForm = connect(
  null,
  mapDispatchToProps
)(LoanRequestFormComponent);
