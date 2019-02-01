import { fromISO } from '../../../../common/api/date';
import { serializer } from '../serializer';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Patron loans serialization tests', () => {
  it('should serialize only id and updated if metadata empty', () => {
    const serialized = serializer.fromJSON({
      id: '123',
      updated: stringDate,
      created: stringDate,
      metadata: {},
    });

    expect(serialized).toEqual({
      document_pid: '123',
      created: fromISO(stringDate),
      updated: fromISO(stringDate),
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: '123',
      updated: stringDate,
      created: stringDate,
      metadata: {
        authors: ['A', 'B'],
        title: 'p',
      },
    });

    expect(serialized).toEqual({
      document_pid: '123',
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      authors: ['A', 'B'],
      title: 'p',
    });
  });
});
