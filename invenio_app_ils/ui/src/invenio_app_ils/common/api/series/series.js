import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';

const seriesURL = '/series/';
const apiURL = `${apiConfig.baseURL}${seriesURL}`;

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

const createRelation = async (seriesPid, data) => {
  const resp = await http.post(`${seriesURL}${seriesPid}/relations`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const deleteRelation = async (seriesPid, data) => {
  const resp = await http.delete(`${seriesURL}${seriesPid}/relations`, {
    data: data,
  });
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

class QueryBuilder {
  constructor() {
    this.withKeywordQuery = [];
    this.withModeOfIssuanceQuery = [];
    this.withSeriesQuery = [];
    this.withStringQuery = [];
  }

  withKeyword(keyword) {
    if (!keyword) {
      throw TypeError('Keyword argument missing');
    }
    this.withKeywordQuery.push(`keywords.name:"${keyword.name}"`);
    return this;
  }

  withModeOfIssuance(moi) {
    if (!moi) {
      throw TypeError('Mode of issuance argument missing');
    }
    this.withModeOfIssuanceQuery.push(`mode_of_issuance:"${moi}"`);
    return this;
  }

  withSearchText(searchText) {
    if (!searchText) {
      throw TypeError('Search text argument missing');
    }
    this.withStringQuery.push(searchText);
    return this;
  }

  withSerialPid(seriesPid) {
    if (!seriesPid) {
      throw TypeError('Series PID argument missing');
    }
    const pids = prepareSumQuery(seriesPid);
    this.withSeriesQuery.push(
      [
        'relations.serial.pid_type:serid',
        `NOT (pid:${pids})`,
        `relations.serial.pid:${pids}`,
      ].join(' AND ')
    );
    return this;
  }

  qs() {
    return this.withKeywordQuery
      .concat(
        this.withModeOfIssuanceQuery,
        this.withSeriesQuery,
        this.withStringQuery
      )
      .join(' AND ');
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

const serials = searchText => {
  const builder = queryBuilder();
  return list(
    builder
      .withModeOfIssuance('SERIAL')
      .withSearchText(searchText)
      .qs()
  );
};

const multipartMonographs = query => {
  return list(
    queryBuilder()
      .withModeOfIssuance('MULTIPART_MONOGRAPH')
      .withSearchText(query)
      .qs()
  );
};

const count = query => {
  return http.get(`${seriesURL}?q=${query}`).then(response => {
    response.data = response.data.hits.total;
    return response;
  });
};

export const series = {
  url: apiURL,
  get: get,
  delete: del,
  patch: patch,
  createRelation: createRelation,
  deleteRelation: deleteRelation,
  list: list,
  serials: serials,
  multipartMonographs: multipartMonographs,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
