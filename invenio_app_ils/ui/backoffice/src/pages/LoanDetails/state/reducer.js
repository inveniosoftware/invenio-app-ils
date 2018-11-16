import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  ACTION_IS_LOADING,
  ACTION_SUCCESS,
  ACTION_HAS_ERROR,
} from './types';

export const initialState = {
  data: {},
  isLoading: true,
  isActionLoading: false,
  hasError: false,
  actionHasError: false,
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
        hasError: false,
      };
    case ACTION_IS_LOADING:
      return { ...state, isActionLoading: true };
    case ACTION_SUCCESS:
      return {
        ...state,
        isActionLoading: false,
        data: action.payload,
        actionHasError: false,
      };
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        hasError: true,
      };
    case ACTION_HAS_ERROR:
      return {
        ...state,
        isActionLoading: false,
        data: action.payload,
        actionHasError: true,
      };
    default:
      return state;
  }
};
