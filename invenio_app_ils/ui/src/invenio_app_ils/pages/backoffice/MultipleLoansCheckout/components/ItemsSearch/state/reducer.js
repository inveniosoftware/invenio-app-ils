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
  multiCheckoutQueryString: '',
  data: [],
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
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        hasError: true,
      };
    case QUERY_STRING_UPDATE:
      return { ...state, multiCheckoutQueryString: action.queryString };
    case CLEAR_SEARCH:
      return { ...state, multiCheckoutQueryString: '', data: [], items: [] };
    default:
      return state;
  }
};
