import {
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
} from './types';

export const initialState = {
  data: {},
  error: {},
  isLoading: true,
  hasError: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DELETE_IS_LOADING:
    case IS_LOADING:
      return { ...state, isLoading: true };
    case SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: {},
        isLoading: false,
        hasError: false,
      };
    case DELETE_HAS_ERROR:
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
