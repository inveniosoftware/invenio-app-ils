import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BookDetailsComponent from './BookDetails';

const mapStateToProps = state => ({
  isLoading: state.bookDetails.isLoading,
  data: state.bookDetails.data,
  hasError: state.bookDetails.hasError,
});

export const BookDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(BookDetailsComponent);
