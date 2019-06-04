import { connect } from 'react-redux';
import ESSelectorComponent from './ESSelector';
import ESSelectorModalComponent from './ESSelectorModal';
import {
  addMultiSelection,
  addSingleSelection,
  removeSelection,
  updateSelections,
} from './state/actions';

const mapStateToProps = state => ({
  selections: state.esSelector.selections,
});
const mapDispatchToProps = dispatch => ({
  updateSelections: selections => dispatch(updateSelections(selections)),
  addMultiSelection: selection => dispatch(addMultiSelection(selection)),
  addSingleSelection: selection => dispatch(addSingleSelection(selection)),
  removeSelection: selection => dispatch(removeSelection(selection)),
});

export const ESSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ESSelectorComponent);
export const ESSelectorModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ESSelectorModalComponent);
