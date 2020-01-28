import { invenioConfig } from '@config/invenioConfig';
import capitalize from 'lodash/capitalize';
import merge from 'lodash/merge';

const resultsPerPageValues = [
  {
    text: '15',
    value: 15,
  },
  {
    text: '30',
    value: 30,
  },
  {
    text: '60',
    value: 60,
  },
];

const searchConfig = {
  documents: {
    filters: [
      {
        title: 'Document types',
        field: 'document_type',
        aggName: 'doctype',
      },
      {
        title: 'Availability',
        field: 'circulation.has_items_for_loan',
        aggName: 'availability',
      },
      {
        title: 'Tags',
        field: 'tags',
        aggName: 'tag',
      },
      {
        title: 'Languages',
        field: 'languages',
        aggName: 'language',
      },
      {
        title: 'Relations',
        field: 'relations',
        aggName: 'relation',
      },
      {
        title: 'Medium',
        field: 'stock.mediums',
        aggName: 'medium',
      },
      {
        title: 'Open access',
        field: 'open_access',
        aggName: 'access',
      },
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
          default_order: 'desc',
          field: 'publication_year',
          order: 5,
          title: 'Publication year',
        },
      ],
    },
    sortOrder: ['asc', 'desc'],
  },
  documentRequests: {
    filters: [
      {
        title: 'State',
        field: 'state',
        aggName: 'state',
      },
      {
        title: 'Reject reason',
        field: 'reject_reason',
        aggName: 'reject_reason',
      },
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
      ],
    },
    sortOrder: ['asc', 'desc'],
  },
  items: {
    filters: [
      {
        title: 'Status',
        field: 'status',
        aggName: 'status',
      },
      {
        title: 'Medium',
        field: 'medium',
        aggName: 'medium',
      },
      {
        title: 'Circulation',
        field: 'circulation.state',
        aggName: 'circulation',
      },
      {
        title: 'Circulation restriction',
        field: 'circulation_restriction',
        aggName: 'circulation_restriction',
      },
      {
        title: 'Internal location',
        field: 'internal_location.name',
        aggName: 'internal_location',
      },
      {
        title: 'Location',
        field: 'internal_location.location.name',
        aggName: 'location',
      },
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
      ],
    },
    sortOrder: ['asc', 'desc'],
  },
  eitems: {
    filters: [
      {
        title: 'Open access',
        field: 'open_access',
        aggName: 'access',
      },
    ],
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
  literature: {
    filters: [],
    sortBy: {
      onEmptyQuery: 'publication_year',
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
          default_order: 'desc',
          field: 'publication_year',
          order: 5,
          title: 'Publication year',
        },
      ],
    },
    sortOrder: ['asc', 'desc'],
  },
  loans: {
    filters: [
      {
        title: 'State',
        field: 'state',
        aggName: 'state',
      },
      {
        title: 'Returns',
        field: 'returns',
        aggName: 'returns.end_date',
      },
      {
        title: 'Delivery',
        field: 'delivery.method',
        aggName: 'delivery',
      },
    ],
    sortBy: {
      onEmptyQuery: 'end_date',
      values: [
        {
          field: 'expire_date',
          order: 1,
          title: 'Expriration date',
          default_order: 'desc',
        },
        {
          field: 'end_date',
          order: 2,
          title: 'Loan end date',
          default_order: 'desc',
        },
        {
          field: 'start_date',
          order: 3,
          title: 'Loan start date',
          default_order: 'desc',
        },
        {
          field: 'mostrecent',
          order: 4,
          title: 'Newest',
          default_order: 'asc',
        },
        {
          field: 'extensions',
          order: 5,
          title: 'Extension count',
          default_order: 'asc',
        },
        {
          field: 'bestmatch',
          order: 6,
          title: 'Best match',
          default_order: 'asc',
        },
      ],
    },
    sortOrder: ['asc', 'desc'],
  },
  series: {
    filters: [
      {
        title: 'Mode of Issuance',
        field: 'mode_of_issuance',
        aggName: 'moi',
      },
      {
        title: 'Languages',
        field: 'languages',
        aggName: 'language',
      },
      {
        title: 'Relations',
        field: 'relations',
        aggName: 'relation',
      },
    ],
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
  patrons: {
    filters: [],
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
  orders: {
    filters: [
      {
        title: 'Status',
        field: 'status',
        aggName: 'status',
        labels: invenioConfig.orders.statuses,
      },
      {
        title: 'Vendor',
        field: 'vendor.name',
        aggName: 'vendor',
      },
      {
        title: 'Payment mode',
        field: 'order_lines.payment_mode',
        aggName: 'payment_mode',
      },
      {
        title: 'Medium',
        field: 'order_lines.medium',
        aggName: 'medium',
        labels: invenioConfig.items.mediums,
      },
      {
        title: 'Currency',
        field: 'grand_total.currency',
        aggName: 'currency',
      },
    ],
    sortBy: {
      onEmptyQuery: 'order_date',
      values: [
        {
          default_order: 'desc',
          field: 'order_date',
          order: 1,
          title: 'Order date',
        },
        {
          default_order: 'desc',
          field: 'grand_total',
          order: 2,
          title: `Total (${invenioConfig.orders.defaultCurrency})`,
        },
        {
          default_order: 'desc',
          field: 'received_date',
          order: 3,
          title: 'Received date',
        },
        {
          default_order: 'desc',
          field: 'expected_delivery_date',
          order: 4,
          title: 'Expected delivery date',
        },
        {
          default_order: 'asc',
          field: 'bestmatch',
          order: 5,
          title: 'Best match',
        },
      ],
    },
    sortOrder: ['desc', 'asc'],
  },
  vendors: {
    filters: [],
    sortBy: {
      onEmptyQuery: 'name',
      values: [
        {
          default_order: 'asc',
          field: 'name',
          order: 1,
          title: 'Name',
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
  libraries: {
    filters: [],
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
  borrowingRequests: {
    filters: [],
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
};

export const getSearchConfig = (modelName, extraOptions = {}) => {
  const config = searchConfig[modelName];
  const result = {
    FILTERS: config.filters,
    RESULTS_PER_PAGE: resultsPerPageValues,
    SORT_BY: config.sortBy.values.map(sortField => {
      return {
        text: sortField.title,
        value: sortField.field,
        defaultValue: sortField.default_order,
      };
    }),
    SORT_BY_ON_EMPTY_QUERY: config.sortBy.onEmptyQuery,
    SORT_ORDER: config.sortOrder.map(sortField => {
      return { text: capitalize(sortField), value: sortField };
    }),
  };
  return merge(result, extraOptions);
};
