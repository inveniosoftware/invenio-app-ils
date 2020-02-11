import { REMOVE_SELECTION, SELECT_OPTION, RESET_SELECTIONS } from './types';

export const selectOption = option => {
  return dispatch => {
    dispatch({
      type: SELECT_OPTION,
      option: option,
    });
  };
};

export const removeSelection = removePid => {
  return dispatch => {
    dispatch({
      type: REMOVE_SELECTION,
      removePid: removePid,
    });
  };
};

export const resetSelections = () => {
  return dispatch => {
    dispatch({
      type: RESET_SELECTIONS,
    });
  };
};
