import { removeSelection } from '../RelationSelector/state/actions';
import { connect } from 'react-redux';
import SingleSelectionComponent from './SingleSelection';

const mapDispatchToProps = dispatch => ({
  removeSelection: removePid => dispatch(removeSelection(removePid)),
});

const mapStateToProps = state => ({
  selections: state.recordRelations.selections,
});

export const SingleSelection = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleSelectionComponent);
