import { connect } from 'react-redux';
import { requestNewLoanForBook, resetNewLoanState } from './state/actions';
import RequestNewLoanFormComponent from './RequestNewLoanForm';

const mapStateToProps = state => ({
  isLoading: state.bookDetails.newLoanRequest.isLoading,
  data: state.bookDetails.newLoanRequest.data,
  hasError: state.bookDetails.newLoanRequest.hasError,
});
const mapDispatchToProps = dispatch => ({
  requestNewLoanForBook: (pid, loan, url) =>
    dispatch(requestNewLoanForBook(pid, loan, url)),
  resetNewLoanState: () => dispatch(resetNewLoanState()),
});

export const RequestNewLoanForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestNewLoanFormComponent);
