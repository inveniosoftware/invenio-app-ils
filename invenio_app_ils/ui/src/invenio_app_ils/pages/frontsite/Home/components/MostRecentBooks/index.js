import { connect } from 'react-redux';
import { fetchMostRecentBooks } from './state/actions';
import MostRecentBooksComponent from './MostRecentBooks';

const mapStateToProps = state => ({
  data: state.mostRecentBooks.data,
  error: state.mostRecentBooks.error,
  isLoading: state.mostRecentBooks.isLoading,
  hasError: state.mostRecentBooks.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchMostRecentBooks: () => dispatch(fetchMostRecentBooks()),
});

export const MostRecentBooks = connect(
  mapStateToProps,
  mapDispatchToProps
)(MostRecentBooksComponent);
