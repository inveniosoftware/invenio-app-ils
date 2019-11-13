import { connect } from 'react-redux';

import { fetchDocumentRequestDetails } from './state/actions';
import DocumentRequestDetailsContainerComponent from './DocumentRequestDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchDocumentRequestDetails: documentRequestPid =>
    dispatch(fetchDocumentRequestDetails(documentRequestPid)),
});

export const DocumentRequestDetailsContainer = connect(
  null,
  mapDispatchToProps
)(DocumentRequestDetailsContainerComponent);
