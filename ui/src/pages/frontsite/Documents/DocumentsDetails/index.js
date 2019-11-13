import { connect } from 'react-redux';
import { fetchDocumentsDetails } from './state/actions';
import DocumentsDetailsContainerComponent from './DocumentsDetails';

const mapDispatchToProps = dispatch => ({
  fetchDocumentsDetails: documentPid =>
    dispatch(fetchDocumentsDetails(documentPid)),
});

const mapStateToProps = state => ({
  isLoading: state.documentDetailsFront.isLoading,
  documentDetails: state.documentDetailsFront.data,
  hasError: state.documentDetailsFront.hasError,
});

export const DocumentsDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentsDetailsContainerComponent);
