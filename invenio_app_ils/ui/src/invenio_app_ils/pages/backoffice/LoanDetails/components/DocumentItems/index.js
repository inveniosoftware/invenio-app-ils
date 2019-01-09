import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchDocumentItems,
  documentItemsChangeSortBy,
  documentItemsChangeSortOrder,
} from './state/actions';
import DocumentItemsComponent from './DocumentItems';

const mapStateToProps = state => ({
  data: state.documentItems.data,
  isLoading: state.documentItems.isLoading,
  hasError: state.documentItems.hasError,
  currentSortBy: state.documentItems.sortBy,
  currentSortOrder: state.documentItems.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentItems: documentPid => dispatch(fetchDocumentItems(documentPid)),
  documentItemsChangeSortBy: documentPid =>
    dispatch(documentItemsChangeSortBy(documentPid)),
  documentItemsChangeSortOrder: documentPid =>
    dispatch(documentItemsChangeSortOrder(documentPid)),
});

export const DocumentItems = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentItemsComponent);
