import {
  selectOption,
  removeSelection,
  resetSelections,
} from './state/actions';
import { connect } from 'react-redux';

import RelationSelectorComponent from './RelationSelector';

const mapStateToProps = state => ({
  selections: state.recordRelationsSelections.selections,
});

const mapDispatchToProps = dispatch => ({
  selectOption: option => dispatch(selectOption(option)),
  removeSelection: removePid => dispatch(removeSelection(removePid)),
  resetSelections: () => dispatch(resetSelections()),
});

export const RelationSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationSelectorComponent);
