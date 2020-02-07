import { connect } from 'react-redux';
import RelationSummaryComponent from './RelationSummary';

const mapStateToProps = state => ({
  selections: state.recordRelations.selections,
});

export const RelationSummary = connect(mapStateToProps)(
  RelationSummaryComponent
);
