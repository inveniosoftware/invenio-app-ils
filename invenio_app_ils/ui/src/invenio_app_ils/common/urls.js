import { generatePath } from 'react-router-dom';
import { loan as loanApi } from './api/loan';

export const FrontSiteURLS = {};

const BackOfficeBase = '/backoffice';
export const BackOfficeURLS = {
  home: BackOfficeBase,
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
