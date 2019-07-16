import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  NAVIGATE_RECORDS,
  CSV_SUCCESS,
  CSV_HAS_ERROR,
  CSV_IS_LOADING,
} from './types';
import { sendErrorNotification } from '../../../../../common/components/Notifications';
import { InvenioRequestSerializer } from 'react-searchkit/es/contrib/Serializers';

export const fetchCount = (query, countQuery) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await countQuery(query);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const navigateRecords = navigation => {
  return (dispatch, getState) => {
    let dlSize = getState().csvExport.dlSize;
    let recordsFrom = getState().csvExport.recordsFrom;
    let recordsTo = getState().csvExport.recordsTo;
    let totalRecords = getState().csvExport.totalRecords;

    if (navigation === 'back') {
      recordsFrom = Math.max(recordsFrom - dlSize, 0);
      recordsTo = Math.max(recordsTo - dlSize, 0);
    } else if (navigation === 'next') {
      recordsFrom = Math.min(recordsFrom + dlSize, totalRecords);
      recordsTo = Math.min(recordsTo + dlSize, totalRecords);
    }

    return dispatch({
      type: NAVIGATE_RECORDS,
      payload: [recordsFrom, recordsTo],
    });
  };
};

export const downloadCSV = (exportQuery, queryState) => {
  return async (dispatch, getState) => {
    dispatch({
      type: CSV_IS_LOADING,
    });
    try {
      let requestSerializer = new InvenioRequestSerializer();

      let dlSize = getState().csvExport.dlSize;
      let recordsTo = getState().csvExport.recordsTo;

      const pageToDownload = Math.ceil(recordsTo / dlSize);

      queryState.page = pageToDownload;
      queryState.size = dlSize;

      const queryString = requestSerializer.serialize(queryState);

      const response = await exportQuery(queryString);
      dispatch({
        type: CSV_SUCCESS,
        payload: response,
      });
    } catch (error) {
      dispatch({
        type: CSV_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
