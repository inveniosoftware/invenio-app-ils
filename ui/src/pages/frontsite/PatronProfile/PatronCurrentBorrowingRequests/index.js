import { connect } from 'react-redux';
import { fetchPatronCurrentBorrowingRequests } from '@state/PatronCurrentBorrowingRequests/actions';
import PatronCurrentBorrowingRequestsComponent from './PatronCurrentBorrowingRequests';

const mapStateToProps = state => ({
  ...state.patronCurrentBorrowingRequests,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronCurrentBorrowingRequests: (patronPid, page) =>
    dispatch(fetchPatronCurrentBorrowingRequests(patronPid, page)),
});

export const PatronCurrentBorrowingRequests = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCurrentBorrowingRequestsComponent);
