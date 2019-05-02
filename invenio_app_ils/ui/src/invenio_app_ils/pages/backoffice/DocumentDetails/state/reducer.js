import {
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
} from './types';

export const initialState = {
  document: {
    isLoading: true,
    hasError: false,
    data: {},
    error: {},
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case SUCCESS:
      return {
        ...state,
        document: {
          isLoading: false,
          data: action.payload,
          error: {},
          hasError: false,
        },
      };
    case HAS_ERROR:
      return {
        ...state,
        document: {
          isLoading: false,
          error: action.payload,
          hasError: true,
        },
      };
    case DELETE_IS_LOADING:
      return { ...state, document: { isLoading: true } };
    case DELETE_SUCCESS:
      return {
        ...state,
        document: { isLoading: true },
      };
    case DELETE_HAS_ERROR:
      return {
        ...state,
        document: {
          isLoading: false,
          error: action.payload,
          hasError: true,
        },
      };
    default:
      return state;
  }
};
