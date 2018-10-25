import { ITEM_LIST, ITEM_LIST_LOADING, ITEM_LIST_ERROR } from './types';

const initialState = {
  isLoading: true,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ITEM_LIST_LOADING:
      return { ...state, isLoading: true };
    case ITEM_LIST:
      return { ...state, isLoading: false, data: action.payload };
    case ITEM_LIST_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
