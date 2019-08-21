import { http } from '../base';
import { document as documentApi } from '../documents/document';

const statsURL = '/circulation/stats/';

const getMostLoanedDocuments = (fromDate, toDate) => {
  const params = {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  };
  return http.get(`${statsURL}most-loaned`, params).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      documentApi.serializer.fromJSON(hit)
    );
    return response;
  });
};

export const stats = {
  getMostLoanedDocuments: getMostLoanedDocuments,
  url: statsURL,
};
