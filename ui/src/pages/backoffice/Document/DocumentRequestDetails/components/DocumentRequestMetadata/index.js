import { connect } from 'react-redux';

import DocumentRequestMetadataComponent from './DocumentRequestMetadata';
import { deleteRequest, rejectRequest } from '../../state/actions';

const mapStateToProps = state => ({
  error: state.documentRequestDetails.error,
  documentRequestDetails: state.documentRequestDetails.data,
});

const mapDispatchToProps = dispatch => ({
  deleteRequest: pid => dispatch(deleteRequest(pid)),
  rejectRequest: (pid, data) => dispatch(rejectRequest(pid, data)),
});

export const DocumentRequestMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentRequestMetadataComponent);
