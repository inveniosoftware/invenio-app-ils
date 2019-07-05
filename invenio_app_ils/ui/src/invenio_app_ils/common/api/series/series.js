import { http } from '../base';
import { serializer } from './serializer';

const seriesURL = '/series/';

const get = seriesPid => {
  return http.get(`${seriesURL}${seriesPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const del = async seriesPid => {
  const response = await http.delete(`${seriesURL}${seriesPid}`);
  return response;
};

const patch = async (seriesPid, ops) => {
  const response = await http.patch(`${seriesURL}${seriesPid}`, ops, {
    headers: { 'Content-Type': 'application/json-patch+json' },
  });
  response.data = serializer.fromJSON(response.data);
  return response;
};

class QueryBuilder {
  constructor() {
    this.withKeywordQuery = [];
  }

  withKeyword(keyword) {
    if (!keyword) {
      throw TypeError('Keyword argument missing');
    }
    this.withKeywordQuery.push(`keywords.name:"${keyword.name}"`);
    return this;
  }

  qs() {
    return this.withKeywordQuery.join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = query => {
  return http.get(`${seriesURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

const count = query => {
  return http.get(`${seriesURL}?q=${query}`).then(response => {
    response.data = response.data.hits.total;
    return response;
  });
};

export const series = {
  get: get,
  delete: del,
  patch: patch,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
  url: seriesURL,
};
