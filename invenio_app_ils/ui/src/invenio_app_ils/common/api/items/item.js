import { http } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';

const itemURL = '/items/';

const get = async itemPid => {
  const response = await http.get(`${itemURL}${itemPid}`);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async itemPid => {
  const response = await http.delete(`${itemURL}${itemPid}`);
  return response;
};

const patch = async (itemPid, ops) => {
  const response = await http.patch(`${itemURL}${itemPid}`, ops, {
    headers: { 'Content-Type': 'application/json-patch+json' },
  });
  response.data = serializer.fromJSON(response.data);
  return response;
};

const list = async query => {
  const response = await http.get(`${itemURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

class QueryBuilder {
  constructor() {
    this.documentQuery = [];
    this.statusQuery = [];
    this.barcodeQuery = [];
    this.availableForCheckoutQuery = [];
  }

  withDocPid(documentPid) {
    if (!documentPid) {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(`document_pid:${prepareSumQuery(documentPid)}`);
    return this;
  }

  withStatus(status) {
    if (!status) {
      throw TypeError('Status argument missing');
    }
    this.statusQuery.push(`status:${prepareSumQuery(status)}`);
    return this;
  }

  availableForCheckout() {
    this.availableForCheckoutQuery.push('NOT circulation_status:*');
    return this;
  }

  withBarcode(barcode) {
    if (!barcode) {
      throw TypeError('Barcode argument missing');
    }
    this.barcodeQuery.push(`barcode:${prepareSumQuery(barcode)}`);
    return this;
  }

  qs() {
    return this.documentQuery
      .concat(
        this.statusQuery,
        this.barcodeQuery,
        this.availableForCheckoutQuery
      )
      .join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

export const item = {
  query: queryBuilder,
  list: list,
  patch: patch,
  get: get,
  delete: del,
  url: itemURL,
};
