import { generatePath } from 'react-router-dom';
import { loan as loanApi } from './api/loan';
import { item as itemApi } from './api/item';

export const FrontSiteURLS = {};

const BackOfficeBase = '/backoffice';

export const BackOfficeURLS = {
  home: BackOfficeBase,
  documentDetails: `${BackOfficeBase}/documents/:documentPid`,
  itemsSearch: `${BackOfficeBase}/items`,
  itemDetails: `${BackOfficeBase}/items/:itemPid`,
  loansSearch: `${BackOfficeBase}/loans`,
  loanDetails: `${BackOfficeBase}/loans/:loanPid`,
  patronDetails: `${BackOfficeBase}/users/:userPid`,
};

export const viewLoanDetailsUrl = loanPid => {
  return generatePath(BackOfficeURLS.loanDetails, {
    loanPid: loanPid,
  });
};

export const showAllLoansUrl = (
  documentPid,
  itemPid,
  state,
  patronPid,
  extraQuery
) => {
  const qs = loanApi.buildLoansQuery(
    documentPid,
    itemPid,
    state,
    patronPid,
    extraQuery
  );
  return `${BackOfficeURLS.loansSearch}?q=${qs}`;
};

export const viewItemDetailsUrl = itemPid => {
  return generatePath(BackOfficeURLS.itemDetails, {
    itemPid: itemPid,
  });
};

export const showAllItemsUrl = (documentPid, state, extraQuery) => {
  const qs = itemApi.buildItemsQuery(documentPid, state, extraQuery);
  return `${BackOfficeURLS.itemsSearch}?q=${qs}`;
};
