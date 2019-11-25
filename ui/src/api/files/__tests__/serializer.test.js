import { serializer } from '../serializer';

describe('File serialization tests', () => {
  it('Should serialize file attributes', () => {
    const serialized = serializer.fromJSON({
      checksum: 'abc',
      key: 'test.txt',
      mimetype: 'abc/test',
      size: 100,
      version_id: 'v1',
    });
    expect(serialized).toEqual({
      checksum: 'abc',
      key: 'test.txt',
      mimetype: 'abc/test',
      size: 100,
      version_id: 'v1',
    });
  });
});
