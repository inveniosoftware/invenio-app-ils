import { IS_LOADING, ITEM_DETAILS, HAS_ERROR } from './types';

const initialState = {
  fetchLoading: true,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, fetchLoading: true };
    case ITEM_DETAILS:
      return { ...state, fetchLoading: false, data: action.payload };
    case HAS_ERROR:
      return { ...state, fetchLoading: false, error: action.payload };
    default:
      return state;
  }
};
