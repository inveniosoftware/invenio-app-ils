import * as seriesTestData from '@testData/series.json';
import _cloneDeep from 'lodash/cloneDeep';
import { qsBuilderForSeries } from './RequestSerializer';

const series = Object.values(seriesTestData);
const serial = series.filter(s => s.mode_of_issuance === 'SERIAL')[0];
const mm = series.filter(s => s.mode_of_issuance === 'MULTIPART_MONOGRAPH')[0];

const stateQuery = {
  filters: [],
  page: 1,
  queryString: '',
  size: 15,
  sortBy: 'publication_year',
  sortOrder: 'asc',
};

let serializer;
describe('RequestSerializer SERIAL tests', () => {
  beforeEach(() => {
    const LiteratureRequestSerializer = qsBuilderForSeries(serial);
    serializer = new LiteratureRequestSerializer();
  });

  const query =
    '%28' +
    encodeURIComponent(
      `relations.serial.pid_value:${serial.pid} OR relations.multipart_monograph.pid_value:${serial.pid}`
    ) +
    '%29';

  it('should serialize a request of a SERIAL and include all results and filter by series', () => {
    expect(serializer.serialize(_cloneDeep(stateQuery))).toEqual(
      `q=${query}&sort=publication_year&page=1&size=15&include_all`
    );
  });

  it('should serialize a request of a SERIAL properly if there already is a queryString', () => {
    const newStateQuery = _cloneDeep(stateQuery);
    const queryString = 'title:"Test title"';
    newStateQuery['queryString'] = queryString;
    const queryWithQs =
      query + '%20AND%20%28' + encodeURIComponent(queryString) + '%29';
    expect(serializer.serialize(newStateQuery)).toEqual(
      `q=${queryWithQs}&sort=publication_year&page=1&size=15&include_all`
    );
  });
});

describe('RequestSerializer MULTIPART_MONOGRAPH tests', () => {
  beforeEach(() => {
    const LiteratureRequestSerializer = qsBuilderForSeries(mm);
    serializer = new LiteratureRequestSerializer();
  });

  const query = encodeURIComponent(
    `relations.multipart_monograph.pid_value:${mm.pid}`
  );
  it('should serialize a request of a MULTIPART_MONOGRAPH and include all results and filter by series', () => {
    expect(serializer.serialize(_cloneDeep(stateQuery))).toEqual(
      `q=${query}&sort=publication_year&page=1&size=15&include_all`
    );
  });

  it('should serialize a request of a MULTIPART_MONOGRAPH properly if there already is a queryString', () => {
    const newStateQuery = _cloneDeep(stateQuery);
    const queryString = 'title:"Test title"';
    newStateQuery['queryString'] = queryString;
    const queryWithQs =
      query + '%20AND%20%28' + encodeURIComponent(queryString) + '%29';
    expect(serializer.serialize(newStateQuery)).toEqual(
      `q=${queryWithQs}&sort=publication_year&page=1&size=15&include_all`
    );
  });
});
