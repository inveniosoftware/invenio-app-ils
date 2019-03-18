import { IS_LOADING, SUCCESS, HAS_ERROR, RESET_STATE } from './types';

export const initialState = {
  newLoanRequest: { isLoading: false, hasError: false, data: {} },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return {
        ...state,
        newLoanRequest: {
          isLoading: true,
        },
      };
    case SUCCESS:
      return {
        ...state,
        newLoanRequest: {
          isLoading: false,
          data: action.payload,
          hasError: false,
        },
      };
    case HAS_ERROR:
      return {
        ...state,
        newLoanRequest: {
          isLoading: false,
          data: action.payload,
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
