import {
  createRelations,
  deleteRelations,
} from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/state/actions';
import { connect } from 'react-redux';

import RelationSerialModalComponent from './RelationSerialModal';
import RelationSerialComponent from './RelationSerial';

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

export const RelationSerialModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationSerialModalComponent);

export const RelationSerial = connect(
  mapStateToProps,
  null
)(RelationSerialComponent);
