import React from 'react';
import { ResultsPerPage, SortBy, SortOrder } from 'react-searchkit';

export function ResultsSort(props) {
  return props.searchConfig.SORT_BY.length ? (
    <div>
      <span>
        Show&nbsp;
        <ResultsPerPage
          values={props.searchConfig.RESULTS_PER_PAGE}
          defaultValue={props.searchConfig.RESULTS_PER_PAGE[0].value}
        />
        &nbsp;results per page sorted by
      </span>
      <div>
        <SortBy
          values={props.searchConfig.SORT_BY}
          defaultValue={props.searchConfig.SORT_BY[0].value}
          defaultValueOnEmptyString={props.searchConfig.SORT_BY_ON_EMPTY_QUERY}
        />
        &nbsp;
        <SortOrder
          values={props.searchConfig.SORT_ORDER}
          defaultValue={props.searchConfig.SORT_ORDER[0]['value']}
        />
      </div>
    </div>
  ) : null;
}
