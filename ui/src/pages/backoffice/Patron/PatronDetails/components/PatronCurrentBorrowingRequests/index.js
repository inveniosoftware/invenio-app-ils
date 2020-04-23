import { connect } from 'react-redux';
import { fetchPatronCurrentBorrowingRequests } from '@state/PatronCurrentBorrowingRequests/actions';
import PatronCurrentBorrowingRequestsComponent from './PatronCurrentBorrowingRequests';

const mapStateToProps = state => ({
  patronDetails: state.patronDetails.data,
  ...state.patronCurrentBorrowingRequests,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronCurrentBorrowingRequests: patronPid =>
    dispatch(fetchPatronCurrentBorrowingRequests(patronPid)),
});

export const PatronCurrentBorrowingRequests = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCurrentBorrowingRequestsComponent);
