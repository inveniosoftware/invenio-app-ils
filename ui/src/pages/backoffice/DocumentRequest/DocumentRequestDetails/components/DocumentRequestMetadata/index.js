import { connect } from 'react-redux';

import DocumentRequestMetadataComponent from './DocumentRequestMetadata';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

export const DocumentRequestMetadata = connect(
  mapStateToProps,
  null
)(DocumentRequestMetadataComponent);
