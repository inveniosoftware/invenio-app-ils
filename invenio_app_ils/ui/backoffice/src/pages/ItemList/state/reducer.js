import { IS_LOADING, ITEM_LIST, ITEM_LIST_HAS_ERROR } from './types';

const initialState = {
  isLoading: true,
  hasError: false,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case ITEM_LIST:
      return { ...state, isLoading: false, data: action.payload };
    case ITEM_LIST_HAS_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
