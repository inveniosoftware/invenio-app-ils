export const invenioConfig = {
  circulation: {
    deliveryMethods: {
      DELIVERY: 'Delivery',
      PICKUP: 'Pick it up at the library desk',
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
  default_results_size: 10,
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
        'tags',
        'languages',
        'document_type',
        'relations',
        'has_items',
        'has_eitems',
        'has_items_for_loan',
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
            title: 'Available Items',
          },
          {
            default_order: 'desc',
            field: 'mostloaned',
            order: 4,
            title: 'Most loaned',
          },
        ],
      },
      sortOrder: ['asc', 'desc'],
    },
  },
  editor: {
    url: '/editor',
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
