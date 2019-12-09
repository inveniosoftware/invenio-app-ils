import { http } from '../base';

const vendorURL = '/acquisition/vendors/';

const get = async vendorPid => {
  const response = await http.get(`${vendorURL}${vendorPid}`);
  return response;
};

const del = async vendorPid => {
  const response = await http.delete(`${vendorURL}${vendorPid}`);
  return response;
};

const create = async data => {
  const response = await http.post(`${vendorURL}`, data);
  return response;
};

const update = async (vendorPid, data) => {
  const response = await http.put(`${vendorURL}${vendorPid}`, data);
  return response;
};

const list = async (query = '', size = 100) => {
  const response = await http.get(`${vendorURL}?q=${query}&size=${size}`);
  response.data.total = response.data.hits.total;
  return response;
};

export const vendor = {
  create: create,
  delete: del,
  get: get,
  list: list,
  update: update,
  url: vendorURL,
};
