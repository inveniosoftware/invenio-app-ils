import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchBookDetails } from './state/actions';
import BookDetailsContainerComponent from './BookDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchBookDetails: documentPid => dispatch(fetchBookDetails(documentPid)),
});

export const BookDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(BookDetailsContainerComponent);
