import { connect } from 'react-redux';
import { fetchMostLoanedBooks } from './state/actions';
import MostLoanedBooksComponent from './MostLoanedBooks';

const mapStateToProps = state => ({
  data: state.mostLoanedBooks.data,
  error: state.mostLoanedBooks.error,
  isLoading: state.mostLoanedBooks.isLoading,
  hasError: state.mostLoanedBooks.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchMostLoanedBooks: () => dispatch(fetchMostLoanedBooks()),
});

export const MostLoanedBooks = connect(
  mapStateToProps,
  mapDispatchToProps
)(MostLoanedBooksComponent);
