import { IS_LOADING, SUCCESS, HAS_ERROR, INITIAL } from './types';

export const initialState = {
  isLoading: false,
  hasError: false,
  isSuccessful: false,
  data: { hits: [], total: 0 },
  error: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INITIAL:
      return (state = initialState);
    case IS_LOADING:
      return { ...state, isLoading: true };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: {},
        hasError: false,
        isSuccessful: true,
      };
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasError: true,
        isSuccessful: false,
      };
    default:
      return state;
  }
};
