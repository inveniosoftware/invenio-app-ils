import { deleteRelations } from '../../state/actions';
import RelationRemoverComponent from './RelationRemover';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
  deleteRelations: (documentPid, relations) =>
    dispatch(deleteRelations(documentPid, relations)),
});

export const RelationRemover = connect(
  null,
  mapDispatchToProps
)(RelationRemoverComponent);
