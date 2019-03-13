import { connect } from 'react-redux';
import { fetchRequestedWithAvailableItems } from './state/actions';
import DocumentsCardComponent from './DocumentsCard';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
  data: state.documentsCard.data,
  error: state.documentsCard.error,
  isLoading: state.documentsCard.isLoading,
  hasError: state.documentsCard.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchRequestedWithAvailableItems: () =>
    dispatch(fetchRequestedWithAvailableItems()),
});

export const DocumentsCard = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentsCardComponent);
