import {
  SET_LOAN_FETCH_LOADING,
  LOAN_FETCH_DETAILS_SUCCESS,
  SET_LOAN_ACTION_LOADING,
  LOAN_ACTION_SUCCESS,
  SET_LOAN_ACTION_ERROR,
} from './types';

export const initialState = {
  data: {},
  isLoading: true,
  actionLoading: false,
  loanActionError: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOAN_FETCH_LOADING:
      return { ...state, isLoading: true };
    case LOAN_FETCH_DETAILS_SUCCESS:
      return { ...state, isLoading: false, data: action.payload };
    case SET_LOAN_ACTION_LOADING:
      return { ...state, actionLoading: true };
    case LOAN_ACTION_SUCCESS:
      return { ...state, actionLoading: false, data: action.payload };
    case SET_LOAN_ACTION_ERROR:
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
