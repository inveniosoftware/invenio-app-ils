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
  documentRequests: {
    filters: [
      {
        title: 'State',
        field: 'state',
        aggName: 'state',
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
        labels: invenioConfig.items.statuses,
      },
      {
        title: 'Medium',
        field: 'medium',
        aggName: 'medium',
        labels: invenioConfig.items.mediums,
      },
      {
        title: 'Circulation',
        field: 'circulation.state',
        aggName: 'circulation',
        labels: invenioConfig.items.circulationStates,
      },
      {
        title: 'Circulation restriction',
        field: 'circulation_restriction',
        aggName: 'circulation_restriction',
        labels: invenioConfig.items.circulationRestrictions
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
    filters: [],
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
  loans: {
    filters: [
      {
        title: 'State',
        field: 'state',
        aggName: 'state',
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
  series: {
    filters: [
      {
        title: 'Mode of Issuance',
        field: 'mode_of_issuance',
        aggName: 'moi',
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
