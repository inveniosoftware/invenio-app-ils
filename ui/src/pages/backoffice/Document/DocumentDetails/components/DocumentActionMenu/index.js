import { connect } from 'react-redux';

import { deleteDocument, requestLoanForPatron } from '../../state/actions';
import DocumentActionMenuComponent from './DocumentActionMenu';

const mapStateToProps = state => ({
  isLoading: state.documentDetails.isLoading,
  error: state.documentDetails.error,
  document: state.documentDetails.data,
  hasError: state.documentDetails.hasError,
  relations: state.documentRelations.data,
});

const mapDispatchToProps = dispatch => ({
  deleteDocument: documentPid => dispatch(deleteDocument(documentPid)),
  requestLoanForPatron: (documentPid, patronPid, optionalParams = {}) =>
    dispatch(requestLoanForPatron(documentPid, patronPid, optionalParams)),
});

export const DocumentActionMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentActionMenuComponent);
