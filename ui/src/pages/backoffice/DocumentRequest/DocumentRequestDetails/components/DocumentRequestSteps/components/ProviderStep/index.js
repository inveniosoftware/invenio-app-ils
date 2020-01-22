import { connect } from 'react-redux';

import { fetchDocumentRequestDetails } from '@pages/backoffice/DocumentRequest/DocumentRequestDetails/state/actions';
import ProviderStepContentComponent from './ProviderStep';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentRequestDetails: documentRequestPid =>
    dispatch(fetchDocumentRequestDetails(documentRequestPid)),
});

export const ProviderStepContent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProviderStepContentComponent);

export { ProviderStep } from './ProviderStep';
