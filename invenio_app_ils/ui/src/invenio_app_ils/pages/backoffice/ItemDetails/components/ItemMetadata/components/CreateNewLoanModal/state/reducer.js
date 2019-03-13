import { IS_LOADING, SUCCESS, HAS_ERROR, RESET_STATE } from './types';

export const initialState = {
  newLoanCreate: { isLoading: false, hasError: false, data: {}, error: {} },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return {
        ...state,
        newLoanCreate: {
          isLoading: true,
        },
      };
    case SUCCESS:
      return {
        ...state,
        newLoanCreate: {
          isLoading: false,
          data: action.payload,
          error: {},
          hasError: false,
        },
      };
    case HAS_ERROR:
      return {
        ...state,
        newLoanCreate: {
          isLoading: false,
          error: action.payload,
          hasError: true,
        },
      };
    case RESET_STATE:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};
