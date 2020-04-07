import { literature as literatureApi } from './literature';

describe('Literature query builder tests', () => {
  it('should build the query string for literature that belong to a series', () => {
    const query = literatureApi
      .query()
      .withSeriesPid('123', 'SERIAL')
      .qs();
    expect(query).toEqual('relations.serial.pid_value:123');
  });

  it('should build the query string for literature that belong to multiple series', () => {
    const query = literatureApi
      .query()
      .withSeriesPid(['123', '567'], 'MULTIPART_MONOGRAPH')
      .qs();
    expect(query).toEqual(
      'relations.multipart_monograph.pid_value:(123 OR 567)'
    );
  });
});
