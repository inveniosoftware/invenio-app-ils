import remove from 'lodash/remove';
import { SELECT_OPTION, REMOVE_SELECTION, RESET_SELECTIONS } from './types';

export const initialState = {
  selections: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_OPTION:
      let newSelections = [...state.selections];
      newSelections.push(action.option);
      return {
        selections: newSelections,
      };
    case REMOVE_SELECTION:
      let removeSelections = [...state.selections];
      remove(removeSelections, o => o.metadata.pid === action.removePid);
      return {
        selections: removeSelections,
      };
    case RESET_SELECTIONS:
      return {
        selections: [],
      };
    default:
      return state;
  }
};
