import { connect } from 'react-redux';
import { fetchDocumentsDetails } from './state/actions';
import DocumentsDetailsContainerComponent from './DocumentsDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchDocumentsDetails: documentPid =>
    dispatch(fetchDocumentsDetails(documentPid)),
});

export const DocumentsDetailsContainer = connect(
  null,
  mapDispatchToProps
)(DocumentsDetailsContainerComponent);
