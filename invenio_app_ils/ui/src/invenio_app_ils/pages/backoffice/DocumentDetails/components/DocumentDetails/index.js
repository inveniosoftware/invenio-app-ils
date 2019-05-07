import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchDocumentDetails } from './state/actions';
import { DocumentDetailsContainer } from './DocumentDetailsContainer';

const mapStateToProps = state => ({
  ...state.documentDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
});

export const DocumentDetails = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentDetailsContainer);
