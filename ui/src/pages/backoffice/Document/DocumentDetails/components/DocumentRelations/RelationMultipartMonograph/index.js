import { connect } from 'react-redux';
import RelationMultipartModalComponent from './RelationMultipartModal';
import RelationMultipartComponent from './RelationMultipart';
import {
  createRelations,
  deleteRelations,
} from '../../DocumentRelations/state/actions';

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

export const RelationMultipartModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationMultipartModalComponent);

export const RelationMultipart = connect(
  mapStateToProps,
  null
)(RelationMultipartComponent);
