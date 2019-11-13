import { connect } from 'react-redux';
import { fetchRequestedWithAvailableItems } from './state/actions';
import DocumentsCardComponent from './DocumentsCard';

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

export const DocumentsCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentsCardComponent);
