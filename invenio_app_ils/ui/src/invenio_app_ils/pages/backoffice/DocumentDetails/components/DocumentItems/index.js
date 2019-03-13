import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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

export const DocumentItems = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentItemsComponent);
