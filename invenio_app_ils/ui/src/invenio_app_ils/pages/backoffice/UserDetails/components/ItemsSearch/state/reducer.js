import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  QUERY_STRING_UPDATE,
  CLEAR_SEARCH,
} from './types';

export const initialState = {
  isLoading: true,
  hasError: false,
  itemCheckoutQueryString: '',
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
    case QUERY_STRING_UPDATE:
      return { ...state, itemCheckoutQueryString: action.queryString };
    case CLEAR_SEARCH:
      return { ...state, itemCheckoutQueryString: '', data: {} };
    default:
      return state;
  }
};
