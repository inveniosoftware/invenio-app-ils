import { connect } from 'react-redux';
import { fetchPatronDocumentRequests } from './state/actions';
import { rejectRequest } from '@pages/backoffice/DocumentRequest/DocumentRequestDetails/state/actions';
import PatronCurrentDocumentRequestsComponent from './PatronCurrentDocumentRequests';

const mapStateToProps = state => ({
  ...state.patronCurrentDocumentRequests,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronDocumentRequests: (patronPid, page) =>
    dispatch(fetchPatronDocumentRequests(patronPid, page)),
  rejectRequest: (pid, data) => dispatch(rejectRequest(pid, data)),
});

export const PatronCurrentDocumentRequests = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCurrentDocumentRequestsComponent);
