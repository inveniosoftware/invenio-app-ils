import { connect } from 'react-redux';
import { fetchDocumentsDetails } from './state/actions';
import DocumentsDetailsContainerComponent from './DocumentsDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchDocumentsDetails: documentPid =>
    dispatch(fetchDocumentsDetails(documentPid)),
});

const mapStateToProps = state => ({
  isLoading: state.documentsDetails.isLoading,
  data: state.documentsDetails.data,
  hasError: state.documentsDetails.hasError,
});

export const DocumentsDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentsDetailsContainerComponent);
