import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  NAVIGATE_RECORDS,
  CSV_IS_LOADING,
  CSV_HAS_ERROR,
  CSV_SUCCESS,
} from './types';

const MAX_DOWNLOAD_SIZE = 10;

export const initialState = {
  isLoading: false,
  hasError: false,
  data: { hits: [], total: 0 },
  error: {},
  recordsFrom: 0,
  recordsTo: 0,
  totalRecords: 0,
  dlSize: MAX_DOWNLOAD_SIZE,
  csvIsLoading: false,
  csvHasError: false,
  csvData: '',
  csvError: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: {},
        hasError: false,
        totalRecords: action.payload,
        recordsFrom: 0,
        recordsTo: Math.min(action.payload, MAX_DOWNLOAD_SIZE),
        dlSize: Math.min(action.payload, MAX_DOWNLOAD_SIZE),
      };
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasError: true,
      };
    case NAVIGATE_RECORDS:
      return {
        ...state,
        recordsFrom: action.payload[0],
        recordsTo: action.payload[1],
      };
    case CSV_IS_LOADING:
      return { ...state, csvIsLoading: true };
    case CSV_SUCCESS:
      return {
        ...state,
        csvIsLoading: false,
        csvData: action.payload,
        csvError: {},
        csvHasError: false,
      };
    case CSV_HAS_ERROR:
      return {
        ...state,
        csvIsLoading: false,
        csvError: action.payload,
        csvHasError: true,
      };
    default:
      return state;
  }
};
