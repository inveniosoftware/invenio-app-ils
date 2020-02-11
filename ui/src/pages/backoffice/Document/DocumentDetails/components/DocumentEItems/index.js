import { connect } from 'react-redux';

import { fetchDocumentEItems } from './state/actions';
import DocumentEItemsComponent from './DocumentEItems';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  documentEItems: state.documentEItems.data,
  error: state.documentEItems.error,
  isLoading: state.documentEItems.isLoading,
  hasError: state.documentEItems.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentEItems: documentPid =>
    dispatch(fetchDocumentEItems(documentPid)),
});

export const DocumentEItems = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentEItemsComponent);
