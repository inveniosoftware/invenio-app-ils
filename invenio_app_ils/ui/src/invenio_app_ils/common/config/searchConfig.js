import capitalize from 'lodash/capitalize';
import { invenioConfig } from './invenioConfig';
import merge from 'lodash/merge';

const resultsPerPageValues = [
  {
    text: '10',
    value: 10,
  },
  {
    text: '20',
    value: 20,
  },
  {
    text: '50',
    value: 50,
  },
];

const aggsMappings = {
  documents: {
    document_type: 'Document types',
    has_eitems: 'Select books with',
    has_items_for_loan: 'Select books with',
    has_items: 'Select books with',
    keywords: 'Keywords',
    languages: 'Languages',
    available_items: 'Available items',
    relations: 'Relations',
  },
  items: {
    status: 'Status',
    medium: 'Medium',
    circulation: 'Circulation',
  },
  loans: {
    state: 'State',
  },
  series: {
    moi: 'Mode of Issuance',
  },
};

export const getSearchConfig = (modelName, extraOptions = {}) => {
  const searchConfig = invenioConfig[modelName]['search'];
  const result = {
    AGGREGATIONS: searchConfig.aggs.map(agg => {
      return { title: aggsMappings[modelName][agg], field: agg };
    }),
    RESULTS_PER_PAGE: resultsPerPageValues,
    SORT_BY: searchConfig.sortBy.values.map(sortField => {
      return {
        text: sortField.title,
        value: sortField.field,
        defaultValue: sortField.default_order,
      };
    }),
    SORT_BY_ON_EMPTY_QUERY: searchConfig.sortBy.onEmptyQuery,
    SORT_ORDER: searchConfig.sortOrder.map(sortField => {
      return { text: capitalize(sortField), value: sortField };
    }),
  };
  return merge(result, extraOptions);
};
