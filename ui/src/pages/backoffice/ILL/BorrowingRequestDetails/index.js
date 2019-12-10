import { connect } from 'react-redux';

import { fetchBorrowingRequestDetails } from './state/actions';
import BorrowingRequestDetailsComponent from './BorrowingRequestDetails';

const mapStateToProps = state => ({
  isLoading: state.borrowingRequestDetails.isLoading,
  error: state.borrowingRequestDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchBorrowingRequestDetails: illRequestPid =>
    dispatch(fetchBorrowingRequestDetails(illRequestPid)),
});

export const BorrowingRequestDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowingRequestDetailsComponent);
