import { connect } from 'react-redux';

import DocumentRequestDetailsComponent from './DocumentRequestDetails';

const mapStateToProps = state => ({
  isLoading: state.documentRequestDetails.isLoading,
  data: state.documentRequestDetails.data,
  error: state.documentRequestDetails.error,
  hasError: state.documentRequestDetails.hasError,
});

export const DocumentRequestDetails = connect(mapStateToProps)(
  DocumentRequestDetailsComponent
);
