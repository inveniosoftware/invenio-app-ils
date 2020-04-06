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
    extensionsMaxCount: 3,
    loanWillExpireDays: 7,
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
  documents: {
    frontsiteMaxLinks: 5, // maximum number of links to show on details page
    types: [
      { value: 'BOOK', text: 'Book' },
      { value: 'PROCEEDING', text: 'Proceeding' },
      { value: 'STANDARD', text: 'Standard' },
      { value: 'PERIODICAL_ISSUE', text: 'Periodical issue' },
    ],
  },
  documentRequests: {
    physicalItemProviders: {
      acq: { name: 'Acquisition', pid_type: 'acqoid' },
      ill: { name: 'InterLibrary', pid_type: 'illbid' },
    },
    rejectTypes: {
      userCancel: 'USER_CANCEL',
      inCatalog: 'IN_CATALOG',
      notFound: 'NOT_FOUND',
    },
  },
  eitems: {
    maxFiles: 5,
  },
  i18n: {
    priceLocale: 'fr-CH',
  },
  items: {
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
    canCirculateStatuses: ['CAN_CIRCULATE'],
    referenceStatuses: ['FOR_REFERENCE_ONLY'],
  },
  max_results_window: 10000,
  acqOrders: {
    defaultCurrency: 'CHF',
    maxShowOrderLines: 3,
    statuses: [
      { value: 'CANCELLED', text: 'Cancelled' },
      { value: 'RECEIVED', text: 'Received' },
      { value: 'ORDERED', text: 'Ordered' },
      { value: 'PENDING', text: 'Pending' },
    ],
  },
  illBorrowingRequests: {
    statuses: [
      { value: 'CANCELLED', text: 'Cancelled' },
      { value: 'PENDING', text: 'Pending' },
      { value: 'REQUESTED', text: 'Requested' },
      { value: 'ON_LOAN', text: 'On loan' },
      { value: 'RETURNED', text: 'Returned' },
    ],
  },
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
  vocabularies: {
    document: {
      alternativeIdentifier: {
        scheme: 'alternative_identifier_scheme',
      },
      alternativeTitle: {
        language: 'language',
        type: 'alternative_title_type',
      },
      author: {
        affiliation: {
          identifier: {
            scheme: 'affiliation_identifier_scheme',
          },
        },
        identifier: {
          scheme: 'author_identifier_scheme',
        },
        roles: {
          type: 'author_role',
        },
        type: 'author_type',
      },
      conferenceInfo: {
        country: 'country',
        identifier: {
          scheme: 'conference_identifier_scheme',
        },
      },
      identifier: {
        scheme: 'identifier_scheme',
      },
      license: 'license',
      tags: 'tag',
      type: 'document_type',
    },
    series: {
      identifier: {
        scheme: 'series_identifier_scheme',
      },
      language: 'language',
    },
    order: {
      currencies: 'currencies',
      acq_medium: 'acq_medium',
      acq_order_line_payment_mode: 'acq_order_line_payment_mode',
      acq_order_line_purchase_type: 'acq_order_line_purchase_type',
      acq_payment_mode: 'acq_payment_mode',
      acq_recipient: 'acq_recipient',
    },
  },
};

export function getDisplayVal(configField, value) {
  return _get(invenioConfig, configField).find(entry => entry.value === value)
    .text;
}
