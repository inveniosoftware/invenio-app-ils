import find from 'lodash/find';
import { UPDATE_SELECTIONS } from './types';

export const updateSelections = selections => ({
  type: UPDATE_SELECTIONS,
  payload: selections,
});

export const addMultiSelection = selection => {
  return (dispatch, getState) => {
    let currentSelections = getState().esSelector.selections;
    let hasMatch = find(currentSelections, sel => sel.id === selection.id);

    if (!hasMatch) {
      return dispatch({
        type: UPDATE_SELECTIONS,
        payload: [...currentSelections, selection],
      });
    }
  };
};

export const addSingleSelection = selection => {
  return {
    type: UPDATE_SELECTIONS,
    payload: [selection],
  };
};

export const removeSelection = selection => {
  return (dispatch, getState) => {
    let currentSelections = getState().esSelector.selections;
    return dispatch({
      type: UPDATE_SELECTIONS,
      payload: currentSelections.filter(
        currentSelection => currentSelection.id !== selection.id
      ),
    });
  };
};
