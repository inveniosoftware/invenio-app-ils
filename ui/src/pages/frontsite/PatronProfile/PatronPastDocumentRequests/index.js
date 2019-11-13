import { connect } from 'react-redux';
import { fetchPatronPastDocumentRequests } from './state/actions';
import PatronPastDocumentRequestsComponent from './PatronPastDocumentRequests';

const mapStateToProps = state => ({
  ...state.patronPastDocumentRequests,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronDocumentRequests: (patronPid, page) =>
    dispatch(fetchPatronPastDocumentRequests(patronPid, page)),
});

export const PatronPastDocumentRequests = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPastDocumentRequestsComponent);
