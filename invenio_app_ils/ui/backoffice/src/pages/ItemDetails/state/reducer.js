import { IS_LOADING, ITEM_DETAILS, HAS_ERROR } from './types';

const initialState = {
  isLoading: true,
  hasError: false,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case ITEM_DETAILS:
      return { ...state, isLoading: false, data: action.payload };
    case HAS_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
