import { connect } from 'react-redux';

import DocumentMetadataComponent from './DocumentMetadata';
import {
  deleteDocument,
  fetchDocumentDetails,
  updateDocument,
  requestLoanForDocument,
  setRestrictionsOnDocument,
} from '../../state/actions';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.documentDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
  deleteDocument: documentPid => dispatch(deleteDocument(documentPid)),
  updateDocument: (documentPid, path, value) =>
    dispatch(updateDocument(documentPid, path, value)),
  requestLoanForDocument: (docPid, patronPid, url) =>
    dispatch(requestLoanForDocument(docPid, patronPid, url)),
  setRestrictionsOnDocument: (pid, accessList) =>
    dispatch(setRestrictionsOnDocument(pid, accessList)),
});

export const DocumentMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentMetadataComponent);
