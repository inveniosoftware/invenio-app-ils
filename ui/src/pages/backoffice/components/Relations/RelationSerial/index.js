import { connect } from 'react-redux';

import RelationSerialModalComponent from './RelationSerialModal';
import RelationSerialComponent from './RelationSerial';

const mapStateToProps = state => ({
  error: state.recordRelations.error,
  isLoading: state.recordRelations.isLoading,
  relations: state.recordRelations.data,
});

export const RelationSerialModal = connect(
  mapStateToProps,
  null
)(RelationSerialModalComponent);

export const RelationSerial = connect(
  mapStateToProps,
  null
)(RelationSerialComponent);
