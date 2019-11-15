import { connect } from 'react-redux';

import { fetchDocumentRequestDetails } from './state/actions';
import DocumentRequestDetailsComponent from './DocumentRequestDetails';

const mapDispatchToProps = dispatch => ({
  fetchDocumentRequestDetails: documentRequestPid =>
    dispatch(fetchDocumentRequestDetails(documentRequestPid)),
});

export const DocumentRequestDetails = connect(
  null,
  mapDispatchToProps
)(DocumentRequestDetailsComponent);
