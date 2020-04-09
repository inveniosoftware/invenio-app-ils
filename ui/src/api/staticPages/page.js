import { http } from '../base';

const pageURL = '/pages/';

/**
 * GET the static page by providing ID
 *
 * page is not a record type (read more in https://github.com/inveniosoftware/invenio-pages)
 *
 * @param pageID id of the static page
 * @returns {Promise<AxiosResponse<T>>} page object
 */
const get = async pageID => {
  return http.get(`${pageURL}${pageID}`);
};

export const page = {
  get: get,
  url: pageURL,
};
