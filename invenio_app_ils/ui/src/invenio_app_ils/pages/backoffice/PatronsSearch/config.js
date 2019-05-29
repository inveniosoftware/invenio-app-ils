import { invenioConfig } from '../../../common/config';
import capitalize from 'lodash/capitalize';

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

const config = invenioConfig.patrons.search;
const sortByValues = config.sortBy.values.map(sortField => {
  return { text: sortField.title, value: sortField.field };
});
const sortByValueOnEmptyQuery = config.sortBy.onEmptyQuery;
const sortOrderValues = config.sortOrder.map(sortField => {
  return { text: capitalize(sortField), value: sortField };
});

export default {
  RESULTS_PER_PAGE: resultsPerPageValues,
  SORT_BY: sortByValues,
  SORT_BY_ON_EMPTY_QUERY: sortByValueOnEmptyQuery,
  SORT_ORDER: sortOrderValues,
};
