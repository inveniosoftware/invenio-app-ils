import { connect } from 'react-redux';
import RelationEditionComponent from './RelationEdition';
import RelationEditionModalComponent from './RelationEditionModal';

const mapStateToProps = state => ({
  error: state.recordRelations.error,
  isLoading: state.recordRelations.isLoading,
  relations: state.recordRelations.data,
});

export const RelationEdition = connect(
  mapStateToProps,
  null
)(RelationEditionComponent);

export const RelationEditionModal = connect(mapStateToProps)(
  RelationEditionModalComponent
);
