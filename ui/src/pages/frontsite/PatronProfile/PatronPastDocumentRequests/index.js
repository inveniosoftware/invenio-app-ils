import { connect } from 'react-redux';
import { fetchPatronPastDocumentRequests } from './state/actions';
import PatronPastDocumentRequestsComponent from './PatronPastDocumentRequests';

const mapStateToProps = state => ({
  ...state.patronPastDocumentRequests,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronDocumentRequests: (patronPid, optionalParams = {}) =>
    dispatch(fetchPatronPastDocumentRequests(patronPid, optionalParams)),
});

export const PatronPastDocumentRequests = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPastDocumentRequestsComponent);
