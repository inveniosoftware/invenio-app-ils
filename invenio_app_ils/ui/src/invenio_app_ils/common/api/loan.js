import { http } from './base';
import { toISO } from './date';
import { DateTime } from 'luxon';

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

const buildLoansQuery = (
  documentPid,
  itemPid,
  state,
  patronPid,
  extraQuery
) => {
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
  const qsExtra = extraQuery ? `${extraQuery}` : '';
  return `${qsDocItemUser}${qsState} ${qsExtra}`;
};

const fetchLoans = (
  documentPid,
  itemPid,
  sortBy,
  sortOrder,
  patronPid,
  state,
  extraQuery
) => {
  const qs = buildLoansQuery(
    documentPid,
    itemPid,
    state,
    patronPid,
    extraQuery
  );
  const sort =
    sortBy === 'transaction_date' ? `transaction_date` : `start_date`;
  const sortByOrder = sortOrder === 'asc' ? `${sort}:asc` : `${sort}:desc`;
  return http.get(`${loanURL}?q=${qs}&sort:${sortByOrder}`);
};

export const loan = {
  url: loanURL,
  get: get,
  postAction: postAction,
  fetchLoans: fetchLoans,
  buildLoansQuery: buildLoansQuery,
};
