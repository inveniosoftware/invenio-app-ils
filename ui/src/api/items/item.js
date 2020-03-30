import { invenioConfig } from '@config';
import { apiConfig, http } from '../base';
import { prepareSumQuery } from '../utils';
import { serializer } from './serializer';

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

const create = async data => {
  const resp = await http.post(`${itemURL}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (itemPid, data) => {
  const response = await http.put(`${itemURL}${itemPid}`, data);
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
    const states = invenioConfig.circulation.loanActiveStates;
    this.availableForCheckoutQuery.push(
      `NOT circulation.state:${prepareSumQuery(states)}`
    );
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
  searchBaseURL: `${apiConfig.baseURL}${itemURL}`,
  query: queryBuilder,
  list: list,
  create: create,
  update: update,
  get: get,
  delete: del,
};
