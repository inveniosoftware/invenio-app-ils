import { connect } from 'react-redux';
import { fetchPatronDocumentRequests } from './state/actions';
import PatronCurrentDocumentRequestsComponent from './PatronCurrentDocumentRequests';

const mapStateToProps = state => ({
  ...state.patronCurrentDocumentRequests,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronDocumentRequests: (patronPid, page) =>
    dispatch(fetchPatronDocumentRequests(patronPid, page)),
});

export const PatronCurrentDocumentRequests = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCurrentDocumentRequestsComponent);
