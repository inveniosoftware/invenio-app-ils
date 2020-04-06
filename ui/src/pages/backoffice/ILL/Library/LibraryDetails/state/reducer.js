import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  DELETE_IS_LOADING,
  DELETE_HAS_ERROR,
  DELETE_SUCCESS,
} from './types';

export const initialState = {
  isLoading: true,
  hasError: false,
  data: {},
  error: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: {},
        hasError: false,
      };
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasError: true,
      };
    case DELETE_IS_LOADING:
      return { ...state, isLoading: true };
    case DELETE_SUCCESS:
      return {
        ...state,
        isLoading: true,
        error: {},
        hasError: false,
      };
    case DELETE_HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasError: true,
      };
    default:
      return state;
  }
};
