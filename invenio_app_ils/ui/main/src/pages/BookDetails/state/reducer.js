import { SET_BOOK_DETAILS, SET_LOADING } from './types';

const initialState = {
  isLoading: true,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, isLoading: true };
    case SET_BOOK_DETAILS:
      return { ...state, isLoading: false, data: action.payload };
    default:
      return state;
  }
};
