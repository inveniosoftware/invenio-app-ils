import isEmpty from 'lodash/isEmpty';
import { InvenioRequestSerializer } from 'react-searchkit';

export const qsBuilderForSeries = seriesMetadata => {
  const pidValue = seriesMetadata.pid;
  // MM can have has children only documents
  let relationsQuery = `relations.multipart_monograph.pid_value:${pidValue}`;
  if (seriesMetadata.mode_of_issuance === 'SERIAL') {
    // serials can have as children serials or MM
    relationsQuery = `(relations.serial.pid_value:${pidValue} OR ${relationsQuery})`;
  }

  /**
   * Custom serializer to change the query string and retrieve all records that have
   * as parent (relations parent-child) this series.
   */
  return class LiteratureRequestSerializer extends InvenioRequestSerializer {
    serialize(stateQuery) {
      if (isEmpty(stateQuery.queryString)) {
        stateQuery.queryString = relationsQuery;
      } else {
        stateQuery.queryString = `${relationsQuery} AND (${stateQuery.queryString})`;
      }

      const query = `${super.serialize(stateQuery)}&include_all`;
      return query;
    }
  };
};
