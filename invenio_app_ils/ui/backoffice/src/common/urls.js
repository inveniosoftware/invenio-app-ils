//NOTE: These are route urls used for navigation from the application
export const URLS = {
  root: '/',
  basename: '/backoffice',
  itemList: '/items',
  itemDetails: id => `/items/${id}`,
  loanList: '/loans',
  loanDetails: id => `/loans/${id}`,
};
