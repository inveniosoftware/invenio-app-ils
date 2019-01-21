import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchDocumentDetails } from './state/actions';
import DocumentDetailsContainerComponent from './DocumentDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
});

export const DocumentDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(DocumentDetailsContainerComponent);
