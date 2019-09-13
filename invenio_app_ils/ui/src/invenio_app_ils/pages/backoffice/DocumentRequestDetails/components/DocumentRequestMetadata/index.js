import { connect } from 'react-redux';

import DocumentRequestMetadataComponent from './DocumentRequestMetadata';
import { deleteRequest } from '../../state/actions';

const mapStateToProps = state => ({
  error: state.documentRequestDetails.error,
  documentRequestDetails: state.documentRequestDetails.data,
});

const mapDispatchToProps = dispatch => ({
  deleteRequest: pid => dispatch(deleteRequest(pid)),
});

export const DocumentRequestMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentRequestMetadataComponent);
