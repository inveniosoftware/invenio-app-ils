import { connect } from 'react-redux';

import RelationOtherModalComponent from './RelationOtherModal';
import RelationOtherComponent from './RelationOther';

const mapStateToProps = state => ({
  seriesDetails: state.seriesDetails.data,
  error: state.recordRelations.error,
  isLoading: state.recordRelations.isLoading,
  relations: state.recordRelations.data,
});

export const RelationOtherModal = connect(
  mapStateToProps,
  null
)(RelationOtherModalComponent);

export const RelationOther = connect(
  mapStateToProps,
  null
)(RelationOtherComponent);
