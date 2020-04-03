import * as seriesTestData from '@testData/series.json';
import { literatureRequestSerializerCls } from '../RequestSerializer';

const series = seriesTestData[0];

describe('RequestSerializer tests', () => {
  let serializer;
  beforeEach(() => {
    const LiteratureRequestSerializer = literatureRequestSerializerCls(series);
    serializer = new LiteratureRequestSerializer();
  });

  it('should serialize a request and include all results and filter by series', () => {
    const stateQuery = {
      filters: [],
      page: 1,
      queryString: '',
      size: 15,
      sortBy: 'publication_year',
      sortOrder: 'asc',
    };
    const query = encodeURIComponent(
      `relations.serial.pid_value:${series.pid}`
    );
    expect(serializer.serialize(stateQuery)).toEqual(
      `q=${query}&sort=publication_year&page=1&size=15&include_all`
    );
  });

  it('should serialize a request properly if there already is a queryString', () => {
    const queryString = 'title:"Test title"';
    const stateQuery = {
      filters: [],
      page: 1,
      queryString: queryString,
      size: 15,
      sortBy: 'publication_year',
      sortOrder: 'asc',
    };
    let query = encodeURIComponent(
      `relations.serial.pid_value:${series.pid} AND `
    );
    query += '%28' + encodeURIComponent(queryString) + '%29';
    expect(serializer.serialize(stateQuery)).toEqual(
      `q=${query}&sort=publication_year&page=1&size=15&include_all`
    );
  });
});
