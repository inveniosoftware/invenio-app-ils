import { http, apiConfig } from '../base';
import { invenioConfig } from '../../config/invenioConfig';
import { document as documentApi } from '../documents/document';

const circulationStatsURL = '/circulation/stats/';
const mostLoanedURL = `${circulationStatsURL}most-loaned`;
const apiMostLoanedURL = `${apiConfig.baseURL}${mostLoanedURL}`;

const getMostLoanedDocumentsParams = (
  fromDate,
  toDate,
  size = null,
  format = null
) => {
  const params = {};
  if (fromDate) {
    params.from_date = fromDate;
  }
  if (toDate) {
    params.to_date = toDate;
  }
  if (size) {
    params.size = size;
  }
  if (format) {
    const formatArgName = invenioConfig.rest_mimetype_query_arg_name;
    params[formatArgName] = format;
  }
  return params;
};

const getMostLoanedDocuments = async (fromDate, toDate) => {
  const params = {
    params: getMostLoanedDocumentsParams(fromDate, toDate),
  };
  const response = await http.get(mostLoanedURL, params);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    documentApi.serializer.fromJSON(hit)
  );
  return response;
};

const recordStats = async (pidType, pidValue) => {
  const data = {
    views: {
      stat: 'record-view',
      params: {
        pid_type: pidType,
        pid_value: pidValue,
      },
    },
  };
  return await http.post('/stats', data);
};

export const stats = {
  getMostLoanedDocumentsParams: getMostLoanedDocumentsParams,
  getMostLoanedDocuments: getMostLoanedDocuments,
  mostLoanedUrl: apiMostLoanedURL,
  recordStats: recordStats,
};
