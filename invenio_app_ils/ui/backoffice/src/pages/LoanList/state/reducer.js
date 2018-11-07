import { LOAN_LIST, IS_LOADING, LOAN_LIST_HAS_ERROR } from './types';

const initialState = {
  isLoading: true,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case LOAN_LIST:
      return { ...state, isLoading: false, data: action.payload };
    case LOAN_LIST_HAS_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
