import { generatePath } from 'react-router-dom';

const ApiBase = '/api';

export const ApiURLS = {
  locationList: `${ApiBase}/locations/`,
  locationItem: `${ApiBase}/locations/:locationPid`,
  internalLocationList: `${ApiBase}/internal-locations/`,
  internalLocationItem: `${ApiBase}/internal-locations/:internalLocationPid`,
};

export const locationItemUrl = locationPid => {
  return generatePath(ApiURLS.locationItem, {
    locationPid: locationPid,
  });
};

export const internalLocationItemUrl = internalLocationPid => {
  return generatePath(ApiURLS.internalLocationItem, {
    internalLocationPid: internalLocationPid,
  });
};
