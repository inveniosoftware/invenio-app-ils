import { connect } from 'react-redux';

import { fetchBorrowingRequestDetails } from './state/actions';
import BorrowingRequestDetailsComponent from './BorrowingRequestDetails';

const mapStateToProps = state => ({
  data: state.borrowingRequestDetails.data,
  isLoading: state.borrowingRequestDetails.isLoading,
  error: state.borrowingRequestDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchBorrowingRequestDetails: brwReqPid =>
    dispatch(fetchBorrowingRequestDetails(brwReqPid)),
});

export const BorrowingRequestDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowingRequestDetailsComponent);
