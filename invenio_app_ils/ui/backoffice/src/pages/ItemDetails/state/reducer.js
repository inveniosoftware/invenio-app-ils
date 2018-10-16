import { ITEM_LOADING, ITEM_DETAILS, ITEM_ERROR } from './types';

const initialState = {
  fetchLoading: true,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ITEM_LOADING:
      return { ...state, fetchLoading: true };
    case ITEM_DETAILS:
      return { ...state, fetchLoading: false, data: action.payload };
    case ITEM_ERROR:
      return { ...state, fetchLoading: false, error: action.payload };
    default:
      return state;
  }
};
