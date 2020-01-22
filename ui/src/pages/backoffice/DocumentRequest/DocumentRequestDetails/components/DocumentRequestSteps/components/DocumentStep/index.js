import { connect } from 'react-redux';

import { fetchDocumentRequestDetails } from '@pages/backoffice/DocumentRequest/DocumentRequestDetails/state/actions';
import DocumentStepContentComponent from './DocumentStep';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentRequestDetails: documentRequestPid =>
    dispatch(fetchDocumentRequestDetails(documentRequestPid)),
});

export const DocumentStepContent = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentStepContentComponent);

export { DocumentStep } from './DocumentStep';
