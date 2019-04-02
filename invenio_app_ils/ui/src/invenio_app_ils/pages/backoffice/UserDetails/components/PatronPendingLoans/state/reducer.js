import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  CHANGE_SORT_BY,
  CHANGE_SORT_ORDER,
} from './types';

export const initialState = {
  isLoading: true,
  hasError: false,
  data: { hits: [], total: 0 },
  error: {},
  sortBy: 'transaction_date',
  sortOrder: 'asc',
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
    case CHANGE_SORT_BY:
      return {
        ...state,
        sortBy: action.payload,
        sortOrder: initialState.sortOrder,
      };
    case CHANGE_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.payload,
      };
    default:
      return state;
  }
};
