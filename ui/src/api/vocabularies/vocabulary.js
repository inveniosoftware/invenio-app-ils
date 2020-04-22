import { http, apiConfig } from '../base';
import { serializer } from './serializer';

const vocabulariesURL = '/vocabularies/';

class QueryBuilder {
  constructor() {
    this.withSizeQuery = null;
    this.withStringQuery = [];
    this.withTypeQuery = [];
  }

  withType(type) {
    if (!type) {
      throw TypeError('Type argument missing');
    }
    this.withTypeQuery.push(`type:${type}`);
    return this;
  }

  withSearchText(searchText) {
    if (!searchText) {
      throw TypeError('Search text argument missing');
    }
    this.withStringQuery.push(searchText);
    return this;
  }

  withSize(size) {
    if (!size) {
      throw TypeError('Size argument missing');
    }
    this.withSizeQuery = size;
    return this;
  }

  qs() {
    const query = this.withTypeQuery.concat(this.withStringQuery).join(' AND ');
    if (this.withSizeQuery) {
      return `${query}&size=${this.withSizeQuery}`;
    } else {
      return query;
    }
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = async query => {
  const response = await http.get(`${vocabulariesURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

const count = async query => {
  const response = await http.get(`${vocabulariesURL}?q=${query}`);
  response.data = response.data.hits.total;
  return response;
};

export const vocabulary = {
  searchBaseURL: `${apiConfig.baseURL}${vocabulariesURL}`,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
