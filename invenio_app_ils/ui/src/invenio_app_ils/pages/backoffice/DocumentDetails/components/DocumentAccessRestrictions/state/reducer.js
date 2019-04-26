import {
  SET_RESTRICTIONS_IS_LOADING,
  SET_RESTRICTIONS_SUCCESS,
  SET_RESTRICTIONS_HAS_ERROR,
} from './types';

export const initialState = {
  isLoading: true,
  hasError: false,
  data: {},
  error: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_RESTRICTIONS_IS_LOADING:
      return { ...state, isLoading: true };
    case SET_RESTRICTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: {},
        hasError: false,
      };
    case SET_RESTRICTIONS_HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasError: true,
      };
    default:
      return state;
  }
};
