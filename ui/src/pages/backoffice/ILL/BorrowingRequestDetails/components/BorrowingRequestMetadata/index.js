import { connect } from 'react-redux';

import BorrowingRequestMetadataComponent from './BorrowingRequestMetadata';
import { deleteRequest, rejectRequest } from '../../state/actions';

const mapStateToProps = state => ({
  error: state.borrowingRequestDetails.error,
  borrowingRequestDetails: state.borrowingRequestDetails.data,
});

const mapDispatchToProps = dispatch => ({
  deleteRequest: pid => dispatch(deleteRequest(pid)),
  rejectRequest: (pid, data) => dispatch(rejectRequest(pid, data)),
});

export const BorrowingRequestMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowingRequestMetadataComponent);
