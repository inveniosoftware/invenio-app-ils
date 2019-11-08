import _get from 'lodash/get';

export const invenioConfig = {
  authors: {
    maxDisplay: 5,
  },
  circulation: {
    deliveryMethods: {
      PICKUP: 'Pick it up at the library desk',
      DELIVERY: 'Have it delivered to my office',
    },
    loanActiveStates: [
      'ITEM_AT_DESK',
      'ITEM_ON_LOAN',
      'ITEM_IN_TRANSIT_FOR_PICKUP',
      'ITEM_IN_TRANSIT_TO_HOUSE',
    ],
    loanCancelledStates: ['CANCELLED'],
    loanCompletedStates: ['ITEM_RETURNED'],
    loanRequestStates: ['PENDING'],
    requestDuration: 60,
  },
  defaultResultsSize: 15,
  items: {
    canCirculateStates: ['CAN_CIRCULATE'],
    circulationRestrictions: [
      { value: 'NO_RESTRICTION', text: 'No restriction' },
      { value: 'ONE_WEEK', text: '1 week' },
      { value: 'TWO_WEEKS', text: '2 weeks' },
      { value: 'THREE_WEEKS', text: '3 weeks' },
      { value: 'FOUR_WEEKS', text: '4 weeks' },
    ],
    mediums: [
      { value: 'NOT_SPECIFIED', text: 'Not specified' },
      { value: 'ONLINE', text: 'Online' },
      { value: 'PAPER', text: 'Paper' },
      { value: 'CDROM', text: 'CD-ROM' },
      { value: 'DVD', text: 'DVD' },
      { value: 'VHS', text: 'VHS' },
    ],
    statuses: [
      { value: 'CAN_CIRCULATE', text: 'Can circulate' },
      { value: 'FOR_REFERENCE_ONLY', text: 'For reference only' },
      { value: 'MISSING', text: 'Missing' },
      { value: 'IN_BINDING', text: 'In binding' },
      { value: 'SCANNING', text: 'Scanning' },
    ],
  },
  loans: {
    maxExtensionsCount: 3,
  },
  max_results_window: 10000,
  relationTypes: [
    {
      id: 3,
      label: 'Multipart Monograph',
      name: 'multipart_monograph',
    },
    {
      id: 4,
      label: 'Serial',
      name: 'serial',
    },
    {
      id: 0,
      label: 'Language',
      name: 'language',
    },
    {
      id: 1,
      label: 'Edition',
      name: 'edition',
    },
    {
      id: 2,
      label: 'Other',
      name: 'other',
    },
  ],
  rest_mimetype_query_arg_name: 'format',
  support_email: 'info@inveniosoftware.org',
};

export function getDisplayVal(configField, value) {
  return _get(invenioConfig, configField).find(entry => entry.value === value);
}
