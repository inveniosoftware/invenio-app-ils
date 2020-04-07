import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';

const literatureURL = '/literature/';

const list = async query => {
  const response = await http.get(`${literatureURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

class QueryBuilder {
  constructor() {
    this.extraParamsQuery = [];
    this.withSeriesQuery = [];
  }

  withSeriesPid(seriesPid, moi) {
    if (!seriesPid) {
      throw TypeError('Series PID argument missing');
    }
    if (moi === 'SERIAL') {
      this.withSeriesQuery.push(
        `relations.serial.pid_value:${prepareSumQuery(seriesPid)}`
      );
    } else {
      this.withSeriesQuery.push(
        `relations.multipart_monograph.pid_value:${prepareSumQuery(seriesPid)}`
      );
    }
    return this;
  }

  includeAll() {
    this.extraParamsQuery.push('include_all');
    return this;
  }

  sortBy(order) {
    if (!order) {
      throw TypeError('Sort order argument missing');
    }
    this.extraParamsQuery.push(`sort=${order}`);
    return this;
  }

  qs() {
    const searchQuery = this.withSeriesQuery.join(' AND ');
    const params =
      this.extraParamsQuery.length > 0
        ? `&${this.extraParamsQuery.join('&')}`
        : '';
    return `${searchQuery}${params}`;
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

export const literature = {
  searchBaseURL: `${apiConfig.baseURL}${literatureURL}`,
  list: list,
  query: queryBuilder,
  serializer: serializer,
};
