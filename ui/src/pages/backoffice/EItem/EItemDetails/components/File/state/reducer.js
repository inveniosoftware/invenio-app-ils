import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';

export const initialState = {
  isLoading: true,
  isFilesLoading: false,
  hasError: false,
  data: { hits: [], total: 0 },
  files: [],
  error: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isFilesLoading: true };
    case SUCCESS:
      let fileAdded = false;
      const files = state.files.map(file => {
        if (file.key === action.payload.key) {
          fileAdded = true;
          return action.payload;
        }
        return file;
      });
      if (!fileAdded) {
        files.push(action.payload);
      }
      return {
        ...state,
        files: files,
        isFilesLoading: false,
      };
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        isFilesLoading: false,
        error: action.payload,
        hasError: true,
      };
    default:
      return state;
  }
};
