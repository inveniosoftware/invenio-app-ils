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
  default_results_size: 15,
  documentRequests: {
    search: {
      aggs: ['state'],
      sortBy: {
        onEmptyQuery: 'mostrecent',
        values: [
          {
            default_order: 'asc',
            field: 'mostrecent',
            order: 1,
            title: 'Newest',
          },
          {
            default_order: 'asc',
            field: 'bestmatch',
            order: 2,
            title: 'Best match',
          },
        ],
      },
      sortOrder: ['asc', 'desc'],
    },
  },
  documents: {
    search: {
      aggs: [
        'document_type',
        'has_items',
        'has_eitems',
        'has_items_for_loan',
        'tags',
        'languages',
        'relations',
      ],
      sortBy: {
        onEmptyQuery: 'mostrecent',
        values: [
          {
            default_order: 'asc',
            field: 'mostrecent',
            order: 1,
            title: 'Newest',
          },
          {
            default_order: 'asc',
            field: 'bestmatch',
            order: 2,
            title: 'Best match',
          },
          {
            default_order: 'asc',
            field: 'available_items',
            order: 3,
            title: 'Available copies',
          },
          {
            default_order: 'desc',
            field: 'mostloaned',
            order: 4,
            title: 'Most loaned',
          },
          {
            default_order: 'asc',
            field: 'published',
            order: 5,
            title: 'Published date',
          },
        ],
      },
      sortOrder: ['asc', 'desc'],
    },
  },
  eitems: {
    search: {
      aggs: [],
      sortBy: {
        onEmptyQuery: 'mostrecent',
        values: [
          {
            field: 'mostrecent',
            order: 1,
            title: 'Newest',
            default_order: 'asc',
          },
          {
            field: 'bestmatch',
            order: 2,
            title: 'Best match',
            default_order: 'asc',
          },
        ],
      },
      sortOrder: ['asc', 'desc'],
    },
  },
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
    search: {
      aggs: ['status', 'medium', 'circulation'],
      sortBy: {
        onEmptyQuery: 'mostrecent',
        values: [
          {
            field: 'mostrecent',
            order: 1,
            title: 'Newest',
            default_order: 'asc',
          },
          {
            field: 'bestmatch',
            order: 2,
            title: 'Best match',
            default_order: 'asc',
          },
        ],
      },
      sortOrder: ['asc', 'desc'],
    },
    statuses: [
      { value: 'CAN_CIRCULATE', text: 'Can circulate' },
      { value: 'FOR_REFERENCE_ONLY', text: 'For reference only' },
      { value: 'MISSING', text: 'Missing' },
      { value: 'IN_BINDING', text: 'In binding' },
      { value: 'SCANNING', text: 'Scanning' },
    ],
  },
  loans: {
    search: {
      aggs: ['state'],
      sortBy: {
        onEmptyQuery: 'mostrecent',
        values: [
          {
            field: 'mostrecent',
            order: 1,
            title: 'Newest',
            default_order: 'asc',
          },
          {
            field: 'bestmatch',
            order: 2,
            title: 'Best match',
            default_order: 'asc',
          },
        ],
      },
      sortOrder: ['asc', 'desc'],
    },
  },
  max_results_window: 10000,
  patrons: {
    search: {
      aggs: [],
      sortBy: {
        onEmptyQuery: 'bestmatch',
        values: [
          {
            default_order: 'asc',
            field: 'bestmatch',
            order: 1,
            title: 'Best match',
          },
        ],
      },
      sortOrder: ['asc', 'desc'],
    },
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
  series: {
    search: {
      aggs: ['moi'],
      sortBy: {
        onEmptyQuery: 'mostrecent',
        values: [
          {
            field: 'mostrecent',
            order: 1,
            title: 'Newest',
            default_order: 'asc',
          },
          {
            field: 'bestmatch',
            order: 2,
            title: 'Best match',
            default_order: 'asc',
          },
        ],
      },
      sortOrder: ['asc', 'desc'],
    },
  },
  support_email: 'info@inveniosoftware.org',
};

export function getDisplayVal(configField, value) {
  return _get(invenioConfig, configField).find(entry=>
    entry.value === value
  )
}
