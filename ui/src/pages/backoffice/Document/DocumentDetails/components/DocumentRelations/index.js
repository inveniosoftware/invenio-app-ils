import { connect } from 'react-redux';

import DocumentRelationsComponent from './DocumentRelations';
import RelationMultipartModalComponent from './RelationMultipartMonograph/RelationMultipartModal';
import RelationMultipartComponent from './RelationMultipartMonograph/RelationMultipart';
import RelationSerialModalComponent from './RelationSerial/RelationSerialModal';
import RelationSerialComponent from './RelationSerial/RelationSerial';
import DocumentSeriesComponent from './DocumentSeries';
import RelationRemoverComponent from './RelationRemover';

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

export const RelationMultipartModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationMultipartModalComponent);

export const RelationMultipart = connect(
  mapStateToProps,
  null
)(RelationMultipartComponent);

export const RelationSerialModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationSerialModalComponent);

export const RelationSerial = connect(
  mapStateToProps,
  null
)(RelationSerialComponent);

export const DocumentSeries = connect(
  mapStateToProps,
  null
)(DocumentSeriesComponent);

export const RelationRemover = connect(
  null,
  mapDispatchToProps
)(RelationRemoverComponent);
