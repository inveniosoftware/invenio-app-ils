import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';

export const initialState = {
  error: {},
  isLoading: false,
  hasError: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return { error: {}, isLoading: false, hasError: false };
    case IS_LOADING:
      return { ...state, isLoading: true };
    case HAS_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
