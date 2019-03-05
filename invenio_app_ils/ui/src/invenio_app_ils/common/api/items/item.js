import { http } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';

const itemURL = '/items/';

const get = itemPid => {
  return http.get(`${itemURL}${itemPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

class QueryBuilder {
  constructor() {
    this.documentQuery = [];
    this.statusQuery = [];
    this.barcodeQuery = [];
  }

  withDocPid(documentPid) {
    if (typeof documentPid === 'undefined' || documentPid === '') {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(`document_pid:${prepareSumQuery(documentPid)}`);
    return this;
  }

  withStatus(status) {
    if (typeof status === 'undefined' || status === '') {
      throw TypeError('Status argument missing');
    }
    this.statusQuery.push(`status:${prepareSumQuery(status)}`);
    return this;
  }

  withBarcode(barcode) {
    if (typeof barcode === 'undefined' || barcode === '') {
      throw TypeError('Barcode argument missing');
    }
    this.barcodeQuery.push(`barcode:${prepareSumQuery(barcode)}`);
    return this;
  }

  qs() {
    return this.documentQuery
      .concat(this.statusQuery, this.barcodeQuery)
      .join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = query => {
  return http.get(`${itemURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

export const item = {
  query: queryBuilder,
  list: list,
  get: get,
  url: itemURL,
};
