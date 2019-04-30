import { connect } from 'react-redux';
import { requestNewLoanForRecord } from './state/actions';
import RequestNewLoanFormComponent from './RequestNewLoanForm';

const mapStateToProps = state => ({
  isLoading: state.documentsDetails.newLoanRequest.isLoading,
  data: state.documentsDetails.newLoanRequest.data,
  error: state.documentsDetails.newLoanRequest.error,
  hasError: state.documentsDetails.newLoanRequest.hasError,
});
const mapDispatchToProps = dispatch => ({
  requestNewLoanForRecord: (pid, loan, url) =>
    dispatch(requestNewLoanForRecord(pid, loan, url)),
});

export const RequestNewLoanForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestNewLoanFormComponent);
