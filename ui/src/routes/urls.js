import { generatePath } from 'react-router-dom';

const AuthenticationBase = '/';

const AuthenticationRoutesList = {
  login: `${AuthenticationBase}login`,
  redirectUrlAfterLogin: `${AuthenticationBase}login?next=:nextUrl`,
  confirmEmail: `${AuthenticationBase}confirm-email`,
};

const AuthenticationRoutesGenerators = {
  redirectAfterLogin: nextUrl =>
    generatePath(AuthenticationRoutesList.redirectUrlAfterLogin, {
      nextUrl: nextUrl,
    }),
};

export const AuthenticationRoutes = {
  ...AuthenticationRoutesList,
  ...AuthenticationRoutesGenerators,
};

const FrontSiteBase = '/';

const FrontSiteRoutesList = {
  home: FrontSiteBase,
  patronProfile: `${FrontSiteBase}profile`,
  documentsList: `${FrontSiteBase}search`,
  documentDetails: `${FrontSiteBase}literature/:documentPid`,
  documentRequestForm: `${FrontSiteBase}request`,
  seriesDetails: `${FrontSiteBase}series/:seriesPid`,
};

const FrontSiteRoutesGenerators = {
  documentsListWithQuery: qs => `${FrontSiteRoutesList.documentsList}?q=${qs}`,
  documentDetailsFor: documentPid =>
    generatePath(FrontSiteRoutesList.documentDetails, {
      documentPid: documentPid,
    }),
  seriesDetailsFor: seriesPid =>
    generatePath(FrontSiteRoutesList.seriesDetails, {
      seriesPid: seriesPid,
    }),
};

export const FrontSiteRoutes = {
  ...FrontSiteRoutesGenerators,
  ...FrontSiteRoutesList,
};

const BackOfficeBase = '/backoffice';

const BackOfficeRoutesList = {
  home: BackOfficeBase,
  documentCreate: `${BackOfficeBase}/documents/create`,
  documentDetails: `${BackOfficeBase}/documents/:documentPid`,
  documentEdit: `${BackOfficeBase}/documents/:documentPid/edit`,
  documentRequestDetails: `${BackOfficeBase}/document-requests/:documentRequestPid`,
  documentRequestsList: `${BackOfficeBase}/document-requests`,
  documentsList: `${BackOfficeBase}/documents`,
  eitemCreate: `${BackOfficeBase}/eitems/create`,
  eitemDetails: `${BackOfficeBase}/eitems/:eitemPid`,
  eitemEdit: `${BackOfficeBase}/eitems/:eitemPid/edit`,
  eitemsList: `${BackOfficeBase}/eitems`,
  ilocationsCreate: `${BackOfficeBase}/internal-locations/create`,
  ilocationsEdit: `${BackOfficeBase}/internal-locations/:ilocationPid/edit`,
  itemCreate: `${BackOfficeBase}/items/create`,
  itemDetails: `${BackOfficeBase}/items/:itemPid`,
  itemEdit: `${BackOfficeBase}/items/:itemPid/edit`,
  itemsList: `${BackOfficeBase}/items`,
  loanDetails: `${BackOfficeBase}/loans/:loanPid`,
  loansList: `${BackOfficeBase}/loans`,
  locationsCreate: `${BackOfficeBase}/locations/create`,
  locationsEdit: `${BackOfficeBase}/locations/:locationPid/edit`,
  locationsList: `${BackOfficeBase}/locations`,
  patronDetails: `${BackOfficeBase}/patrons/:patronPid`,
  patronsList: `${BackOfficeBase}/patrons`,
  seriesCreate: `${BackOfficeBase}/series/create`,
  seriesDetails: `${BackOfficeBase}/series/:seriesPid`,
  seriesEdit: `${BackOfficeBase}/series/:seriesPid/edit`,
  seriesList: `${BackOfficeBase}/series`,
  stats: {
    home: `${BackOfficeBase}/stats`,
  },
};

const BackOfficeRouteGenerators = {
  documentEditFor: documentPid =>
    generatePath(BackOfficeRoutesList.documentEdit, {
      documentPid: documentPid,
    }),
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
  eitemEditFor: eitemPid =>
    generatePath(BackOfficeRoutesList.eitemEdit, { eitemPid: eitemPid }),
  eItemsListWithQuery: qs => `${BackOfficeRoutesList.eitemsList}?q=${qs}`,
  itemsListWithQuery: qs => `${BackOfficeRoutesList.itemsList}?q=${qs}`,
  itemDetailsFor: itemPid =>
    generatePath(BackOfficeRoutesList.itemDetails, { itemPid: itemPid }),
  itemEditFor: itemPid =>
    generatePath(BackOfficeRoutesList.itemEdit, { itemPid: itemPid }),
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

const AcquisitionBase = `${BackOfficeBase}/acquisition`;

const AcquisitionRoutesList = {
  orderCreate: `${AcquisitionBase}/orders/create`,
  orderDetails: `${AcquisitionBase}/orders/:orderPid`,
  orderEdit: `${AcquisitionBase}/orders/:orderPid/edit`,
  ordersList: `${AcquisitionBase}/orders`,
  vendorCreate: `${AcquisitionBase}/vendors/create`,
  vendorDetails: `${AcquisitionBase}/vendors/:vendorPid`,
  vendorEdit: `${AcquisitionBase}/vendors/:vendorPid/edit`,
  vendorsList: `${AcquisitionBase}/vendors`,
};

const AcquisitionRouteGenerators = {
  orderDetailsFor: orderPid =>
    generatePath(AcquisitionRoutesList.orderDetails, { orderPid: orderPid }),
  orderEditFor: orderPid =>
    generatePath(AcquisitionRoutesList.orderEdit, { orderPid: orderPid }),
  ordersListWithQuery: qs => `${AcquisitionRoutesList.ordersList}?q=${qs}`,
  vendorDetailsFor: vendorPid =>
    generatePath(AcquisitionRoutesList.vendorDetails, { vendorPid: vendorPid }),
  vendorEditFor: vendorPid =>
    generatePath(AcquisitionRoutesList.vendorEdit, { vendorPid: vendorPid }),
  vendorsListWithQuery: qs => `${AcquisitionRoutesList.vendorsList}?q=${qs}`,
};

export const AcquisitionRoutes = {
  ...AcquisitionRoutesList,
  ...AcquisitionRouteGenerators,
};

const ILLBase = `${BackOfficeBase}/ill`;

const ILLRoutesList = {
  libraryList: `${ILLBase}/libraries`,
  libraryDetails: `${ILLBase}/libraries/:libraryPid`,
  libraryEdit: `${ILLBase}/libraries/:libraryPid/edit`,
  libraryCreate: `${ILLBase}/libraries/create`,
  borrowingRequestList: `${ILLBase}/borrowing-requests`,
  borrowingRequestDetails: `${ILLBase}/borrowing-requests/:borrowingRequestPid`,
  borrowingRequestEdit: `${ILLBase}/borrowing-requests/:borrowingRequestPid/edit`,
  borrowingRequestCreate: `${ILLBase}/borrowing-requests/create`,
};

const ILLRoutesGenerators = {
  libraryDetailsFor: libraryPid =>
    generatePath(ILLRoutesList.libraryDetails, {
      libraryPid: libraryPid,
    }),
  libraryEditFor: libraryPid =>
    generatePath(ILLRoutesList.libraryEdit, {
      libraryPid: libraryPid,
    }),
  borrowingRequestListWithQuery: qs =>
    `${ILLRoutesList.borrowingRequestList}?q=${qs}`,
  borrowingRequestDetailsFor: borrowingRequestPid =>
    generatePath(ILLRoutesList.borrowingRequestDetails, {
      borrowingRequestPid: borrowingRequestPid,
    }),
  borrowingRequestEditFor: borrowingRequestPid =>
    generatePath(ILLRoutesList.borrowingRequestEdit, {
      borrowingRequestPid: borrowingRequestPid,
    }),
};

export const ILLRoutes = {
  ...ILLRoutesList,
  ...ILLRoutesGenerators,
};

export const DetailsRouteByPidTypeFor = pidType => {
  switch (pidType) {
    case 'pitmid':
      return BackOfficeRouteGenerators.itemDetailsFor;
    case 'illbid':
      return ILLRoutesGenerators.borrowingRequestDetailsFor;
    default:
      throw new Error(
        `Cannot generate url to the detail page for unknown pidType: ${pidType}`
      );
  }
};
