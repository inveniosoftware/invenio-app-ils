import { connect } from 'react-redux';

import {
  acceptRequest,
  fetchDocumentRequestDetails,
} from '@pages/backoffice/DocumentRequest/DocumentRequestDetails/state/actions';
import ReviewStepContentComponent from './ReviewStep';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentRequestDetails: documentRequestPid =>
    dispatch(fetchDocumentRequestDetails(documentRequestPid)),
  acceptRequest: documentRequestPid =>
    dispatch(acceptRequest(documentRequestPid)),
});

export const ReviewStepContent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewStepContentComponent);

export { ReviewStep } from './ReviewStep';
