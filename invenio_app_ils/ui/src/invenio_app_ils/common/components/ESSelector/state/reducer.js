import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import {
  ADD_SINGLE_SELECTION,
  ADD_MULTI_SELECTION,
  REMOVE_SELECTION,
  UPDATE_SELECTIONS,
} from './types';

export const initialState = {
  selections: [],
};

export default (state = initialState, action) => {
  let selection;
  let hasMatch;

  switch (action.type) {
    case UPDATE_SELECTIONS:
      return {
        ...state,
        selections: cloneDeep(action.payload),
      };
    case ADD_SINGLE_SELECTION:
      selection = action.payload;
      hasMatch = find(state.selections, sel => sel.id === selection.id);
      if (hasMatch) {
        return state;
      }

      return {
        ...state,
        selections: [selection],
      };
    case ADD_MULTI_SELECTION:
      selection = action.payload;
      hasMatch = find(state.selections, sel => sel.id === selection.id);
      if (hasMatch) {
        return state;
      }

      return {
        ...state,
        selections: [...state.selections, selection],
      };
    case REMOVE_SELECTION:
      return {
        ...state,
        selections: state.selections.filter(
          selection => selection.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
};
