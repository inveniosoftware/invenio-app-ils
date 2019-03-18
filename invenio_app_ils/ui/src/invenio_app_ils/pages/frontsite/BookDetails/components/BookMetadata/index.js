import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BookMetadataComponent from './BookMetadata';
import { fetchBookDetails } from '../../state/actions';

const mapStateToProps = state => ({
  bookDetails: state.bookDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchBookDetails: itemPid => dispatch(fetchBookDetails(itemPid)),
});

export const BookMetadata = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BookMetadataComponent);
