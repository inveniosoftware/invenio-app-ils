import { generatePath } from 'react-router-dom';
import { invenioConfig } from './config';

const FrontSiteBase = '/';

export const FrontSiteURLS = {
  home: FrontSiteBase,
  bookDetails: `${FrontSiteBase}books/:documentPid`,
};

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

export const documentsSearchQueryUrl = qs => {
  return `${BackOfficeURLS.documentsSearch}?q=${qs}`;
};

export const openRecordEditor = (path, recid = '') => {
  window.open(`${invenioConfig.editor.url}${path}${recid}`, '_blank');
};
