import { createRelations, deleteRelations } from '../../state/actions';
import RelationRemoverComponent from './RelationRemover';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
  createRelations: (documentPid, relations) =>
    dispatch(createRelations(documentPid, relations)),
  deleteRelations: (documentPid, relations) =>
    dispatch(deleteRelations(documentPid, relations)),
});

export const RelationRemover = connect(
  null,
  mapDispatchToProps
)(RelationRemoverComponent);
