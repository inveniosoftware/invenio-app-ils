import { resetSelections } from '../RelationSelector/state/actions';
import { createRelations } from '../../state/actions';
import { connect } from 'react-redux';
import RelationModalComponent from './RelationModal';

const mapDispatchToProps = dispatch => ({
  createRelations: (documentPid, relations) =>
    dispatch(createRelations(documentPid, relations)),
  resetSelections: () => dispatch(resetSelections()),
});

const mapStateToProps = state => ({
  selections: state.recordRelations.selections,
});

export const RelationModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationModalComponent);
