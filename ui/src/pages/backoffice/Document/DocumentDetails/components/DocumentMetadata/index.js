import { connect } from 'react-redux';

import DocumentMetadataComponent from './DocumentMetadata';
import { fetchDocumentDetails } from '../../state/actions';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.documentDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
});

export const DocumentMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentMetadataComponent);
