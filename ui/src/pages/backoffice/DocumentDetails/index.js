import { connect } from 'react-redux';

import { deleteDocument, fetchDocumentDetails } from './state/actions';
import DocumentDetailsContainerComponent from './DocumentDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
  deleteDocument: documentPid => dispatch(deleteDocument(documentPid)),
});

export const DocumentDetailsContainer = connect(
  null,
  mapDispatchToProps
)(DocumentDetailsContainerComponent);
