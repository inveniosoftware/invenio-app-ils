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
