import {
  createRelations,
  deleteRelations,
} from '../../DocumentRelations/state/actions';
import { connect } from 'react-redux';
import RelationLanguagesComponent from './RelationLanguages';
import RelationLanguagesModalComponent from './RelationLanguagesModal';

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

export const RelationLanguages = connect(
  mapStateToProps,
  null
)(RelationLanguagesComponent);

export const RelationLanguagesModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationLanguagesModalComponent);
