import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withDataContainer } from '../../../../../common/components/DataContainer';
import {
  deleteDocument,
  fetchDocumentDetails,
  updateDocument,
} from './state/actions';

import DocumentDetailsComponent from './DocumentDetails';

const mapStateToProps = state => ({
  ...state.documentDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: documentPid =>
    dispatch(fetchDocumentDetails(documentPid)),
  deleteDocument: documentPid => dispatch(deleteDocument(documentPid)),
  updateDocument: (documentPid, path, value) =>
    dispatch(updateDocument(documentPid, path, value)),
});

export const DocumentDetails = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withDataContainer(props =>
    props.fetchDocumentDetails(props.match.params.documentPid)
  )
)(DocumentDetailsComponent);
