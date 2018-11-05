import {
  IS_LOAN_LOADING,
  IS_ACTION_LOADING,
  LOAN_ACTION_SUCCESS,
  LOAN_DETAILS_SUCCESS,
  HAS_ERROR,
} from './types';

export const initialState = {
  data: {},
  isLoading: true,
  actionLoading: false,
  loanActionError: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOAN_LOADING:
      return { ...state, isLoading: true };
    case LOAN_DETAILS_SUCCESS:
      return { ...state, isLoading: false, data: action.payload };
    case IS_ACTION_LOADING:
      return { ...state, actionLoading: true };
    case LOAN_ACTION_SUCCESS:
      return { ...state, actionLoading: false, data: action.payload };
    case HAS_ERROR:
      return {
        ...state,
        actionLoading: false,
        isLoading: false,
        loanActionError: true,
        error: action.payload,
      };
    default:
      return state;
  }
};
