import { connect } from 'react-redux';

import { fetchDocumentRequestDetails } from '@pages/backoffice/DocumentRequest/DocumentRequestDetails/state/actions';
import StepsActionsComponent from './StepsActions';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentRequestDetails: documentRequestPid =>
    dispatch(fetchDocumentRequestDetails(documentRequestPid)),
});

export const StepsActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(StepsActionsComponent);
