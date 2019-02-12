import { generatePath } from 'react-router-dom';

export const FrontSiteURLS = {};

const BackOfficeBase = '/backoffice';

export const BackOfficeURLS = {
  home: BackOfficeBase,
  documentDetails: `${BackOfficeBase}/documents/:documentPid`,
  documentsSearch: `${BackOfficeBase}/documents`,
  itemsSearch: `${BackOfficeBase}/items`,
  itemDetails: `${BackOfficeBase}/items/:itemPid`,
  loansSearch: `${BackOfficeBase}/loans`,
  loanDetails: `${BackOfficeBase}/loans/:loanPid`,
  patronDetails: `${BackOfficeBase}/users/:userPid`,
  locationList: `${BackOfficeBase}/locations`,
  // TODO after editor create link estabilished
  newLoan: `${BackOfficeBase}/loans/create`,

  loanRequest: `${BackOfficeBase}/circulation/loans/request`,
  loanCheckout: `${BackOfficeBase}/circulation/loans/checkout`,
  newDocument: `${BackOfficeBase}/documents/create`,
};

export const viewLoanDetailsUrl = loanPid => {
  return generatePath(BackOfficeURLS.loanDetails, {
    loanPid: loanPid,
  });
};

export const loanSearchQueryUrl = qs => {
  return `${BackOfficeURLS.loansSearch}?q=${qs}`;
};

export const viewItemDetailsUrl = itemPid => {
  return generatePath(BackOfficeURLS.itemDetails, {
    itemPid: itemPid,
  });
};

export const itemSearchQueryUrl = qs => {
  return `${BackOfficeURLS.itemsSearch}?q=${qs}`;
};
