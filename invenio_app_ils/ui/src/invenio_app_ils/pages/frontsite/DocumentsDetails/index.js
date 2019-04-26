import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchDocumentsDetails } from './state/actions';
import DocumentsDetailsContainerComponent from './DocumentsDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchDocumentsDetails: documentPid =>
    dispatch(fetchDocumentsDetails(documentPid)),
});

export const DocumentsDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(DocumentsDetailsContainerComponent);
