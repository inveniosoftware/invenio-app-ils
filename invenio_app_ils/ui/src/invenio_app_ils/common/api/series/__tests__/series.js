import { series as seriesApi } from '../series';

describe('Series query builder tests', () => {
  it('should build query string with a keyword', () => {
    const query = seriesApi
      .query()
      .withKeyword({ name: 'Keyword 1' })
      .qs();
    expect(query).toEqual('keywords.name:"Keyword 1"');
  });
});
