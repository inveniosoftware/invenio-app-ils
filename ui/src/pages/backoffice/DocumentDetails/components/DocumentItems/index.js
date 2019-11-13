import { connect } from 'react-redux';

import { fetchDocumentItems } from './state/actions';
import DocumentItemsComponent from './DocumentItems';

const mapStateToProps = state => ({
  data: state.documentItems.data,
  error: state.documentItems.error,
  isLoading: state.documentItems.isLoading,
  hasError: state.documentItems.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentItems: documentPid => dispatch(fetchDocumentItems(documentPid)),
});

export const DocumentItems = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentItemsComponent);
