import { connect } from 'react-redux';
import BookDetails from './BookDetails';
import { fetchBookDetails } from './state/actions';

const mapDispatchToProps = dispatch => ({
  fetchBookDetails: recid => dispatch(fetchBookDetails(recid)),
});
export default connect(
  state => ({
    isLoading: state.bookDetails.isLoading,
    data: state.bookDetails.data,
  }),
  mapDispatchToProps
)(BookDetails);
