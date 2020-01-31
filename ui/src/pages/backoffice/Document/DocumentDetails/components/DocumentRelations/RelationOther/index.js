import {
  createRelations,
  deleteRelations,
} from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/state/actions';
import { connect } from 'react-redux';

import RelationOtherModalComponent from './RelationOtherModal';
import RelationOtherComponent from './RelationOther';

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

export const RelationOtherModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationOtherModalComponent);

export const RelationOther = connect(
  mapStateToProps,
  null
)(RelationOtherComponent);
