import { connect } from 'react-redux';
import BookResults from './BookResults';
import { fetchBookResults } from './state/actions';

const mapDispatchToProps = dispatch => ({
  fetchBookResults: () => dispatch(fetchBookResults()),
});
export default connect(
  state => ({
    isLoading: state.bookResults.isLoading,
    data: state.bookResults.data,
  }),
  mapDispatchToProps
)(BookResults);

export { default as bookResultsReducer } from './state/reducer';
