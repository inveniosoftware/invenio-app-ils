import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { deleteDocument, fetchDocumentDetails } from './state/actions';
import DocumentDetailsContainerComponent from './DocumentDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
  deleteDocument: documentPid => dispatch(deleteDocument(documentPid)),
});

export const DocumentDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(DocumentDetailsContainerComponent);
