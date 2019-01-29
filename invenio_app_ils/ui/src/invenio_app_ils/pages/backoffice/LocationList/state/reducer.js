import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import { serializeLocationData } from './selectors';

export const initialState = {
  isLoading: true,
  hasError: false,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: serializeLocationData(action.payload),
        hasError: false,
      };
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        hasError: true,
      };
    default:
      return state;
  }
};
