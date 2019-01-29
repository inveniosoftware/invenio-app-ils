import { http } from './base';

const locationURL = '/locations/';
const internalLocationURL = '/internal-locations/';

const get = (locationPid = '') => {
  return http.get(`${locationURL}${locationPid}`);
};

const buildInternalLocationsQuery = (locationPid, extraQuery) => {
  const qsDoc = locationPid ? `location_pid:${locationPid}` : '';
  const qsExtra = extraQuery ? `${extraQuery}` : '';
  return `${qsDoc} ${qsExtra}`;
};

const fetchInternalLocations = (locationPid = '', extraQuery = '') => {
  const qs = buildInternalLocationsQuery(locationPid, extraQuery);
  return http.get(`${internalLocationURL}?q=${qs}`);
};

export const location = {
  fetchInternalLocations: fetchInternalLocations,
  get: get,
  url: locationURL,
};
