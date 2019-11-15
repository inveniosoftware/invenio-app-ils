import { connect } from 'react-redux';

import { deleteDocument, fetchDocumentDetails } from './state/actions';
import DocumentDetailsComponent from './DocumentDetails';

const mapStateToProps = state => ({
  isLoading: state.documentDetails.isLoading,
  error: state.documentDetails.error,
  hasError: state.documentDetails.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
  deleteDocument: documentPid => dispatch(deleteDocument(documentPid)),
});

export const DocumentDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentDetailsComponent);
