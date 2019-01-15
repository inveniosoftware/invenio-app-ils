import { http } from './base';
import { toISO } from './date';
import { DateTime } from 'luxon';
import { BackOfficeURLS } from '../urls';
import { generatePath } from 'react-router-dom';

const loanURL = '/circulation/loans/';

const get = loanPid => {
  return http.get(`${loanURL}${loanPid}`);
};

const postAction = (
  url,
  pid,
  loan,
  transactionUserPid,
  transactionLocationPid
) => {
  const now = DateTime.local();
  const payload = {
    transaction_user_pid: transactionUserPid,
    patron_pid: loan.patron_pid,
    transaction_location_pid: transactionLocationPid,
    transaction_date: toISO(now),
  };

  if ('item_pid' in loan) {
    payload['item_pid'] = loan.item_pid;
  } else if ('document_pid' in loan) {
    payload['document_pid'] = loan.document_pid;
  } else {
    throw new Error(
      `No 'item_pid' or 'document_pid' attached to loan '${pid}'`
    );
  }

  return http.post(url, payload);
};

const buildLoansQuery = (documentPid, itemPid, state, patronPid) => {
  const qsDoc = documentPid ? `document_pid:${documentPid}` : '';
  const qsItem = itemPid ? `item_pid:${itemPid}` : '';
  const qsUser = patronPid ? `patron_pid:${patronPid}` : '';
  const qsDocItem =
    qsDoc && qsItem ? `(${qsDoc} OR ${qsItem})` : `${qsDoc}${qsItem}`;
  const qsDocItemUser =
    qsDocItem && qsUser
      ? `(${qsDocItem} AND ${qsUser})`
      : `${qsDocItem}${qsUser}`;
  const qsState = state ? `AND state:${state}` : '';
  return `${qsDocItemUser}${qsState}`;
};

const fetchLoans = (
  documentPid,
  itemPid,
  sortBy,
  sortOrder,
  patronPid,
  state
) => {
  const qs = buildLoansQuery(documentPid, itemPid, state, patronPid);
  const sort =
    sortBy === 'transaction_date' ? `transaction_date` : `start_date`;
  const sortByOrder = sortOrder === 'asc' ? `${sort}:asc` : `${sort}:desc`;
  return http.get(`${loanURL}?q=${qs}&sort:${sortByOrder}`);
};

const viewDetailsClickUrl = loanPid => {
  const path = generatePath(BackOfficeURLS.loanDetails, {
    loanPid: loanPid,
  });
  return path;
};

const showAllClickUrl = (documentPid, itemPid, state, patronPid) => {
  const qs = buildLoansQuery(documentPid, itemPid, state, patronPid);
  return `${BackOfficeURLS.loansSearch}?q=${qs}`;
};

export const loan = {
  url: loanURL,
  get: get,
  postAction: postAction,
  fetchLoans: fetchLoans,
  buildLoansQuery: buildLoansQuery,
  viewDetailsClickUrl: viewDetailsClickUrl,
  showAllClickUrl: showAllClickUrl,
};
