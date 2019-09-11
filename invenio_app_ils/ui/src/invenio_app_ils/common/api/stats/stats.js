import { http, apiConfig } from '../base';
import { invenioConfig } from '../../config/invenioConfig';
import { document as documentApi } from '../documents/document';

const statsURL = '/circulation/stats/';
const mostLoanedURL = `${statsURL}most-loaned`;
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

export const stats = {
  getMostLoanedDocumentsParams: getMostLoanedDocumentsParams,
  getMostLoanedDocuments: getMostLoanedDocuments,
  mostLoanedUrl: apiMostLoanedURL,
};
