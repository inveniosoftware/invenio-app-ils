import { createRelations } from '../../state/actions';
import { connect } from 'react-redux';
import RelationModalComponent from './RelationModal';

const mapDispatchToProps = dispatch => ({
  createRelations: (documentPid, relations) =>
    dispatch(createRelations(documentPid, relations)),
});

export const RelationModal = connect(
  null,
  mapDispatchToProps
)(RelationModalComponent);
