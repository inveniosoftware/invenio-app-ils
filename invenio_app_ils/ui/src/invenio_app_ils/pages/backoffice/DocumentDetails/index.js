import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { deleteDocument, fetchDocumentDetails } from './state/actions';
import DocumentDetailsContainerComponent from './DocumentDetailsContainer';

const mapStateToProps = state => ({
  isLoading: state.documentDetails.isLoading,
  data: state.documentDetails.data,
  error: state.documentDetails.error,
  hasError: state.documentDetails.hasError,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
  deleteDocument: documentPid => dispatch(deleteDocument(documentPid)),
});

export const DocumentDetailsContainer = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentDetailsContainerComponent);
