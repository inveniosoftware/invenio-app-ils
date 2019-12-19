import { connect } from 'react-redux';

import DocumentMetadataComponent from './DocumentMetadata';
import {
  deleteDocument,
  fetchDocumentDetails,
  updateDocument,
  requestLoanForPatron,
} from '../../state/actions';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.documentDetails.error,
  relations: state.documentRelations.data,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
  deleteDocument: documentPid => dispatch(deleteDocument(documentPid)),
  updateDocument: (documentPid, path, value) =>
    dispatch(updateDocument(documentPid, path, value)),
  requestLoanForPatron: (documentPid, patronPid, optionalParams = {}) =>
    dispatch(requestLoanForPatron(documentPid, patronPid, optionalParams)),
});

export const DocumentMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentMetadataComponent);
