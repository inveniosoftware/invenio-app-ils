import {
  SET_LOAN_FETCH_LOADING,
  SET_LOAN_FETCH_DETAILS,
  SET_LOAN_ACTION_LOADING,
  SET_LOAN_ACTION,
  SET_LOAN_ACTION_ERROR,
} from './types';

const initialState = {
  fetchLoading: true,
  actionLoading: false,
  data: {},
  loanActionError: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOAN_FETCH_LOADING:
      return { ...state, fetchLoading: true };
    case SET_LOAN_FETCH_DETAILS:
      return { ...state, fetchLoading: false, data: action.payload };
    case SET_LOAN_ACTION_LOADING:
      return { ...state, actionLoading: true };
    case SET_LOAN_ACTION:
      return { ...state, actionLoading: false, data: action.payload };
    case SET_LOAN_ACTION_ERROR:
      return {
        ...state,
        actionLoading: false,
        fetchLoading: false,
        loanActionError: true,
        error: action.payload,
      };
    default:
      return state;
  }
};
