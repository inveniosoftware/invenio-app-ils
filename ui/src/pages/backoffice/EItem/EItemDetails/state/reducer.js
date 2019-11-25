import {
  DELETE_IS_LOADING,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  UPLOAD_IS_LOADING,
  ADD_FILE,
  DELETE_FILE,
} from './types';
import get from 'lodash/get';

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
      return { ...state, isLoading: true };
    case UPLOAD_IS_LOADING:
      return { ...state, isFilesLoading: true };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        isFilesLoading: false,
        data: action.payload,
        files: get(action.payload, 'metadata.files', []),
        error: {},
        hasError: false,
      };
    case ADD_FILE:
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
    case DELETE_FILE:
      return {
        ...state,
        files: state.files.filter(file => file.key !== action.payload),
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
    case DELETE_IS_LOADING:
      return { ...state, isLoading: true, isFilesLoading: false };
    case DELETE_SUCCESS:
      return {
        ...state,
        isLoading: true,
        isFilesLoading: false,
      };
    case DELETE_HAS_ERROR:
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
