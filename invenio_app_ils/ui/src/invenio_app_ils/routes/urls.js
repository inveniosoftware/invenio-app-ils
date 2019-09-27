import { generatePath } from 'react-router-dom';

const FrontSiteBase = '/';

const FrontSiteRoutesList = {
  home: FrontSiteBase,
  patronProfile: `${FrontSiteBase}profile`,
  documentsList: `${FrontSiteBase}search`,
  documentDetails: `${FrontSiteBase}records/:documentPid`,
  documentRequestForm: `${FrontSiteBase}request`,
};

const FrontSiteRoutesGenerators = {
  documentsListWithQuery: qs => `${FrontSiteRoutesList.documentsList}?q=${qs}`,
  documentDetailsFor: documentPid =>
    generatePath(FrontSiteRoutesList.documentDetails, {
      documentPid: documentPid,
    }),
};

export const FrontSiteRoutes = {
  ...FrontSiteRoutesGenerators,
  ...FrontSiteRoutesList,
};

const BackOfficeBase = '/backoffice';

const BackOfficeRoutesList = {
  home: BackOfficeBase,
  documentsList: `${BackOfficeBase}/documents`,
  documentsCreate: `${BackOfficeBase}/documents/create`,
  documentDetails: `${BackOfficeBase}/documents/:documentPid`,
  documentRequestsList: `${BackOfficeBase}/document-requests`,
  documentRequestDetails: `${BackOfficeBase}/document-requests/:documentRequestPid`,
  eitemsList: `${BackOfficeBase}/eitems`,
  eitemDetails: `${BackOfficeBase}/eitems/:eitemPid`,
  itemsList: `${BackOfficeBase}/items`,
  itemDetails: `${BackOfficeBase}/items/:itemPid`,
  loansList: `${BackOfficeBase}/loans`,
  loanDetails: `${BackOfficeBase}/loans/:loanPid`,
  patronsList: `${BackOfficeBase}/patrons`,
  patronDetails: `${BackOfficeBase}/patrons/:patronPid`,
  ilocationsCreate: `${BackOfficeBase}/internal-locations/create`,
  ilocationsEdit: `${BackOfficeBase}/internal-locations/:ilocationPid/edit`,
  locationsCreate: `${BackOfficeBase}/locations/create`,
  locationsEdit: `${BackOfficeBase}/locations/:locationPid/edit`,
  locationsList: `${BackOfficeBase}/locations`,
  seriesCreate: `${BackOfficeBase}/series/create`,
  seriesEdit: `${BackOfficeBase}/series/:seriesPid/edit`,
  seriesList: `${BackOfficeBase}/series`,
  seriesDetails: `${BackOfficeBase}/series/:seriesPid`,
  stats: {
    home: `${BackOfficeBase}/stats`,
  },
};

const BackOfficeRouteGenerators = {
  documentsListWithQuery: qs => `${BackOfficeRoutesList.documentsList}?q=${qs}`,
  documentDetailsFor: documentPid =>
    generatePath(BackOfficeRoutesList.documentDetails, {
      documentPid: documentPid,
    }),
  documentRequestsListWithQuery: qs =>
    `${BackOfficeRoutesList.documentRequestsList}?q=${qs}`,
  documentRequestDetailsFor: documentRequestPid =>
    generatePath(BackOfficeRoutesList.documentRequestDetails, {
      documentRequestPid: documentRequestPid,
    }),
  eitemDetailsFor: eitemPid =>
    generatePath(BackOfficeRoutesList.eitemDetails, { eitemPid: eitemPid }),
  itemsListWithQuery: qs => `${BackOfficeRoutesList.itemsList}?q=${qs}`,
  itemDetailsFor: itemPid =>
    generatePath(BackOfficeRoutesList.itemDetails, { itemPid: itemPid }),
  loansListWithQuery: qs => `${BackOfficeRoutesList.loansList}?q=${qs}`,
  loanDetailsFor: loanPid =>
    generatePath(BackOfficeRoutesList.loanDetails, { loanPid: loanPid }),
  ilocationsEditFor: ilocationPid =>
    generatePath(BackOfficeRoutesList.ilocationsEdit, {
      ilocationPid: ilocationPid,
    }),
  locationsEditFor: locationPid =>
    generatePath(BackOfficeRoutesList.locationsEdit, {
      locationPid: locationPid,
    }),
  patronDetailsFor: patronPid =>
    generatePath(BackOfficeRoutesList.patronDetails, { patronPid: patronPid }),
  seriesListWithQuery: qs => `${BackOfficeRoutesList.seriesList}?q=${qs}`,
  seriesDetailsFor: seriesPid =>
    generatePath(BackOfficeRoutesList.seriesDetails, { seriesPid: seriesPid }),
  seriesEditFor: seriesPid =>
    generatePath(BackOfficeRoutesList.seriesEdit, {
      seriesPid: seriesPid,
    }),
};

export const BackOfficeRoutes = {
  ...BackOfficeRoutesList,
  ...BackOfficeRouteGenerators,
};
