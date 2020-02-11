import { SUCCESS as FETCH_DOCUMENT_SUCCESS } from '@pages/backoffice/Document/DocumentDetails/state/types';
import { SUCCESS as FETCH_SERIES_SUCCESS } from '@pages/backoffice/Series/SeriesDetails/state/types';
import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';

export const initialState = {
  isLoading: true,
  hasError: false,
  data: {},
  error: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case FETCH_DOCUMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload.metadata.relations,
        error: {},
        hasError: false,
      };
    case FETCH_SERIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload.metadata.relations,
        error: {},
        hasError: false,
      };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: {},
        hasError: false,
      };
    case HAS_ERROR:
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
