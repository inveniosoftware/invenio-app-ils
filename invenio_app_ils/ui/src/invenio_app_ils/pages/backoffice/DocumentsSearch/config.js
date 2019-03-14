import { invenioConfig } from '../../../common/config';
import _capitalize from 'lodash/capitalize';

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

const config = invenioConfig.documents.search;
const sortByValues = config.sortBy.values.map(sortField => {
  return { text: sortField.title, value: sortField.field };
});
const sortByValueOnEmptyQuery = config.sortBy.onEmptyQuery;
const sortOrderValues = config.sortOrder.map(sortField => {
  return { text: _capitalize(sortField), value: sortField };
});

const aggsMappings = {
  keywords: 'Keywords',
};
const aggs = config.aggs.map(agg => {
  return { title: aggsMappings[agg], field: agg };
});

export default {
  RESULTS_PER_PAGE: resultsPerPageValues,
  SORT_BY: sortByValues,
  SORT_BY_ON_EMPTY_QUERY: sortByValueOnEmptyQuery,
  SORT_ORDER: sortOrderValues,
  AGGREGATIONS: aggs,
};
