import { connect } from 'react-redux';
import { fetchDocumentRequestDetails } from '@pages/backoffice/DocumentRequest/DocumentRequestDetails/state/actions';
import DocumentInfoComponent from './DocumentInfo';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentRequestDetails: documentRequestPid =>
    dispatch(fetchDocumentRequestDetails(documentRequestPid)),
});

export const DocumentInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentInfoComponent);
