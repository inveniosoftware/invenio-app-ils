import { resetSelections } from '../RelationSelector/state/actions';
import { createRelations } from '../../state/actions';
import { connect } from 'react-redux';
import RelationModalComponent from './RelationModal';

const mapDispatchToProps = dispatch => ({
  createRelations: (
    relationType,
    selections,
    extraRelationField,
    referrerRecord
  ) =>
    dispatch(
      createRelations(
        relationType,
        selections,
        extraRelationField,
        referrerRecord
      )
    ),
  resetSelections: () => dispatch(resetSelections()),
});

const mapStateToProps = state => ({
  selections: state.recordRelationsSelections.selections,
});

export const RelationModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationModalComponent);
