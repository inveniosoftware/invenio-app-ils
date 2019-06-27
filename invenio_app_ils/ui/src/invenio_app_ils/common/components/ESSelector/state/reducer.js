import cloneDeep from 'lodash/cloneDeep';
import { UPDATE_SELECTIONS } from './types';

export const initialState = {
  selections: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SELECTIONS:
      return {
        ...state,
        selections: cloneDeep(action.payload),
      };
    default:
      return state;
  }
};
