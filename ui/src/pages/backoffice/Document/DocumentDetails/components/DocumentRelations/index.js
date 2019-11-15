import { connect } from 'react-redux';

import DocumentRelationsComponent from './DocumentRelations';
import { createRelations, deleteRelations } from './state/actions';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.documentRelations.error,
  isLoading: state.documentRelations.isLoading,
  relations: state.documentRelations.data,
});

const mapDispatchToProps = dispatch => ({
  createRelations: (documentPid, relations) =>
    dispatch(createRelations(documentPid, relations)),
  deleteRelations: (documentPid, relations) =>
    dispatch(deleteRelations(documentPid, relations)),
});

export const DocumentRelations = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentRelationsComponent);
