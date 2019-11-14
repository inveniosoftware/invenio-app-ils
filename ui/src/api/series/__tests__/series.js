import { series as seriesApi } from '../series';

describe('Series query builder tests', () => {
  it('should build query string with a tag', () => {
    const query = seriesApi
      .query()
      .withTag({ name: 'Tag 1' })
      .qs();
    expect(query).toEqual('tags.name:"Tag 1"');
  });
});
