import { connect } from 'react-redux';
import { fetchPendingOverdueDocuments } from './state/actions';
import PendingOverdueDocumentsListComponent from './PendingOverdueDocumentsList';

const mapStateToProps = state => ({
  data: state.pendingOverdueDocuments.data,
  error: state.pendingOverdueDocuments.error,
  isLoading: state.pendingOverdueDocuments.isLoading,
  hasError: state.pendingOverdueDocuments.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPendingOverdueDocuments: () => dispatch(fetchPendingOverdueDocuments()),
});

export const PendingOverdueDocumentsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingOverdueDocumentsListComponent);
