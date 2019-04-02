import { connect } from 'react-redux';
import { requestNewLoanForBook } from './state/actions';
import RequestNewLoanFormComponent from './RequestNewLoanForm';

const mapStateToProps = state => ({
  isLoading: state.bookDetails.newLoanRequest.isLoading,
  data: state.bookDetails.newLoanRequest.data,
  error: state.bookDetails.newLoanRequest.error,
  hasError: state.bookDetails.newLoanRequest.hasError,
});
const mapDispatchToProps = dispatch => ({
  requestNewLoanForBook: (pid, loan, url) =>
    dispatch(requestNewLoanForBook(pid, loan, url)),
});

export const RequestNewLoanForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestNewLoanFormComponent);
