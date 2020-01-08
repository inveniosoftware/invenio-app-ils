import { connect } from 'react-redux';

import { fetchDocumentDetails } from './state/actions';
import DocumentDetailsComponent from './DocumentDetails';

const mapStateToProps = state => ({
  isLoading: state.documentDetails.isLoading,
  error: state.documentDetails.error,
  data: state.documentDetails.data,
  hasError: state.documentDetails.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
});

export const DocumentDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentDetailsComponent);
