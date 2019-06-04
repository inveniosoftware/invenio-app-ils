import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DocumentMetadataComponent from './DocumentMetadata';
import {
  deleteDocument,
  fetchDocumentDetails,
  updateDocument,
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
});

export const DocumentMetadata = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentMetadataComponent);
