import { connect } from 'react-redux';

import DocumentDetailsComponent from './DocumentDetails';

const mapStateToProps = state => ({
  isLoading: state.documentDetails.isLoading,
  data: state.documentDetails.data,
  error: state.documentDetails.error,
  hasError: state.documentDetails.hasError,
});

export const DocumentDetails = connect(mapStateToProps)(
  DocumentDetailsComponent
);
