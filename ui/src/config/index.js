export const ES_DELAY = 3000;
export const ES_MAX_SIZE = 1000;
export const SUCCESS_AUTO_DISMISS_SECONDS = 10;
export const TRUNCATE_LENGTH = 128;

export const ENABLE_LOCAL_ACCOUNT_LOGIN = true;
export const ENABLE_OAUTH_LOGIN = true;
export const OAUTH_PROVIDERS = [
  {
    label: 'Sign in with CERN',
    name: 'cern',
    baseUrl: '/api/oauth/login/cern',
    icon: 'sign in',
  },
  {
    label: 'Sign in with GitHub',
    name: 'gihub',
    baseUrl: '/api/oauth/login/github',
    icon: 'github',
  },
];
export { getSearchConfig } from './searchConfig';
export { invenioConfig } from './invenioConfig';
