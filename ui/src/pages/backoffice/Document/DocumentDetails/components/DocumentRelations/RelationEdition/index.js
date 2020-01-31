import { deleteRelations } from '../state/actions';
import { connect } from 'react-redux';
import RelationEditionComponent from './RelationEdition';
import RelationEditionModalComponent from './RelationEditionModal';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.documentRelations.error,
  isLoading: state.documentRelations.isLoading,
  relations: state.documentRelations.data,
});

const mapDispatchToProps = dispatch => ({
  deleteRelations: (documentPid, relations) =>
    dispatch(deleteRelations(documentPid, relations)),
});

export const RelationEdition = connect(
  mapStateToProps,
  null
)(RelationEditionComponent);

export const RelationEditionModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationEditionModalComponent);
