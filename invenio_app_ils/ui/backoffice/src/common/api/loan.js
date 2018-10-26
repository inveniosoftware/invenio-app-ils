import { http } from './base';

const loanURL = '/circulation/loans/';

const getList = () => {
  return http.get(loanURL);
};

const getRecord = loanId => {
  return http.get(`${loanURL}${loanId}`);
};

const postRecord = (loanId, data) => {
  return http.post(`${loanURL}${loanId}`, data);
};

const postAction = (loanId, data) => {
  return http.post(`${loanURL}${loanId}/next`, data);
};

export const loan = {
  getList: getList,
  getRecord: getRecord,
  postRecord: postRecord,
  postAction: postAction,
};
