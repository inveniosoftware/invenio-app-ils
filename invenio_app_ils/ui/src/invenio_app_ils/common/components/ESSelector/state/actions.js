import {
  ADD_SINGLE_SELECTION,
  ADD_MULTI_SELECTION,
  REMOVE_SELECTION,
  UPDATE_SELECTIONS,
} from './types';

export const updateSelections = selections => ({
  type: UPDATE_SELECTIONS,
  payload: selections,
});

export const addMultiSelection = selection => ({
  type: ADD_MULTI_SELECTION,
  payload: selection,
});

export const addSingleSelection = selection => ({
  type: ADD_SINGLE_SELECTION,
  payload: selection,
});

export const removeSelection = selection => ({
  type: REMOVE_SELECTION,
  payload: selection,
});
