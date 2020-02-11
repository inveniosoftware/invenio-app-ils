import { removeSelection } from '../RelationSelector/state/actions';
import { connect } from 'react-redux';
import MultipleSelectionsComponent from './MultipleSelections';

const mapDispatchToProps = dispatch => ({
  removeSelection: removePid => dispatch(removeSelection(removePid)),
});

const mapStateToProps = state => ({
  selections: state.recordRelationsSelections.selections,
});

export const MultipleSelections = connect(
  mapStateToProps,
  mapDispatchToProps
)(MultipleSelectionsComponent);
