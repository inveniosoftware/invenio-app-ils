import { fromISO } from '../../../../common/api/date';
import { serializer } from '../serializer';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Document object serialization', () => {
  it('should serialize dates', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {},
    });

    expect(serialized).toEqual({
      id: 123,
      created: fromISO(stringDate),
      updated: fromISO(stringDate),
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      links: 'test',
      metadata: {
        document_pid: '123',
        authors: ['A', 'B'],
        title: 'p',
        circulation: {
          next_available_date: stringDate,
        },
      },
    });

    expect(serialized).toEqual({
      document_pid: '123',
      id: 123,
      updated: fromISO(stringDate),
      created: fromISO(stringDate),
      links: 'test',
      metadata: {
        document_pid: '123',
        authors: ['A', 'B'],
        title: 'p',
        circulation: {
          next_available_date: new Date(stringDate).toDateString(),
        },
      },
    });
  });
});
