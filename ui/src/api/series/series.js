import { http, apiConfig } from '@api/base';
import { serializer } from './serializer';
import { prepareSumQuery } from '@api/utils';
import { add as addRelation, remove as removeRelation } from '@api/relations';

const seriesURL = '/series/';

const get = async seriesPid => {
  const resp = await http.get(`${seriesURL}${seriesPid}`);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const create = async data => {
  const resp = await http.post(`${seriesURL}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const del = async seriesPid => {
  const response = await http.delete(`${seriesURL}${seriesPid}`);
  return response;
};

const update = async (seriesPid, data) => {
  const resp = await http.put(`${seriesURL}${seriesPid}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const createRelation = async (
  referrer,
  relatedList,
  relationType,
  extra = {}
) => {
  const url = `${seriesURL}${referrer.metadata.pid}`;
  const resp = addRelation(url, referrer, relatedList, relationType, extra);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const deleteRelation = async (referrer, relation) => {
  const url = `${seriesURL}${referrer.metadata.pid}`;
  const relationType = relation.relation_type;
  const resp = removeRelation(url, referrer, relation, relationType);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

class QueryBuilder {
  constructor() {
    this.withModeOfIssuanceQuery = [];
    this.withSeriesQuery = [];
    this.withStringQuery = [];
    this.withExcludeQuery = [];
  }

  withModeOfIssuance(moi) {
    if (!moi) {
      throw TypeError('Mode of issuance argument missing');
    }
    this.withModeOfIssuanceQuery.push(`mode_of_issuance:${moi}`);
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
        `relations.serial.pid_value:${pids}`,
      ].join(' AND ')
    );
    return this;
  }

  exclude(series) {
    if (!series) {
      throw TypeError('series argument missing');
    }
    const pids = prepareSumQuery(
      series.map(o => {
        if (o.hasOwnProperty('metadata')) {
          return o.metadata.pid;
        } else if (o.hasOwnProperty('pid')) {
          return o.pid;
        } else {
          throw TypeError('series objects invalid: no "pid" attribute found');
        }
      })
    );
    this.withExcludeQuery.push(`NOT (pid:${pids})`);
    return this;
  }

  qs() {
    return this.withModeOfIssuanceQuery
      .concat(this.withSeriesQuery, this.withStringQuery, this.withExcludeQuery)
      .join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = async query => {
  const response = await http.get(`${seriesURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

const serials = searchText => {
  const builder = queryBuilder();
  let query = builder.withModeOfIssuance('SERIAL').withSearchText(searchText);

  return list(query.qs());
};

const multipartMonographs = query => {
  return list(
    queryBuilder()
      .withModeOfIssuance('MULTIPART_MONOGRAPH')
      .withSearchText(query)
      .qs()
  );
};

const count = async query => {
  const response = await http.get(`${seriesURL}?q=${query}`);
  response.data = response.data.hits.total;
  return response;
};

export const series = {
  searchBaseURL: `${apiConfig.baseURL}${seriesURL}`,
  create: create,
  get: get,
  delete: del,
  update: update,
  createRelation: createRelation,
  deleteRelation: deleteRelation,
  list: list,
  serials: serials,
  multipartMonographs: multipartMonographs,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
